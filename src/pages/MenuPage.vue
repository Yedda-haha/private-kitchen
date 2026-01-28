<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, Clock, ChefHat, Download, Settings, Search, Upload, FileJson, X, UtensilsCrossed } from 'lucide-vue-next';
import DataManager from '../utils/storage';
import type { Recipe } from '../utils/storage';
import { shareUtils } from '../utils/share';

const router = useRouter();
const recipes = ref<Recipe[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('全部');
const categories = ['全部', '汤羹', '饮品'];

// Settings Modal
const showSettings = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const loadRecipes = () => {
  recipes.value = DataManager.getRecipes().sort((a, b) => b.updatedAt - a.updatedAt);
};

onMounted(() => {
  loadRecipes();
});

const filteredRecipes = computed(() => {
  return recipes.value.filter(recipe => {
    // Category Filter
    if (selectedCategory.value !== '全部' && recipe.category !== selectedCategory.value) {
      return false;
    }
    // Search Filter
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      return (
        recipe.name.toLowerCase().includes(q) || 
        recipe.ingredients.some(i => i.name.toLowerCase().includes(q))
      );
    }
    return true;
  });
});

const exportData = () => {
  const data = {
    recipes: DataManager.getRecipes(),
    prices: DataManager.getPrices(),
    shopping: DataManager.getShoppingList(),
    version: '2.0',
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `private-kitchen-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
};

const triggerImport = () => {
  fileInput.value?.click();
};

const importData = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;
  
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target?.result as string);
      if (confirm('恢复数据将覆盖当前所有数据（菜谱、价格、清单），确定要继续吗？')) {
        if (json.recipes) localStorage.setItem('pk_recipes', JSON.stringify(json.recipes));
        if (json.prices) localStorage.setItem('pk_prices', JSON.stringify(json.prices));
        if (json.shopping) localStorage.setItem('pk_shopping', JSON.stringify(json.shopping));
        
        alert('数据恢复成功！页面将刷新。');
        window.location.reload();
      }
    } catch (err) {
      alert('文件格式错误，请选择正确的备份文件');
    }
  };
  reader.readAsText(file);
};

const importRecipe = async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (!text) {
      const input = prompt('请粘贴菜谱口令：');
      if (input) handleImport(input);
      return;
    }
    handleImport(text);
  } catch (e) {
    const input = prompt('请粘贴菜谱口令：');
    if (input) handleImport(input);
  }
};

const handleImport = (code: string) => {
  const recipe = shareUtils.decodeRecipe(code);
  if (recipe && recipe.name) {
    if (confirm(`检测到菜谱"${recipe.name}"，是否导入？`)) {
      DataManager.saveRecipe(recipe as Recipe);
      loadRecipes();
      alert('导入成功！');
    }
  } else {
    alert('无效的菜谱口令');
  }
};

const navigateToCreate = () => {
  router.push('/menu/create');
};

const navigateToDetail = (id: string) => {
  router.push(`/menu/${id}`);
};
</script>

<template>
  <div class="p-4 space-y-6 pb-24 min-h-screen relative">
    <header class="flex justify-between items-center mt-2">
      <div>
        <h1 class="text-2xl font-bold text-neu-text tracking-wide flex items-center gap-2">
          我的菜单 <UtensilsCrossed :size="24" class="text-neu-primary" />
        </h1>
        <p class="text-xs text-neu-text-secondary mt-1 font-medium">今天吃点好的</p>
      </div>
      <div class="flex items-center space-x-2">
        <button @click="showSettings = true" class="neu-btn-icon">
          <Settings :size="20" />
        </button>
      </div>
    </header>

    <!-- Search & Filter -->
    <div class="space-y-6 sticky top-0 bg-neu-base z-10 py-2 -mx-4 px-4">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="今天想吃点什么？"
          class="neu-input pr-12"
        />
        <Search class="absolute right-4 top-3.5 text-neu-text-secondary" :size="20" />
      </div>
      
      <div class="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide px-1">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          class="px-6 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300"
          :class="selectedCategory === cat ? 'neu-pressed text-neu-primary border border-neu-secondary/20' : 'neu-flat text-neu-text-secondary hover:text-neu-text'"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredRecipes.length === 0" class="flex flex-col items-center justify-center py-20 text-neu-text-secondary opacity-60">
      <ChefHat :size="48" class="mb-4" />
      <p>没有找到相关菜谱</p>
      <p v-if="recipes.length === 0" class="text-xs mt-1">点击右下角添加第一道菜</p>
    </div>

    <!-- Recipe Grid -->
    <div class="grid grid-cols-1 gap-6">
      <div
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        @click="navigateToDetail(recipe.id)"
        class="neu-flat p-5 rounded-3xl flex gap-5 items-center transition-transform active:scale-[0.98] group cursor-pointer"
      >
        <!-- Thumbnail -->
        <div class="w-20 h-20 rounded-full neu-pressed flex-shrink-0 overflow-hidden flex items-center justify-center border-2 border-neu-bg bg-neu-secondary/20">
          <img v-if="recipe.image" :src="recipe.image" class="w-full h-full object-cover" />
          <ChefHat v-else :size="28" class="text-neu-text-secondary/50" />
        </div>

        <div class="flex-1 flex flex-col justify-center">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-bold text-neu-text mb-1">{{ recipe.name }}</h3>
            <span v-if="recipe.category" class="text-[10px] font-bold px-2 py-1 neu-pressed rounded-lg text-neu-text-secondary tracking-wider uppercase">{{ recipe.category }}</span>
          </div>
          
          <div class="flex items-center text-xs font-bold text-neu-text-secondary space-x-4 mt-2">
            <span class="flex items-center">
              <Clock :size="14" class="mr-1 text-neu-primary" />
              {{ recipe.prepTime + recipe.cookTime }} 分钟
            </span>
            <span class="flex items-center">
              <ChefHat :size="14" class="mr-1 text-neu-primary" />
              {{ recipe.ingredients.length }} 种食材
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Button -->
    <button
      @click="navigateToCreate"
      class="fixed bottom-28 right-6 w-16 h-16 rounded-full neu-float flex items-center justify-center text-neu-primary z-50 hover:text-neu-accent active:neu-pressed transition-all duration-300"
    >
      <Plus :size="32" stroke-width="3" />
    </button>

    <!-- Settings Modal -->
    <div v-if="showSettings" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div class="absolute inset-0 bg-neu-base/80 backdrop-blur-sm" @click="showSettings = false"></div>
      
      <div class="bg-neu-base w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-8 neu-float relative z-10 animate-in slide-in-from-bottom duration-300">
        <div class="flex justify-between items-center mb-8">
          <h3 class="font-bold text-xl text-neu-text">设置</h3>
          <button @click="showSettings = false" class="neu-btn-icon w-12 h-12">
            <X :size="24" />
          </button>
        </div>

        <div class="space-y-6">
          <button @click="importRecipe" class="neu-btn-primary flex items-center justify-center">
            <Download :size="20" class="mr-3" /> 导入菜谱口令
          </button>
          
          <div class="h-0.5 neu-pressed rounded-full mx-4"></div>

          <button @click="exportData" class="neu-btn-primary flex items-center justify-center">
            <Upload :size="20" class="mr-3" /> 备份数据 (导出)
          </button>

          <button @click="triggerImport" class="neu-btn-primary flex items-center justify-center">
            <FileJson :size="20" class="mr-3" /> 恢复数据 (导入)
          </button>
          <input type="file" ref="fileInput" accept=".json" class="hidden" @change="importData" />
        </div>
        
        <div class="mt-8 text-center text-xs font-bold text-neu-text-secondary/50">
          PRIVATE KITCHEN v2.0
        </div>
      </div>
    </div>
  </div>
</template>
