<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ArrowLeft, Plus, Minus, Upload, Image as ImageIcon, X } from 'lucide-vue-next';
import DataManager from '../utils/storage';
import type { Recipe } from '../utils/storage';

const router = useRouter();
const route = useRoute();
const fileInput = ref<HTMLInputElement | null>(null);

const categories = ['汤羹', '饮品', '其他'];

const isEdit = ref(false);
const recipe = ref<Recipe>({
  id: '',
  name: '',
  ingredients: [{ name: '', quantity: 0, unit: '个' }],
  prepTime: 10,
  cookTime: 20,
  steps: '',
  notes: '',
  image: '',
  category: '热菜',
  updatedAt: 0
});

onMounted(() => {
  const id = route.params.id as string;
  if (id) {
    const existing = DataManager.getRecipes().find(r => r.id === id);
    if (existing) {
      const data = JSON.parse(JSON.stringify(existing));
      // Migration for legacy array steps
      if (Array.isArray(data.steps)) {
        data.steps = data.steps.join('\n');
      }
      recipe.value = data;
      isEdit.value = true;
    }
  }
});

const triggerUpload = () => {
  fileInput.value?.click();
};

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    
    // Check file size (limit to 5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      alert('图片太大，请选择小于 5MB 的图片');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Compress image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions (max width 800px)
        const maxWidth = 800;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Get base64 string (quality 0.6)
        const base64 = canvas.toDataURL('image/jpeg', 0.6);
        recipe.value.image = base64;
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  recipe.value.image = '';
};

const addIngredient = () => {
  recipe.value.ingredients.push({ name: '', quantity: 0, unit: '个' });
};

const removeIngredient = (index: number) => {
  recipe.value.ingredients.splice(index, 1);
};

