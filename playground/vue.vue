<!-- ═══════════════════════════════════════════════════════════════
     Vue Playground — Kanagawa Theme Preview
     ═══════════════════════════════════════════════════════════════ -->

<!-- ── Composition API (script setup) ─────────────────────────── -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, inject, provide, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCounterStore } from '@/stores/counter'
import { onClickOutside } from '@vueuse/core'
import type { FormData, User } from '@/types'
import ChildComponent from './ChildComponent.vue'
import Icon from '~icons/heroicons/rocket'

// ── Props & Emits ───────────────────────────────────────────────
const props = withDefaults(defineProps<{
  title: string
  initial?: number
  users?: User[]
  variant?: 'primary' | 'secondary' | 'ghost'
}>(), {
  initial: 0,
  variant: 'primary',
})

const emit = defineEmits<{
  update: [value: number]
  submit: [data: FormData]
  close: []
  'update:modelValue': [value: string]
}>()

const modelValue = defineModel<string>('modelValue')

// ── Slots ───────────────────────────────────────────────────────
defineSlots<{
  default(props: {}): any
  header(props: { title: string }): any
  footer(): any
}>()

// ── Reactive State ──────────────────────────────────────────────
const count = ref(props.initial)
const name = ref('Kanagawa')
const message = ref('')
const isVisible = ref(true)
const items = ref<string[]>(['alpha', 'beta', 'gamma'])
const selected = ref<number | null>(null)
const form = reactive<FormData>({
  email: '',
  password: '',
  remember: false,
})
const rawHtml = '<span style="color: red">Raw HTML</span>'

// ── Computed ────────────────────────────────────────────────────
const doubled = computed(() => count.value * 2)
const isEven = computed(() => count.value % 2 === 0)
const greeting = computed(() => `Hello, ${name.value}!`)
const sortedItems = computed(() =>
  [...items.value].sort((a, b) => a.localeCompare(b))
)

// ── Watchers ────────────────────────────────────────────────────
watch(count, (newVal, oldVal) => {
  console.log(`count: ${oldVal} → ${newVal}`)
})

watchEffect(() => {
  console.log(`message changed: ${message.value}`)
})

watch([count, name], ([c, n], [pc, pn]) => {
  console.log(`count: ${pc}→${c}, name: ${pn}→${n}`)
})

watch(() => props.title, (val) => {
  document.title = val
})

// ── Lifecycle ───────────────────────────────────────────────────
onMounted(async () => {
  await nextTick()
  console.log('mounted')
})

// ── Methods ─────────────────────────────────────────────────────
function increment(): void {
  count.value++
  emit('update', count.value)
}

async function handleSubmit(): Promise<void> {
  if (!form.email || !form.password) return
  emit('submit', { ...form })
  await nextTick()
}

function toggleVisibility(): void {
  isVisible.value = !isVisible.value
}

async function fetchData(): Promise<void> {
  try {
    const res = await fetch('/api/data')
    const data = await res.json()
    console.log(data)
  } catch (err) {
    console.error(err)
  }
}

// ── Provide / Inject ────────────────────────────────────────────
provide('theme', 'dark')
provide('updateCount', increment)

const parentData = inject<{ user: User }>('parent-data', null)

// ── Router ──────────────────────────────────────────────────────
const router = useRouter()
const route = useRoute()

function navigate(): void {
  router.push({ name: 'dashboard', query: { tab: 'overview' } })
}

const currentRoute = computed(() => route.path)

// ── Pinia Store ─────────────────────────────────────────────────
const store = useCounterStore()
const doubleCount = computed(() => store.doubleCount)
</script>

