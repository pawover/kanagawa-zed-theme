// ═══════════════════════════════════════════════════════════════
//   Go Playground — Kanagawa Theme Preview
// ═══════════════════════════════════════════════════════════════

package main

import (
	"context"
	"crypto/sha256"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"math"
	"net/http"
	"os"
	"os/signal"
	"slices"
	"sync"
	"syscall"
	"time"
)

// ── Constants & Variables ──────────────────────────────────────
const (
	AppName    = "Kanagawa"
	AppVersion = "0.0.2"
	MaxRetries = 3
	Timeout    = 30 * time.Second
)

var (
	startTime = time.Now()
	config    *Config
	re        = regexp.MustCompile(`^\w+@\w+\.\w+$`)
)

// Zero values
var (
	zeroInt    int
	zeroFloat  float64
	zeroBool   bool
	zeroString string
	zeroSlice  []int
	zeroMap    map[string]int
	zeroPtr    *string
	zeroFunc   func()
	zeroIface  interface{}
	zeroStruct struct{}
	zeroChan   chan int
)

// ── Types ──────────────────────────────────────────────────────
type ID = string

type Status int

const (
	StatusPending Status = iota
	StatusRunning
	StatusDone
	StatusFailed
)

type Color struct {
	Name  string `json:"name"`
	Hex   string `json:"hex"`
	Role  string `json:"role,omitempty"`
	mu    sync.RWMutex
}

type Point struct {
	X, Y float64
	label string
}

type Option[T any] struct {
	Valid bool
	Value T
}

type Handler func(ctx context.Context, req *Request) (*Response, error)

// ── Interfaces ─────────────────────────────────────────────────
type Logger interface {
	Debug(msg string, args ...any)
	Info(msg string, args ...any)
	Error(msg string, args ...any)
	With(args ...any) Logger
}

type Reader interface {
	Read(p []byte) (n int, err error)
}

type Writer interface {
	Write(p []byte) (n int, err error)
}

type ReadWriter interface {
	Reader
	Writer
}

// ── Struct Methods ─────────────────────────────────────────────
func (c *Color) String() string {
	return fmt.Sprintf("%s (%s)", c.Name, c.Hex)
}

func (c *Color) Lock()   { c.mu.Lock() }
func (c *Color) Unlock() { c.mu.Unlock() }

func (p Point) Distance(q Point) float64 {
	dx := p.X - q.X
	dy := p.Y - q.Y
	return math.Sqrt(dx*dx + dy*dy)
}

func (p *Point) Scale(factor float64) {
	p.X *= factor
	p.Y *= factor
}

// ── Functions ──────────────────────────────────────────────────
func main() {
	ctx, cancel := signal.NotifyContext(
		context.Background(),
		syscall.SIGINT,
		syscall.SIGTERM,
	)
	defer cancel()

	if err := run(ctx); err != nil {
		slog.Error("fatal", "error", err)
		os.Exit(1)
	}
}

func run(ctx context.Context) error {
	slog.Info("starting", "app", AppName, "version", AppVersion)

	cfg, err := LoadConfig("config.json")
	if err != nil {
		return fmt.Errorf("load config: %w", err)
	}
	config = cfg

	srv := NewServer(cfg)
	return srv.Start(ctx)
}

func NewServer(cfg *Config) *Server {
	return &Server{
		addr:    cfg.Addr,
		logger:  slog.Default().With("service", "http"),
		handler: http.DefaultServeMux,
	}
}

// ── Control Flow ───────────────────────────────────────────────
func classify(n int) string {
	switch {
	case n < 0:
		return "negative"
	case n == 0:
		return "zero"
	case n < 10:
		return "small"
	case n < 100:
		return "medium"
	default:
		return "large"
	}
}

func process(items []int) {
	for i, v := range items {
		fmt.Printf("items[%d] = %d\n", i, v)
	}

	for i := 0; i < len(items); i++ {
		if items[i] == 0 {
			continue
		}
		if items[i] < 0 {
			break
		}
	}

	for _, item := range items {
		switch item % 2 {
		case 0:
			fmt.Println(item, "is even")
		case 1:
			fmt.Println(item, "is odd")
		}
	}
}

func retry(attempts int, fn func() error) error {
	var err error
	for i := range attempts {
		if err = fn(); err == nil {
			return nil
		}
		if i < attempts-1 {
			time.Sleep(time.Second * time.Duration(i+1))
		}
	}
	return fmt.Errorf("after %d attempts: %w", attempts, err)
}

// ── Error Handling ─────────────────────────────────────────────
var (
	ErrNotFound = errors.New("not found")
	ErrTimeout  = errors.New("timeout")
	ErrInvalid  = errors.New("invalid input")
)

type HTTPError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func (e *HTTPError) Error() string {
	return fmt.Sprintf("HTTP %d: %s", e.Code, e.Message)
}

