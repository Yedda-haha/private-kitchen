<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { Search, Plus, Save, X, Calculator, Trash2, TrendingUp } from 'lucide-vue-next';
import DataManager from '../utils/storage';
import type { IngredientPrice } from '../utils/storage';
import PriceLineChart from '../components/PriceLineChart.vue';

const prices = ref<Record<string, IngredientPrice>>({});
const searchQuery = ref('');

// Modal State
const showModal = ref(false);
const isEdit = ref(false);
const form = ref({
  name: '',
  totalPrice: '' as string | number,
  quantity: '' as string | number,
  unit: '个',
  price: 0
});
const currentHistory = ref<any[]>([]);

const loadPrices = () => {
  const storedPrices = DataManager.getPrices();
  const recipes = DataManager.getRecipes();
  
  // Merge logic: Start with stored prices
  const merged: Record<string, IngredientPrice> = { ...storedPrices };
  
  // Add ingredients from recipes that are not in stored prices
  recipes.forEach(r => {
    r.ingredients.forEach(ing => {
      if (!merged[ing.name]) {
        merged[ing.name] = {
          name: ing.name,
          price: 0,
          unit: ing.unit,
          lastUpdated: 0
        };
      }
    });
  });
  
  prices.value = merged;
};

onMounted(() => {
  loadPrices();
});

const filteredList = computed(() => {
  return Object.values(prices.value).filter(item => 
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  ).sort((a, b) => {
    // Sort by updated time (desc), then by price status (priced first)
    if (a.lastUpdated !== b.lastUpdated) return b.lastUpdated - a.lastUpdated;
    return (b.price > 0 ? 1 : 0) - (a.price > 0 ? 1 : 0);
  });
});

// Auto-calculate Unit Price
watch(() => [form.value.totalPrice, form.value.quantity], () => {
  const total = Number(form.value.totalPrice);
  const qty = Number(form.value.quantity);
  if (total > 0 && qty > 0) {
    form.value.price = parseFloat((total / qty).toFixed(2));
  } else {
    // Keep existing price if invalid input, or reset? 
    // Better to not reset automatically if user wants to just see it, 
    // but if they are typing, we should probably update.
    // Let's assume if they clear inputs, we don't zero out price immediately unless it was calculated.
  }
});

const openAdd = () => {
  isEdit.value = false;
  form.value = { name: '', totalPrice: '', quantity: '', unit: '个', price: 0 };
  currentHistory.value = [];
  showModal.value = true;
};

const openEdit = (item: IngredientPrice) => {
  isEdit.value = true;
  form.value = { 
    name: item.name, 
    totalPrice: '', 
    quantity: '', 
    unit: item.unit, 
    price: item.price 
  };
  currentHistory.value = item.history || [];
  // Ensure current price is in history for chart if history is empty but price exists (legacy data)
  if (currentHistory.value.length === 0 && item.price > 0) {
    currentHistory.value = [{ date: item.lastUpdated || Date.now(), price: item.price }];
  }
  showModal.value = true;
};

const save = () => {
  if (!form.value.name.trim()) return alert('请输入食材名称');
  
  DataManager.updatePrice(form.value.name, form.value.price, form.value.unit);
  showModal.value = false;
  loadPrices(); // Reload to refresh list and fix the disappearance bug
};

const remove = () => {
  if (!form.value.name) return;
  if (confirm(`确定要删除"${form.value.name}"的价格信息吗？`)) {
    const prices = DataManager.getPrices();
    delete prices[form.value.name];
    localStorage.setItem('pk_prices', JSON.stringify(prices));
    showModal.value = false;
    loadPrices();
  }
};
</script>