<!-- ── Template ───────────────────────────────────────────────── -->
<template>
  <div class="container" :class="{ dark: theme === 'dark' }">
    <header>
      <slot name="header" :title="props.title">
        <h1>{{ title }}</h1>
      </slot>
    </header>

    <!-- Interpolation -->
    <p>{{ greeting }}</p>
    <p v-text="message"></p>
    <p v-html="rawHtml"></p>
    <p>{{ count }} × 2 = {{ doubled }}</p>

    <!-- Conditionals -->
    <div v-if="isEven" class="badge even">Even</div>
    <div v-else-if="count === 0" class="badge zero">Zero</div>
    <div v-else class="badge odd">Odd</div>

    <template v-if="isVisible">
      <p>Visible content</p>
    </template>

    <div v-show="isVisible">Shown with v-show</div>

    <!-- Loops -->
    <ul>
      <li
        v-for="(item, index) in sortedItems"
        :key="item"
        :class="{ active: selected === index }"
        @click="selected = index"
      >
        <span>{{ index + 1 }}.</span>
        <span>{{ item }}</span>
      </li>
    </ul>

    <!-- Keyed loop with template -->
    <template v-for="(user, i) in users" :key="user.id">
      <UserCard v-if="user.active" :user="user" />
    </template>

    <!-- Events -->
    <button @click="increment">
      Increment ({{ count }})
    </button>

    <button @click.stop="handleSubmit">
      Submit
    </button>

    <button @click.prevent="fetchData">
      Fetch
    </button>

    <button @click.once="toggleVisibility">
      Toggle
    </button>

    <input
      @keyup.enter="handleSubmit"
      @keyup.escape="emit('close')"
    />

    <!-- v-model -->
    <input v-model="message" placeholder="Message" />
    <input v-model.trim="name" />
    <input v-model.number="count" type="number" />
    <textarea v-model.lazy="message"></textarea>
    <select v-model="selected">
      <option v-for="n in 5" :key="n" :value="n">
        Option {{ n }}
      </option>
    </select>

    <!-- Bindings -->
    <img
      :src="`/avatars/${props.title}.png`"
      :alt="props.title"
      :width="64"
      :height="64"
      loading="lazy"
    />

    <a
      :href="`/users/${props.initial}`"
      :class="['link', variant]"
      :style="{ color: isActive ? 'blue' : 'gray' }"
      :data-index="count"
      :aria-current="isActive ? 'page' : undefined"
    >
      Profile
    </a>

    <!-- Dynamic component -->
    <component :is="isEven ? 'div' : 'span'">
      Dynamic component
    </component>

    <!-- Teleport -->
    <Teleport to="#modal-root">
      <div v-if="isVisible" class="modal">Modal content</div>
    </Teleport>

    <!-- Suspense -->
    <Suspense>
      <template #default>
        <AsyncComponent />
      </template>
      <template #fallback>
        <LoadingSpinner />
      </template>
    </Suspense>

    <!-- KeepAlive -->
    <KeepAlive :max="3">
      <component :is="currentView" />
    </KeepAlive>

    <!-- Transition -->
    <Transition name="fade" mode="out-in">
      <div :key="count">{{ count }}</div>
    </Transition>

    <TransitionGroup name="list" tag="ul">
      <li v-for="item in items" :key="item">{{ item }}</li>
    </TransitionGroup>

    <!-- Slots -->
    <ChildComponent v-slot="{ data }">
      <p>{{ data }}</p>
    </ChildComponent>

    <ChildComponent>
      <template #default>Default slot</template>
      <template #footer>Footer slot</template>
    </ChildComponent>

    <!-- Slot props shorthand -->
    <ChildComponent v-slot="{ user }">
      <span>{{ user.name }}</span>
    </ChildComponent>

    <!-- Provide / Inject usage -->
    <DescendantComponent />

    <!-- Router -->
    <router-link :to="{ name: 'about', params: { id: '1' } }">
      About
    </router-link>
    <router-link to="/contact" active-class="active-link">
      Contact
    </router-link>

    <!-- Router View -->
    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>

    <!-- Icon component -->
    <Icon class="icon" />

    <slot name="footer" />
    <slot />
  </div>
</template>

<!-- ── Options API ────────────────────────────────────────────── -->
<script lang="ts">
import { defineComponent, mapState, mapActions } from 'vue'
import { useCounterStore } from '@/stores/counter'

export default defineComponent({
  name: 'OptionsComponent',

  inheritAttrs: false,

  components: {
    ChildComponent,
  },

  props: {
    title: { type: String, required: true },
    count: { type: Number, default: 0 },
    items: { type: Array as PropType<string[]>, default: () => [] },
  },

  emits: ['update', 'submit'],

  expose: ['reset', 'validate'],

  data() {
    return {
      message: '',
      isOpen: false,
    }
  },

  computed: {
    ...mapState(useCounterStore, ['count', 'doubleCount']),
  },

  methods: {
    ...mapActions(useCounterStore, ['increment', 'reset']),

    validate(): boolean {
      return this.message.length > 0
    },
  },

  watch: {
    title(newVal: string) {
      document.title = newVal
    },
    message: {
      handler(val: string) {
        localStorage.setItem('draft', val)
      },
      deep: true,
      immediate: true,
    },
  },

  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeUnmount() {},
  unmounted() {},

  errorCaptured(err: Error, instance: any, info: string) {
    console.error(err, info)
    return false
  },

  render() {
    return h('div', this.message)
  },
})
</script>

<!-- ── Styles ─────────────────────────────────────────────────── -->
<style scoped>
.container {
  padding: 1rem;
  color: v-bind('color');
  font-family: 'Inter', sans-serif;
}

.dark .container {
  background: #1F1F28;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #DCD7BA;
}

.badge {
  display: inline-block;
  padding: 0.25em 0.5em;
  border-radius: 4px;
  font-size: 0.875rem;
}

.badge.even {
  background: #76946A;
  color: #fff;
}

.badge.odd {
  background: #C34043;
  color: #fff;
}

.badge.zero {
  background: #54546D;
  color: #DCD7BA;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.link {
  text-decoration: none;
  transition: color 0.2s;
}

.link.primary { color: #7E9CD8; }
.link.secondary { color: #7AA89F; }
.link.ghost { color: #54546D; }
</style>

<style module>
.header {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>

<!-- ── i18n / Custom Blocks ───────────────────────────────────── -->
<i18n>
{
  "en": { "title": "Hello" },
  "zh": { "title": "你好" }
}
</i18n>
