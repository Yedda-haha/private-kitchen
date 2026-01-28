<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ArrowLeft, Edit2, Share2, Clock, ChefHat, Info, Image as ImageIcon, X, Download, Trash2, Utensils, Lightbulb } from 'lucide-vue-next';
import DataManager from '../utils/storage';
import type { Recipe } from '../utils/storage';
import { shareUtils } from '../utils/share';
import RecipeShareCard from '../components/RecipeShareCard.vue';
import html2canvas from 'html2canvas';

const router = useRouter();
const route = useRoute();
const recipe = ref<Recipe | null>(null);
const showShareModal = ref(false);
const generatingImage = ref(false);

onMounted(() => {
  const id = route.params.id as string;
  const found = DataManager.getRecipes().find(r => r.id === id);
  if (found) {
    recipe.value = found;
  } else {
    router.replace('/');
  }
});

const totalCost = computed(() => {
  if (!recipe.value) return 0;
  return recipe.value.ingredients.reduce((total, ing) => {
    const priceInfo = DataManager.getPrice(ing.name);
    if (priceInfo && priceInfo.unit === ing.unit) {
      return total + (priceInfo.price * ing.quantity);
    }
    return total;
  }, 0);
});

const hasUnknownPrices = computed(() => {
  if (!recipe.value) return false;
  return recipe.value.ingredients.some(ing => {
    const priceInfo = DataManager.getPrice(ing.name);
    return !priceInfo || priceInfo.unit !== ing.unit;
  });
});

const shareToken = async () => {
  if (!recipe.value) return;
  const code = shareUtils.encodeRecipe(recipe.value);
  
  try {
    await navigator.clipboard.writeText(code);
    alert('菜谱口令已复制！发送给朋友即可分享。\n\n口令：' + code.substring(0, 20) + '...');
  } catch (err) {
    alert('复制失败，请手动复制：\n' + code);
  }
};

const openShareModal = () => {
  showShareModal.value = true;
};

const closeShareModal = () => {
  showShareModal.value = false;
};

