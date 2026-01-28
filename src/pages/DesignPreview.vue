<script setup lang="ts">
import { ref } from 'vue';
import { Clock, ChefHat, Search, Plus, Settings } from 'lucide-vue-next';

// Mock Data for Preview
const recipes = [
  { id: '1', name: '腊味春笋煲', time: 45, ingredients: 6, category: '热菜', image: '' },
  { id: '2', name: '桂花糖藕', time: 120, ingredients: 3, category: '凉菜', image: '' },
  { id: '3', name: '老火靓汤', time: 180, ingredients: 8, category: '汤羹', image: '' },
];
</script>

<template>
  <!-- Global Container with Paper Texture Background -->
  <div class="min-h-screen bg-[#FDFBF7] text-[#4A3728] font-serif pb-24 relative overflow-hidden selection:bg-[#E6D5C1] selection:text-[#2C1810]">
    
    <!-- CSS Noise Texture Overlay -->
    <div class="fixed inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply" 
         style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');">
    </div>

    <!-- Main Content -->
    <div class="relative z-10 p-6 max-w-md mx-auto">
      
      <!-- Header -->
      <header class="flex justify-between items-end mb-8 border-b-2 border-[#4A3728] border-opacity-10 pb-4 border-dashed">
        <div>
          <h1 class="text-3xl font-bold tracking-wider text-[#2C1810]" style="font-family: 'Georgia', serif;">私房菜谱</h1>
          <p class="text-xs text-[#8B5E3C] mt-1 tracking-widest uppercase">My Private Kitchen</p>
        </div>
        <div class="w-10 h-10 border-2 border-[#4A3728] rounded-full flex items-center justify-center hover:bg-[#E6D5C1] transition-colors cursor-pointer">
          <Settings :size="20" />
        </div>
      </header>

      <!-- Search Bar (Hand-drawn style) -->
      <div class="mb-8 relative">
        <div class="absolute inset-0 bg-[#E6D5C1] rounded-lg transform translate-x-1 translate-y-1"></div>
        <div class="relative bg-white border-2 border-[#4A3728] rounded-lg flex items-center px-4 py-3">
          <Search :size="20" class="text-[#8B5E3C] mr-3" />
          <input 
            type="text" 
            placeholder="今天想吃点什么？" 
            class="w-full bg-transparent outline-none placeholder-[#C5B4A5] text-[#4A3728]"
          />
        </div>
      </div>

      <!-- Categories (Tags) -->
      <div class="flex space-x-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        <span class="px-4 py-1.5 border-2 border-[#4A3728] bg-[#4A3728] text-[#FDFBF7] rounded-full text-sm font-bold whitespace-nowrap shadow-md">全部</span>
        <span class="px-4 py-1.5 border-2 border-[#4A3728] text-[#4A3728] rounded-full text-sm font-bold whitespace-nowrap bg-white hover:bg-[#E6D5C1] cursor-pointer">热菜</span>
        <span class="px-4 py-1.5 border-2 border-[#4A3728] text-[#4A3728] rounded-full text-sm font-bold whitespace-nowrap bg-white hover:bg-[#E6D5C1] cursor-pointer">凉菜</span>
        <span class="px-4 py-1.5 border-2 border-[#4A3728] text-[#4A3728] rounded-full text-sm font-bold whitespace-nowrap bg-white hover:bg-[#E6D5C1] cursor-pointer">烘焙</span>
      </div>

      <!-- Recipe Cards -->
      <div class="grid gap-6">
        <div v-for="(recipe, i) in recipes" :key="recipe.id" 
             class="group relative cursor-pointer">
          
          <!-- Card Shadow/Offset -->
          <div class="absolute inset-0 bg-[#4A3728] rounded-xl transform translate-x-1.5 translate-y-1.5 opacity-20 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform"></div>
          
          <!-- Card Content -->
          <div class="relative bg-white border-2 border-[#4A3728] rounded-xl p-4 flex gap-4 transition-transform group-hover:-translate-y-0.5">
            <!-- Image Placeholder (Sketch style) -->
            <div class="w-24 h-24 bg-[#F5F0EB] border border-[#4A3728] border-dashed rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
               <!-- Decorative Tape -->
               <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-[#E6D5C1] opacity-50"></div>
               <ChefHat :size="32" class="text-[#C5B4A5]" />
            </div>

            <!-- Info -->
            <div class="flex-1 flex flex-col justify-center">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold text-[#2C1810]">{{ recipe.name }}</h3>
                <span class="text-[10px] px-2 py-0.5 border border-[#4A3728] rounded-md text-[#8B5E3C]">{{ recipe.category }}</span>
              </div>
              
              <div class="flex items-center gap-4 text-xs font-medium text-[#8B5E3C]">
                <div class="flex items-center">
                  <Clock :size="14" class="mr-1" />
                  <span>{{ recipe.time }} min</span>
                </div>
                <div class="flex items-center">
                  <span class="w-1 h-1 bg-[#8B5E3C] rounded-full mx-2"></span>
                  <span>{{ recipe.ingredients }} 种食材</span>
                </div>
              </div>

              <!-- Decorative Line -->
              <div class="w-full h-px bg-[#4A3728] opacity-10 mt-3 border-b border-dashed"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Action Button (Stamp style) -->
      <button class="fixed bottom-8 right-8 w-16 h-16 bg-[#CC4E3D] border-2 border-[#4A3728] rounded-full shadow-[4px_4px_0px_0px_rgba(74,55,40,1)] flex items-center justify-center text-[#FDFBF7] hover:transform hover:scale-105 transition-all z-50">
        <Plus :size="32" stroke-width="3" />
      </button>

      <!-- Bottom Nav (Mockup) -->
      <nav class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur border-2 border-[#4A3728] rounded-full px-6 py-3 flex space-x-8 shadow-lg z-40">
        <div class="w-2 h-2 bg-[#4A3728] rounded-full opacity-20"></div>
        <div class="w-2 h-2 bg-[#4A3728] rounded-full"></div>
        <div class="w-2 h-2 bg-[#4A3728] rounded-full opacity-20"></div>
      </nav>

    </div>
  </div>
</template>

<style scoped>
/* Optional: Import a handwritten font if available, falling back to serif */
@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Noto+Serif+SC:wght@400;700&display=swap');

.font-serif {
  font-family: 'Noto Serif SC', 'Georgia', serif;
}

/* Custom Scrollbar Hide */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