const save = () => {
  if (!recipe.value.name.trim()) {
    alert('请输入菜品名称');
    return;
  }
  // Filter empty ingredients
  recipe.value.ingredients = recipe.value.ingredients.filter(i => i.name.trim());
  
  try {
    DataManager.saveRecipe(recipe.value);
    router.back();
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      alert('存储空间不足！可能是图片太大或存了太多图片。建议删除一些旧图片或压缩后再试。');
    } else {
      alert('保存失败，请重试');
    }
  }
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="bg-neu-base min-h-screen pb-24 text-neu-text">
    <!-- Header -->
    <header class="sticky top-0 bg-neu-base/90 backdrop-blur z-10 px-4 py-4 flex justify-between items-center border-b border-neu-secondary/20">
      <button @click="goBack" class="neu-btn-icon">
        <ArrowLeft :size="24" />
      </button>
      <h1 class="font-bold text-lg tracking-wide">{{ isEdit ? '编辑菜谱' : '新建菜谱' }}</h1>
      <button @click="save" class="neu-btn-icon text-neu-primary hover:text-neu-accent">
        <Upload :size="24" />
      </button>
    </header>

    <div class="p-6 space-y-8">
      <!-- Basic Info -->
      <section class="space-y-6">
        <!-- Image Upload -->
        <div class="w-full">
          <input 
            type="file" 
            ref="fileInput" 
            accept="image/*" 
            class="hidden" 
            @change="handleImageUpload"
          />
          
          <div v-if="recipe.image" class="relative w-full h-48 rounded-2xl overflow-hidden group neu-pressed p-1 border border-neu-secondary/20">
            <img :src="recipe.image" class="w-full h-full object-cover rounded-xl" />
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
              <button @click="removeImage" class="bg-white/20 backdrop-blur p-2 rounded-full text-white hover:bg-red-500/80 transition-colors">
                <X :size="24" />
              </button>
            </div>
          </div>
          
          <button 
            v-else 
            @click="triggerUpload"
            class="w-full h-48 neu-pressed rounded-2xl flex flex-col items-center justify-center text-neu-text-secondary hover:text-neu-primary transition-colors border border-neu-secondary/20 bg-neu-secondary/10"
          >
            <ImageIcon :size="32" class="mb-2 opacity-50" />
            <span class="text-sm font-medium">点击上传成品图</span>
          </button>
        </div>

        <div>
          <label class="block text-xs font-bold text-neu-text-secondary mb-2 uppercase tracking-wider">菜品名称</label>
          <input
            v-model="recipe.name"
            type="text"
            placeholder="例如：番茄炒蛋"
            class="neu-input text-lg font-bold"
          />
        </div>

        <!-- Category Selector -->
        <div>
          <label class="block text-xs font-bold text-neu-text-secondary mb-3 uppercase tracking-wider">分类</label>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="recipe.category = cat"
              class="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300"
              :class="recipe.category === cat ? 'neu-pressed text-neu-primary border border-neu-secondary/20' : 'neu-flat text-neu-text-secondary hover:text-neu-text'"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-bold text-neu-text-secondary mb-2 uppercase tracking-wider">备菜时间 (分钟)</label>
            <input
              v-model.number="recipe.prepTime"
              type="number"
              class="neu-input text-center font-bold"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-neu-text-secondary mb-2 uppercase tracking-wider">烹饪时间 (分钟)</label>
            <input
              v-model.number="recipe.cookTime"
              type="number"
              class="neu-input text-center font-bold"
            />
          </div>
        </div>
      </section>

      <!-- Ingredients -->
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-neu-text flex items-center">
            <span class="w-1.5 h-6 bg-neu-primary rounded-full mr-3 shadow-[0_0_8px_rgba(204,78,61,0.4)]"></span>
            所需材料
          </h2>
          <button @click="addIngredient" class="neu-btn-icon w-8 h-8 text-neu-primary">
            <Plus :size="16" />
          </button>
        </div>
        
        <!-- Column Headers -->
        <div class="grid grid-cols-[1fr_4.5rem_3.5rem_2.5rem] gap-2 px-1 mb-2 text-xs font-bold text-neu-text-secondary uppercase tracking-wider">
          <span>名称</span>
          <span class="text-center">数量</span>
          <span class="text-center">单位</span>
          <span></span>
        </div>

        <div class="space-y-4">
          <div
            v-for="(ing, index) in recipe.ingredients"
            :key="index"
            class="grid grid-cols-[1fr_4.5rem_3.5rem_2.5rem] gap-2 items-center animate-in slide-in-from-left-2 duration-300"
          >
            <input
              v-model="ing.name"
              placeholder="如: 鸡蛋"
              class="neu-input text-sm w-full min-w-0"
            />
            <input
              v-model.number="ing.quantity"
              type="number"
              step="0.1"
              placeholder="0"
              class="neu-input text-sm text-center px-1 w-full"
            />
            <input
              v-model="ing.unit"
              placeholder="个"
              class="neu-input text-sm text-center px-1 w-full"
            />
            <div class="flex justify-center">
              <button
                v-if="recipe.ingredients.length > 1"
                @click="removeIngredient(index)"
                class="neu-btn-icon w-10 h-10 text-neu-text-secondary hover:text-red-500"
              >
                <Minus :size="16" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Steps -->
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-neu-text flex items-center">
            <span class="w-1.5 h-6 bg-neu-primary rounded-full mr-3 shadow-[0_0_8px_rgba(204,78,61,0.4)]"></span>
            烹饪步骤
          </h2>
        </div>
        <textarea
          v-model="recipe.steps"
          placeholder="描述烹饪步骤..."
          rows="8"
          class="neu-input resize-none leading-relaxed"
        ></textarea>
      </section>

      <!-- Notes -->
      <section>
        <h2 class="text-lg font-bold text-neu-text mb-4">备注</h2>
        <textarea
          v-model="recipe.notes"
          placeholder="有什么需要特别注意的吗？"
          rows="3"
          class="neu-input resize-none"
        ></textarea>
      </section>

      <!-- Bottom Save Button -->
      <div class="pt-4">
        <button @click="save" class="neu-btn-primary flex items-center justify-center gap-2">
          <Upload :size="20" /> 保存菜谱
        </button>
      </div>
    </div>
  </div>
</template>