const downloadCard = async () => {
  const element = document.getElementById('share-card');
  if (!element) return;
  
  generatingImage.value = true;
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      backgroundColor: null,
    });
    
    const link = document.createElement('a');
    link.download = `${recipe.value?.name || 'recipe'}-share.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('Failed to generate image:', err);
    alert('图片生成失败，请重试');
  } finally {
    generatingImage.value = false;
  }
};

const goBack = () => {
  router.back();
};

const edit = () => {
  if (recipe.value) {
    router.push(`/menu/${recipe.value.id}/edit`);
  }
};

const remove = () => {
  if (!recipe.value) return;
  if (confirm(`确定要删除"${recipe.value.name}"吗？此操作无法撤销。`)) {
    DataManager.deleteRecipe(recipe.value.id);
    router.replace('/');
  }
};
</script>

<template>
  <div v-if="recipe" class="bg-neu-base min-h-screen pb-24 text-neu-text">
    <!-- Header Image Placeholder -->
    <div v-if="recipe.image" class="h-64 bg-neu-secondary/20 relative overflow-hidden rounded-b-[2rem] neu-flat mx-2 mt-2">
      <!-- Background Image if available -->
      <img :src="recipe.image" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-neu-text/90 via-transparent to-transparent"></div>
    </div>
    
    <!-- No Image Placeholder (A+B Style) -->
    <div v-else class="h-64 relative overflow-hidden rounded-b-[2rem] neu-pressed border border-neu-secondary/20 flex flex-col items-center justify-center mx-2 mt-2">
      <!-- Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-neu-secondary/20 via-transparent to-neu-secondary/5 pointer-events-none"></div>
      
      <!-- Inner Shadow Overlay -->
      <div class="absolute inset-0 shadow-[inset_0_4px_20px_rgba(0,0,0,0.05)] pointer-events-none"></div>

      <!-- Decorative Blur -->
      <div class="absolute top-[-20%] right-[-20%] w-[200px] h-[200px] bg-neu-primary/5 rounded-full blur-3xl"></div>
      
      <!-- Icon Container -->
      <div class="w-24 h-24 rounded-full neu-flat flex items-center justify-center text-neu-text-secondary/60 mb-4 relative z-10">
        <Utensils :size="40" stroke-width="1.5" />
      </div>
    </div>

    <!-- Header Overlay Content (Shared) -->
    <div class="absolute top-0 left-0 right-0 h-64 pointer-events-none mx-2 mt-2 rounded-b-[2rem] overflow-hidden">
       <button @click="goBack" class="absolute top-4 left-4 neu-btn-icon bg-white/20 backdrop-blur text-white hover:text-white z-20 border border-white/20 pointer-events-auto" :class="!recipe.image ? '!text-neu-text-secondary !bg-neu-base/60' : ''">
        <ArrowLeft :size="24" />
      </button>
      
      <div class="absolute bottom-6 left-6 right-6 z-20" :class="!recipe.image ? 'text-neu-text opacity-40' : 'text-white'">
        <h1 class="text-3xl font-bold mb-2 drop-shadow-md tracking-wide">{{ recipe.name }}</h1>
        <div class="flex items-center space-x-4 text-sm font-medium opacity-90" v-if="recipe.image">
          <span class="flex items-center bg-black/20 backdrop-blur px-3 py-1 rounded-lg border border-white/10">
            <Clock :size="14" class="mr-1.5" /> {{ recipe.prepTime + recipe.cookTime }} 分钟
          </span>
          <span class="flex items-center bg-black/20 backdrop-blur px-3 py-1 rounded-lg border border-white/10">
            <Info :size="14" class="mr-1.5" /> {{ recipe.ingredients.length }} 种材料
          </span>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-8">
      <!-- Actions -->
      <div class="flex space-x-4">
        <button @click="edit" class="flex-1 py-3 rounded-xl font-bold transition-all duration-200 text-neu-text-secondary neu-flat active:neu-pressed flex items-center justify-center hover:text-neu-text">
          <Edit2 :size="18" class="mr-2" /> 编辑
        </button>
        <button @click="shareToken" class="flex-1 py-3 rounded-xl font-bold transition-all duration-200 text-neu-text-secondary neu-flat active:neu-pressed flex items-center justify-center hover:text-neu-primary">
          <Share2 :size="18" class="mr-2" /> 复制口令
        </button>
        <button @click="openShareModal" class="flex-1 py-3 rounded-xl font-bold transition-all duration-200 text-neu-text-secondary neu-flat active:neu-pressed flex items-center justify-center hover:text-neu-primary">
          <ImageIcon :size="18" class="mr-2" /> 生成卡片
        </button>
      </div>

      <!-- Cost Estimate -->
      <div class="neu-pressed p-5 rounded-2xl border border-neu-secondary/10">
        <div class="flex justify-between items-baseline mb-1">
          <span class="text-sm font-bold text-neu-text-secondary">预估成本</span>
          <span class="text-2xl font-bold text-neu-primary">¥{{ totalCost.toFixed(1) }}</span>
        </div>
        <p v-if="hasUnknownPrices" class="text-xs text-neu-text-secondary/70 flex items-center mt-1">
          <Info :size="12" class="mr-1" /> 部分食材价格未知，估算可能不准
        </p>
      </div>

      <!-- Ingredients -->
      <section class="neu-flat p-6 rounded-3xl">
        <h2 class="text-lg font-bold text-neu-text mb-6 flex items-center">
          <span class="w-1.5 h-6 bg-neu-primary rounded-full mr-3 shadow-[0_0_8px_rgba(204,78,61,0.4)]"></span>
          准备材料
        </h2>
        <ul class="space-y-4">
          <li v-for="(ing, idx) in recipe.ingredients" :key="idx" class="flex justify-between items-center py-2 border-b border-neu-secondary/20 last:border-0">
            <span class="text-neu-text font-bold">{{ ing.name }}</span>
            <span class="text-neu-text-secondary font-medium bg-neu-pressed px-3 py-1 rounded-lg text-xs">{{ ing.quantity }} {{ ing.unit }}</span>
          </li>
        </ul>
      </section>

      <!-- Steps -->
      <section>
        <h2 class="text-lg font-bold text-neu-text mb-6 flex items-center px-2">
          <span class="w-1.5 h-6 bg-neu-primary rounded-full mr-3 shadow-[0_0_8px_rgba(204,78,61,0.4)]"></span>
          烹饪步骤
        </h2>
        <div class="neu-flat p-6 rounded-3xl text-neu-text leading-relaxed whitespace-pre-wrap font-medium text-sm">
          {{ recipe.steps }}
        </div>
      </section>

      <!-- Notes -->
      <section v-if="recipe.notes">
        <h2 class="text-lg font-bold text-neu-text mb-4 px-2 flex items-center gap-2">
          <Lightbulb :size="20" class="text-neu-text-secondary" /> 小贴士
        </h2>
        <div class="neu-pressed p-5 rounded-2xl text-sm text-neu-text-secondary leading-relaxed border border-neu-secondary/10">
          {{ recipe.notes }}
        </div>
      </section>

      <!-- Delete Button -->
      <div class="pt-4 pb-4">
        <button @click="remove" class="w-full py-4 text-neu-text-secondary font-bold text-sm flex items-center justify-center hover:text-red-500 transition-colors neu-flat rounded-xl active:neu-pressed">
          <Trash2 :size="16" class="mr-2" /> 删除此菜谱
        </button>
      </div>
    </div>

    <!-- Share Modal -->
    <div v-if="showShareModal" class="fixed inset-0 z-50 flex items-center justify-center bg-neu-base/90 backdrop-blur-sm p-4">
      <div class="w-full max-w-sm flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-neu-text">分享卡片预览</h3>
          <button @click="closeShareModal" class="neu-btn-icon">
            <X :size="24" />
          </button>
        </div>
        
        <div class="overflow-y-auto rounded-xl shadow-2xl mb-6 scrollbar-hide neu-float p-1 bg-white">
          <RecipeShareCard :recipe="recipe" />
        </div>
        
        <button @click="downloadCard" :disabled="generatingImage" class="neu-btn-primary flex items-center justify-center">
          <span v-if="generatingImage" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-neu-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            生成中...
          </span>
          <span v-else class="flex items-center">
            <Download :size="20" class="mr-2" /> 保存图片
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
