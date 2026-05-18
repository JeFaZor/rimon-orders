<script setup lang="ts">
import { ref, reactive, computed, h, type FunctionalComponent } from 'vue'
import { vegetables } from './data/vegetables'
import { RESTAURANT_NAME, SUPPLIERS } from './config'
import rimonLogo from './assets/rimon-logo.png'

type TabId = 'plastic' | 'vegetables' | 'soon'

// Inline SVG icon components (Lucide-style: 24x24, stroke-based)
const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 1.8,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
}
const IconLeaf: FunctionalComponent = () =>
  h('svg', iconProps, [
    h('path', { d: 'M11 20A7 7 0 0 1 4 13c0-5 4-9 11-9h7v6c0 6-4 10-9 10Z' }),
    h('path', { d: 'M2 21c0-3 1.85-5.36 5-6' }),
  ])
const IconPackage: FunctionalComponent = () =>
  h('svg', iconProps, [
    h('path', { d: 'M16.5 9.4 7.55 4.24' }),
    h('path', { d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z' }),
    h('polyline', { points: '3.27 6.96 12 12.01 20.73 6.96' }),
    h('line', { x1: 12, y1: 22.08, x2: 12, y2: 12 }),
  ])
const IconClock: FunctionalComponent = () =>
  h('svg', iconProps, [
    h('circle', { cx: 12, cy: 12, r: 10 }),
    h('polyline', { points: '12 6 12 12 16 14' }),
  ])
const IconSend: FunctionalComponent = () =>
  h('svg', { ...iconProps, width: 18, height: 18 }, [
    h('path', { d: 'M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z' }),
    h('path', { d: 'm21.854 2.147-10.94 10.939' }),
  ])
const IconCheck: FunctionalComponent = () =>
  h('svg', { ...iconProps, width: 14, height: 14, 'stroke-width': 2.5 }, [
    h('polyline', { points: '20 6 9 17 4 12' }),
  ])

interface Tab {
  id: TabId
  label: string
  icon: FunctionalComponent
}
const tabs: Tab[] = [
  { id: 'soon', label: 'בקרוב', icon: IconClock },
  { id: 'vegetables', label: 'ירקות', icon: IconLeaf },
  { id: 'plastic', label: 'פלסטיק', icon: IconPackage },
]
const activeTab = ref<TabId>('vegetables')
const quantities = reactive<Record<string, number>>(
  Object.fromEntries(vegetables.map(v => [v.id, 0]))
)
const showSendModal = ref(false)
const notes = ref('')
const orderItemsCount = computed(() => {
  return Object.values(quantities).filter(qty => qty > 0).length
})
function increaseQuantity(itemId: string) {
  if (!quantities[itemId]) {
    quantities[itemId] = 0
  }
  quantities[itemId] += 1
}

function decreaseQuantity(itemId: string) {
  if (!quantities[itemId]) {
    quantities[itemId] = 0
  }
  if (quantities[itemId] > 0) {
    quantities[itemId] -= 1
  }
}
function sendOrder() {
  const date = getTodayDateString()

  const lines = vegetables
    .filter(item => (quantities[item.id] ?? 0) > 0)
    .map(item => {
      const name = item.fullName ?? (item.isGradeB ? `${item.name} ב'` : item.name)
      return `${name} - ${quantities[item.id] ?? 0} ${item.unit}`
    })
    .join('\n')

  let message = `הזמנה - ${RESTAURANT_NAME} ${date}:\n\n${lines}`

  if (notes.value.trim()) {
    message += `\n\nהערות: ${notes.value.trim()}`
  }

  const url = `https://wa.me/${SUPPLIERS.vegetables}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}
function confirmSend() {
  sendOrder()
  showSendModal.value = false
}
function selectAll(event: FocusEvent) {
  (event.target as HTMLInputElement).select()
}
function snapToHalf(itemId: string) {
  const current = quantities[itemId]
  if (typeof current !== 'number' || isNaN(current) || current < 0) {
    quantities[itemId] = 0
  } else {
    quantities[itemId] = Math.round(current * 2) / 2
  }
}
function getTodayDateString(): string {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}
</script>

<template>
  <div class="h-dvh flex flex-col bg-slate-50 text-slate-900">
    <!-- Header -->
    <header class="shrink-0 bg-white border-b border-slate-200 px-4 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] touch-none">
      <div class="flex flex-col items-center">
        <img :src="rimonLogo" alt="רימון בריאות ישראלית" class="h-12 w-12 object-contain" />
        <p class="text-[11px] text-slate-500 mt-1 tracking-wide">הזמנות סחורה</p>
      </div>
    </header>

    <!-- Main content area -->
    <main class="flex-1 overflow-y-auto overscroll-contain">
      <!-- Soon tab -->
      <div v-if="activeTab === 'soon'" class="flex flex-col items-center justify-center h-full text-center px-8">
        <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <IconClock />
        </div>
        <p class="text-base font-semibold text-slate-800">בקרוב</p>
        <p class="text-sm mt-1.5 text-slate-500 max-w-xs leading-relaxed">
          קטגוריה זו בפיתוח. עדכונים יגיעו בהמשך.
        </p>
      </div>

      <!-- Vegetables tab -->
      <div v-else-if="activeTab === 'vegetables'" class="divide-y divide-slate-200/70 bg-white">
        <div v-for="item in vegetables" :key="item.id"
          class="relative flex items-center px-4 py-3.5 transition-colors"
          :class="(quantities[item.id] ?? 0) > 0 ? 'bg-emerald-50/40' : ''">
          <!-- Active accent bar (RTL: on right) -->
          <span v-if="(quantities[item.id] ?? 0) > 0"
            class="absolute inset-y-0 right-0 w-[3px] bg-emerald-600"></span>

          <!-- Item info -->
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <span class="text-2xl shrink-0 leading-none opacity-90" aria-hidden="true">{{ item.icon }}</span>
            <div class="flex flex-col min-w-0 leading-tight">
              <div class="flex items-center gap-1.5">
                <span class="text-[17px] font-medium text-slate-900 truncate">{{ item.name }}</span>
                <span v-if="item.isGradeB"
                  class="shrink-0 text-[11px] font-semibold px-1.5 py-px rounded border border-slate-300 text-slate-600 bg-white">ב'</span>
              </div>
              <span class="text-[12px] text-slate-400 mt-0.5 tracking-wide">{{ item.unit }}</span>
            </div>
          </div>

          <!-- Quantity controls -->
          <div class="flex items-center gap-1.5 shrink-0">
            <button @pointerdown.prevent="decreaseQuantity(item.id)" aria-label="הפחת כמות"
              class="w-10 h-10 rounded-md border border-slate-200 bg-white text-slate-600 text-lg flex items-center justify-center active:bg-slate-100 disabled:opacity-30"
              :disabled="(quantities[item.id] ?? 0) === 0">
              −
            </button>
            <input type="number" inputmode="decimal" step="0.5" min="0" v-model.number="quantities[item.id]"
              @focus="selectAll" @blur="snapToHalf(item.id)"
              class="w-12 h-10 text-center text-base font-semibold text-slate-900 tabular-nums bg-transparent focus:outline-none focus:bg-slate-50 rounded-md" />
            <button @pointerdown.prevent="increaseQuantity(item.id)" aria-label="הוסף כמות"
              class="w-10 h-10 rounded-md bg-slate-900 text-white text-lg flex items-center justify-center active:bg-slate-700">
              +
            </button>
          </div>
        </div>
      </div>

      <!-- Plastic tab -->
      <div v-else-if="activeTab === 'plastic'"
        class="flex flex-col items-center justify-center h-full text-center px-8">
        <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <IconPackage />
        </div>
        <p class="text-base font-semibold text-slate-800">פלסטיק</p>
        <p class="text-sm mt-1.5 text-slate-500 max-w-xs leading-relaxed">
          מוצרי פלסטיק יתווספו לקטגוריה זו בקרוב.
        </p>
      </div>
    </main>

    <!-- Action bar -->
    <div v-if="orderItemsCount > 0"
      class="shrink-0 bg-white border-t border-slate-200 px-4 py-3 touch-none">
      <button @click="showSendModal = true"
        class="w-full bg-emerald-600 text-white text-[15px] font-semibold py-3 rounded-lg active:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
        <IconSend />
        <span>שלח הזמנה</span>
        <span class="text-emerald-100 font-normal">·</span>
        <span class="tabular-nums">{{ orderItemsCount }} פריטים</span>
      </button>
    </div>

    <!-- Bottom tab bar -->
    <nav class="shrink-0 bg-white border-t border-slate-200 pb-[env(safe-area-inset-bottom)] touch-none">
      <div class="grid grid-cols-3">
        <button v-for="tab in tabs" :key="tab.id" :class="[
          'relative flex flex-col items-center justify-center py-2.5 gap-1 transition-colors',
          activeTab === tab.id ? 'text-emerald-700' : 'text-slate-400 active:text-slate-600'
        ]" @click="activeTab = tab.id">
          <!-- Active top indicator -->
          <span v-if="activeTab === tab.id"
            class="absolute top-0 inset-x-6 h-[2px] bg-emerald-600 rounded-b-full"></span>

          <span class="relative leading-none">
            <component :is="tab.icon" />
            <span v-if="tab.id === 'vegetables' && orderItemsCount > 0"
              class="absolute -top-1.5 -left-2 bg-emerald-600 text-white text-[10px] font-semibold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center ring-2 ring-white tabular-nums">
              {{ orderItemsCount }}
            </span>
          </span>
          <span class="text-[11px] font-medium tracking-tight">{{ tab.label }}</span>
        </button>
      </div>
    </nav>

    <!-- Send Order Modal -->
    <div v-if="showSendModal"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm"
      @click.self="showSendModal = false">
      <div class="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 space-y-5 animate-slide-up">
        <!-- Modal handle (mobile) -->
        <div class="sm:hidden w-10 h-1 bg-slate-300 rounded-full mx-auto -mt-1"></div>

        <div>
          <h2 class="text-base font-semibold text-slate-900">סיכום הזמנה</h2>
          <p class="text-sm text-slate-500 mt-1 tabular-nums">{{ orderItemsCount }} פריטים נבחרו</p>
        </div>

        <div>
          <label for="notes" class="flex items-center justify-between text-[13px] font-medium text-slate-700 mb-1.5">
            <span>הערות לספק</span>
            <span class="text-[11px] text-slate-400 font-normal">אופציונלי</span>
          </label>
          <textarea id="notes" v-model="notes" rows="3"
            placeholder="לדוגמה: משלוח עד 10:00, עגבניות בשלות"
            class="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg resize-none focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors placeholder:text-slate-400"></textarea>
        </div>

        <div class="flex gap-2 pt-1">
          <button @click="showSendModal = false"
            class="flex-1 bg-white border border-slate-200 text-slate-700 text-[15px] font-medium py-3 rounded-lg active:bg-slate-50 transition-colors">
            ביטול
          </button>
          <button @click="confirmSend"
            class="flex-[1.5] bg-emerald-600 text-white text-[15px] font-semibold py-3 rounded-lg active:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
            <IconCheck />
            <span>אישור ושליחה</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slide-up 0.22s ease-out;
}
</style>