<template>
  <div class="p-4 space-y-6 pb-24 relative min-h-screen">
    <header class="flex justify-between items-center mt-2">
      <div>
        <h1 class="text-2xl font-bold text-neu-text tracking-wide flex items-center gap-2">
          今日菜价 <TrendingUp :size="24" class="text-neu-primary" />
        </h1>
        <p class="text-xs text-neu-text-secondary mt-1 font-medium">看看菜场行情</p>
      </div>
      <button @click="openAdd" class="neu-btn-icon text-neu-primary">
        <Plus :size="24" />
      </button>
    </header>

    <!-- Search -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索食材..."
        class="neu-input pr-12"
      />
      <Search class="absolute right-4 top-3.5 text-neu-text-secondary" :size="20" />
    </div>

    <!-- List -->
    <div class="space-y-4">
      <div
        v-for="item in filteredList"
        :key="item.name"
        @click="openEdit(item)"
        class="neu-flat p-5 rounded-2xl flex justify-between items-center active:neu-pressed transition-all cursor-pointer"
      >
        <div class="flex-1">
          <h3 class="font-bold text-neu-text text-lg">{{ item.name }}</h3>
          <p class="text-xs text-neu-text-secondary mt-1 font-medium">
            {{ item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : '从未录入' }}
          </p>
        </div>
        <div class="text-right">
          <div class="font-bold text-xl" :class="item.price > 0 ? 'text-neu-primary' : 'text-neu-text-secondary/50'">
            {{ item.price > 0 ? `¥${item.price}` : '--' }}
          </div>
          <div class="text-xs text-neu-text-secondary font-medium">元/{{ item.unit }}</div>
        </div>
      </div>
    </div>

    <!-- Edit/Add Modal -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-neu-base/80 backdrop-blur-sm" @click="showModal = false"></div>
      
      <!-- Card -->
      <div class="bg-neu-base w-full sm:w-96 rounded-t-3xl sm:rounded-3xl neu-float relative animate-in slide-in-from-bottom-10 duration-300 max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex justify-between items-center p-6 border-b border-neu-secondary/20 flex-shrink-0">
          <h2 class="text-xl font-bold text-neu-text">{{ isEdit ? '录入菜价' : '新增食材' }}</h2>
          <div class="flex items-center space-x-2">
            <button v-if="isEdit" @click="remove" class="neu-btn-icon text-neu-text-secondary hover:text-red-500">
              <Trash2 :size="20" />
            </button>
            <button @click="showModal = false" class="neu-btn-icon">
              <X :size="24" />
            </button>
          </div>
        </div>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto p-6 scrollbar-hide">
          <!-- Chart (Only in Edit Mode) -->
          <div v-if="isEdit" class="mb-6">
            <PriceLineChart :data="currentHistory" :days="120" />
          </div>

          <div class="space-y-6">
            <!-- Name -->
            <div>
              <label class="block text-xs font-bold text-neu-text-secondary mb-2 uppercase tracking-wider">食材名称</label>
              <input
                v-model="form.name"
                :disabled="isEdit"
                type="text"
                class="neu-input font-bold disabled:opacity-60"
                placeholder="例如：土豆"
              />
            </div>

            <!-- Calculation Row -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-bold text-neu-text-secondary mb-2 uppercase tracking-wider">总价 (元)</label>
                <input
                  v-model="form.totalPrice"
                  type="number"
                  class="neu-input font-bold"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-neu-text-secondary mb-2 uppercase tracking-wider">数量</label>
                <input
                  v-model="form.quantity"
                  type="number"
                  class="neu-input font-bold"
                  placeholder="0"
                />
              </div>
            </div>

            <!-- Unit & Calculated Price -->
            <div class="flex space-x-6 items-end">
               <div class="w-24">
                <label class="block text-xs font-bold text-neu-text-secondary mb-2 uppercase tracking-wider">单位</label>
                <input
                  v-model="form.unit"
                  type="text"
                  class="neu-input font-bold text-center"
                />
              </div>
              <div class="flex-1 neu-pressed rounded-xl p-4 flex items-center justify-between border border-neu-secondary/20">
                <div class="text-xs text-neu-primary font-bold flex items-center">
                  <Calculator :size="14" class="mr-1" /> 单价
                </div>
                <div class="text-xl font-bold text-neu-primary">
                  ¥{{ form.price }}
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <button @click="save" class="neu-btn-primary mt-4 z-50 relative w-full">
              保存价格
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