func handleError(err error) {
	if err == nil {
		return
	}

	var httpErr *HTTPError
	switch {
	case errors.Is(err, ErrNotFound):
		fmt.Println("404")
	case errors.As(err, &httpErr):
		fmt.Printf("HTTP error: %d\n", httpErr.Code)
	case err != nil:
		fmt.Println("unknown:", err)
	}
}

// ── Goroutines & Channels ──────────────────────────────────────
func worker(id int, jobs <-chan Job, results chan<- Result) {
	for job := range jobs {
		slog.Debug("processing", "worker", id, "job", job.ID)

		result := Result{
			ID:     job.ID,
			Status: StatusDone,
		}

		select {
		case <-time.After(job.Duration):
			results <- result
		case <-time.After(100 * time.Millisecond):
			result.Status = StatusFailed
			result.Err = ErrTimeout
			results <- result
		}
	}
}

func fanOut(ctx context.Context, jobs []Job, n int) []Result {
	jobCh := make(chan Job, len(jobs))
	resCh := make(chan Result, len(jobs))

	var wg sync.WaitGroup
	for range n {
		wg.Add(1)
		go func() {
			defer wg.Done()
			worker(0, jobCh, resCh)
		}()
	}

	go func() {
		defer close(jobCh)
		for _, job := range jobs {
			select {
			case jobCh <- job:
			case <-ctx.Done():
				return
			}
		}
	}()

	go func() {
		wg.Wait()
		close(resCh)
	}()

	var results []Result
	for res := range resCh {
		results = append(results, res)
	}
	return results
}

func merge(chs ...<-chan int) <-chan int {
	out := make(chan int)
	var wg sync.WaitGroup
	wg.Add(len(chs))

	go func() {
		wg.Wait()
		close(out)
	}()

	for _, ch := range chs {
		go func(c <-chan int) {
			defer wg.Done()
			for v := range c {
				out <- v
			}
		}(ch)
	}

	return out
}

// ── Channels & Select ──────────────────────────────────────────
func multiplex(ctx context.Context, a, b <-chan int) <-chan int {
	out := make(chan int)

	go func() {
		defer close(out)

		for a != nil || b != nil {
			select {
			case <-ctx.Done():
				return
			case v, ok := <-a:
				if !ok {
					a = nil
					continue
				}
				out <- v
			case v, ok := <-b:
				if !ok {
					b = nil
					continue
				}
				out <- v
			}
		}
	}()

	return out
}

// ── Defer, Panic, Recover ──────────────────────────────────────
func safeCall(fn func()) (err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("panic: %v", r)
		}
	}()

	fn()
	return nil
}

func withCleanup() {
	r, err := os.Open("file.txt")
	if err != nil {
		panic(err)
	}
	defer r.Close()
	defer func() {
		fmt.Println("cleanup done")
	}()

	_, _ = io.Copy(io.Discard, r)
}

// ── Generics ───────────────────────────────────────────────────
func Map[T, U any](s []T, f func(T) U) []U {
	result := make([]U, len(s))
	for i, v := range s {
		result[i] = f(v)
	}
	return result
}

func Filter[T any](s []T, pred func(T) bool) []T {
	var result []T
	for _, v := range s {
		if pred(v) {
			result = append(result, v)
		}
	}
	return result
}

func Reduce[T, U any](s []T, init U, f func(U, T) U) U {
	acc := init
	for _, v := range s {
		acc = f(acc, v)
	}
	return acc
}

type Stack[T any] struct {
	items []T
	mu    sync.Mutex
}

func (s *Stack[T]) Push(v T) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.items = append(s.items, v)
}

func (s *Stack[T]) Pop() (T, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if len(s.items) == 0 {
		var zero T
		return zero, false
	}
	v := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return v, true
}

// ── Struct Tags & JSON ─────────────────────────────────────────
type Config struct {
	Addr    string        `json:"addr" yaml:"addr" toml:"addr"`
	Port    int           `json:"port" yaml:"port" toml:"port"`
	DB      DatabaseConfig `json:"database" yaml:"database"`
	Timeout time.Duration `json:"timeout" yaml:"timeout"`
	Debug   bool          `json:"debug" yaml:"debug"`
}

type DatabaseConfig struct {
	Driver string `json:"driver" yaml:"driver"`
	DSN    string `json:"dsn" yaml:"dsn"`
	MaxConns int  `json:"max_conns" yaml:"max_conns"`
}

func LoadConfig(path string) (*Config, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var cfg Config
	dec := json.NewDecoder(f)
	dec.DisallowUnknownFields()

	if err := dec.Decode(&cfg); err != nil {
		return nil, fmt.Errorf("decode config: %w", err)
	}
	return &cfg, nil
}

