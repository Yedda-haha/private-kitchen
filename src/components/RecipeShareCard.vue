<script setup lang="ts">
import { computed } from 'vue';
import type { Recipe } from '../utils/storage';
import { Clock, Users, Flame, ChefHat, Utensils, Lightbulb } from 'lucide-vue-next';

const props = defineProps<{
  recipe: Recipe;
}>();

// Helper to split steps into array if it's a string
const stepsList = computed(() => {
  if (!props.recipe.steps) return [];
  // Ensure steps is a string before splitting
  const stepsStr = String(props.recipe.steps);
  // Split by newline and filter empty
  return stepsStr.split('\n').filter(s => s.trim());
});

const currentDate = new Date().toLocaleDateString();
</script>

<template>
  <div id="share-card" class="bg-neu-base p-6 w-[375px] mx-auto text-neu-text font-sans">
    
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold tracking-wide text-neu-text">私房菜谱</h1>
        <p class="text-xs text-neu-text-secondary mt-1 font-medium tracking-widest uppercase">Private Kitchen</p>
      </div>
      <div class="w-12 h-12 rounded-full neu-flat flex items-center justify-center text-neu-primary">
        <ChefHat :size="24" />
      </div>
    </div>

    <!-- Recipe Title Card -->
    <div class="neu-pressed rounded-2xl p-6 mb-8 text-center border border-neu-secondary/10">
      <h2 class="text-xl font-bold mb-4">{{ recipe.name }}</h2>
      
      <!-- Stats Row -->
      <div class="flex justify-center items-center gap-6 text-xs font-bold text-neu-text-secondary">
        <div class="flex items-center bg-neu-flat px-3 py-1.5 rounded-lg">
          <Clock :size="14" class="mr-1.5 text-neu-primary" />
          {{ recipe.prepTime }}m 备菜
        </div>
        <div class="w-px h-4 bg-neu-secondary/40"></div>
        <div class="flex items-center bg-neu-flat px-3 py-1.5 rounded-lg">
          <Flame :size="14" class="mr-1.5 text-neu-primary" />
          {{ recipe.cookTime }}m 烹饪
        </div>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="flex gap-6 mb-8">
      <!-- Left Column: Image & Ingredients -->
      <div class="w-1/3 flex flex-col gap-4">
        <!-- Image Placeholder -->
        <div class="aspect-square rounded-2xl neu-flat flex items-center justify-center overflow-hidden p-1 border border-neu-secondary/20 bg-neu-secondary/20">
          <img v-if="recipe.image" :src="recipe.image" class="w-full h-full object-cover rounded-xl" />
          <Utensils v-else :size="40" class="text-neu-text-secondary/50" />
        </div>

        <!-- Ingredients List -->
        <div class="neu-flat p-4 rounded-2xl flex-1">
          <h3 class="font-bold text-center text-xs mb-4 text-neu-text-secondary border-b border-neu-secondary/20 pb-2">食材清单</h3>
          <ul class="space-y-3 text-xs">
            <li v-for="(ing, idx) in recipe.ingredients" :key="idx" class="flex justify-between items-center">
              <span class="text-neu-text font-bold">{{ ing.name }}</span>
              <span class="text-neu-primary font-bold bg-neu-pressed px-2 py-0.5 rounded">{{ ing.quantity }}{{ ing.unit }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Right Column: Steps -->
      <div class="w-2/3">
        <div class="flex items-center mb-4">
          <span class="w-1.5 h-4 bg-neu-primary rounded-full mr-2 shadow-[0_0_8px_rgba(204,78,61,0.4)]"></span>
          <span class="text-sm font-bold text-neu-text">烹饪步骤</span>
        </div>

        <div class="space-y-4">
          <div v-for="(step, idx) in stepsList" :key="idx" class="neu-flat p-3 rounded-xl relative">
            <p class="text-xs text-neu-text leading-relaxed text-justify ml-2 font-medium">{{ step }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom: Notes -->
    <div v-if="recipe.notes" class="neu-pressed p-5 rounded-2xl mb-8 border border-neu-secondary/10">
      <div class="flex items-center mb-2 gap-2">
        <Lightbulb :size="16" class="text-neu-text-secondary" />
        <span class="text-xs font-bold text-neu-text-secondary">小贴士</span>
      </div>
      <p class="text-xs text-neu-text leading-relaxed">{{ recipe.notes }}</p>
    </div>

    <!-- Footer -->
    <div class="flex justify-between items-center pt-6 border-t border-neu-secondary/20 text-[10px] text-neu-text-secondary font-bold tracking-wider">
      <span>PRIVATE KITCHEN</span>
      <span>{{ currentDate }}</span>
    </div>
  </div>
</template>

<style scoped>
/* No specific fonts needed, inheriting from global Montserrat */
</style>