// ── HTTP Server ────────────────────────────────────────────────
type Server struct {
	addr    string
	logger  Logger
	handler http.Handler
	server  *http.Server
}

func (s *Server) Start(ctx context.Context) error {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", s.handleHealth)
	mux.HandleFunc("GET /api/users/{id}", s.handleGetUser)
	mux.HandleFunc("POST /api/users", s.handleCreateUser)

	s.server = &http.Server{
		Addr:        s.addr,
		Handler:     middleware(mux, s.logger),
		ReadTimeout: 10 * time.Second,
		IdleTimeout: 60 * time.Second,
	}

	errCh := make(chan error, 1)
	go func() {
		s.logger.Info("listening", "addr", s.addr)
		if err := s.server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
		}
	}()

	select {
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(
			context.Background(), 10*time.Second,
		)
		defer cancel()
		return s.server.Shutdown(shutdownCtx)
	case err := <-errCh:
		return err
	}
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]any{
		"status": "ok",
		"uptime": time.Since(startTime).String(),
	})
}

func (s *Server) handleGetUser(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	_ = id
	w.Write([]byte("user"))
}

func (s *Server) handleCreateUser(w http.ResponseWriter, r *http.Request) {
	var user struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	w.WriteHeader(http.StatusCreated)
}

// ── Middleware ──────────────────────────────────────────────────
func middleware(next http.Handler, logger Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		logger.Info("request",
			"method", r.Method,
			"path", r.URL.Path,
			"remote", r.RemoteAddr,
		)

		next.ServeHTTP(w, r)

		logger.Debug("completed",
			"duration", time.Since(start),
		)
	})
}

// ── Embedding ──────────────────────────────────────────────────
type Base struct {
	ID   string
	Date time.Time
}

type User struct {
	Base
	Name  string
	Email string
}

type Admin struct {
	User
	Role string
}

// ── Closures & Function Literals ───────────────────────────────
func fibonacci() func() int {
	a, b := 0, 1
	return func() int {
		a, b = b, a+b
		return a
	}
}

func compose[A, B, C any](f func(B) C, g func(A) B) func(A) C {
	return func(x A) C {
		return f(g(x))
	}
}

// ── init ────────────────────────────────────────────────────────
func init() {
	slog.SetDefault(slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{
		Level: slog.LevelDebug,
	})))
}

// ── Type Aliases & Conversions ─────────────────────────────────
type ByteCount int64

const (
	_       = iota
	KB ByteCount = 1 << (10 * iota)
	MB
	GB
	TB
)

func (b ByteCount) String() string {
	switch {
	case b >= TB:
		return fmt.Sprintf("%.2f TB", float64(b)/float64(TB))
	case b >= GB:
		return fmt.Sprintf("%.2f GB", float64(b)/float64(GB))
	case b >= MB:
		return fmt.Sprintf("%.2f MB", float64(b)/float64(MB))
	case b >= KB:
		return fmt.Sprintf("%.2f KB", float64(b)/float64(KB))
	default:
		return fmt.Sprintf("%d B", b)
	}
}

// ── Channels: ticker & timer ───────────────────────────────────
func heartbeat(ctx context.Context, interval time.Duration) <-chan time.Time {
	ticker := time.NewTicker(interval)
	ch := make(chan time.Time)

	go func() {
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case t := <-ticker.C:
				ch <- t
			}
		}
	}()

	return ch
}

// ── Maps & Struct Literals ─────────────────────────────────────
var palette = map[string]Color{
	"bg":  {Name: "Sumi Ink",  Hex: "#1F1F28", Role: "background"},
	"fg":  {Name: "Fuji White", Hex: "#DCD7BA", Role: "foreground"},
	"blue": {Name: "Wave Blue", Hex: "#7E9CD8", Role: "function"},
}

// ── Slices ─────────────────────────────────────────────────────
func sliceOps() {
	s := make([]int, 0, 10)
	s = append(s, 1, 2, 3, 4, 5)

	s = slices.Delete(s, 1, 3)
	s = slices.Insert(s, 1, 10, 20)
	s = slices.Clip(s)
	slices.Sort(s)
	slices.Reverse(s)

	idx := slices.Index(s, 10)
	has := slices.Contains(s, 20)
	all := slices.Equal(s, []int{10, 20, 5})
	_ = idx
	_ = has
	_ = all
}

// ── Tests & Benchmark (for highlight only) ─────────────────────
func TestFibonacci(t *testing.T) {
	f := fibonacci()
	got := f()
	want := 1
	if got != want {
		t.Errorf("got %d, want %d", got, want)
	}
}

func BenchmarkFibonacci(b *testing.B) {
	f := fibonacci()
	for b.Loop() {
		f()
	}
}

func ExampleFibonacci() {
	f := fibonacci()
	fmt.Println(f())
	// Output: 1
}
