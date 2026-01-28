<script setup lang="ts">
import { ref } from 'vue';
import { Clock, ChefHat, Search, Plus, Settings, Leaf, Scroll } from 'lucide-vue-next';

const recipes = [
  { id: '1', name: '龙井虾仁', time: 25, ingredients: 4, category: '浙菜', image: '' },
  { id: '2', name: '东坡肉', time: 180, ingredients: 8, category: '苏菜', image: '' },
  { id: '3', name: '开水白菜', time: 240, ingredients: 5, category: '川菜', image: '' },
];
</script>

<template>
  <!-- Global Container: Rice Paper Theme -->
  <div class="min-h-screen bg-[#F7F4ED] text-[#2B2B2B] font-serif pb-24 relative overflow-hidden">
    
    <!-- Background Texture (Subtle Ink Wash/Paper) -->
    <div class="fixed inset-0 opacity-10 pointer-events-none z-0" 
         style="background-image: radial-gradient(#A6A6A6 1px, transparent 1px); background-size: 20px 20px;"></div>
    
    <!-- Decorative Circle (Moon/Ink) -->
    <div class="fixed -top-20 -right-20 w-64 h-64 bg-[#E8E4D9] rounded-full blur-3xl opacity-60 z-0"></div>

    <!-- Main Content -->
    <div class="relative z-10 p-6 max-w-md mx-auto">
      
      <!-- Header -->
      <header class="flex justify-between items-center mb-10 relative">
        <div class="flex flex-col">
          <!-- Vertical Text Decoration -->
          <div class="absolute -left-2 top-0 flex flex-col gap-2 opacity-30 text-xs font-bold writing-vertical-rl">
            <span>食</span><span>色</span><span>性</span><span>也</span>
          </div>
          
          <h1 class="text-3xl font-bold tracking-widest text-[#2B2B2B] ml-4 font-serif relative">
            <span class="relative z-10">私房·食录</span>
            <span class="absolute -bottom-2 left-0 w-1/2 h-2 bg-[#C04851] opacity-20 -rotate-1"></span>
          </h1>
          <p class="text-xs text-[#595959] ml-4 mt-2 tracking-[0.2em]">ORIENTAL KITCHEN</p>
        </div>
        
        <button class="w-10 h-10 border border-[#2B2B2B] rounded-full flex items-center justify-center hover:bg-[#2B2B2B] hover:text-[#F7F4ED] transition-colors">
          <Settings :size="18" />
        </button>
      </header>

      <!-- Search Bar -->
      <div class="mb-10 relative">
        <div class="relative bg-white/80 border-b-2 border-[#2B2B2B] flex items-center px-2 py-3 backdrop-blur-sm">
          <div class="w-8 h-8 flex items-center justify-center border border-[#2B2B2B] rounded mr-3 bg-[#C04851] text-[#F7F4ED]">
            <Search :size="16" />
          </div>
          <input 
            type="text" 
            placeholder="寻味..." 
            class="w-full bg-transparent outline-none placeholder-[#999] text-[#2B2B2B] text-sm tracking-widest"
          />
          <Leaf :size="16" class="text-[#768D75] absolute right-2 opacity-50" />
        </div>
      </div>

      <!-- Categories (Scroll Style) -->
      <div class="flex space-x-6 overflow-x-auto pb-6 mb-2 scrollbar-hide px-2">
        <div class="flex flex-col items-center gap-2 group cursor-pointer">
          <div class="w-12 h-12 rounded-full border border-[#2B2B2B] flex items-center justify-center bg-[#2B2B2B] text-[#F7F4ED] shadow-md group-hover:scale-110 transition-transform">
            <span class="text-xs font-bold">全部</span>
          </div>
        </div>
        <div class="flex flex-col items-center gap-2 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
          <div class="w-12 h-12 rounded-full border border-[#999] flex items-center justify-center bg-white group-hover:border-[#C04851] transition-colors">
            <span class="text-xs font-bold">热菜</span>
          </div>
        </div>
        <div class="flex flex-col items-center gap-2 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
          <div class="w-12 h-12 rounded-full border border-[#999] flex items-center justify-center bg-white group-hover:border-[#C04851] transition-colors">
            <span class="text-xs font-bold">凉菜</span>
          </div>
        </div>
        <div class="flex flex-col items-center gap-2 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
          <div class="w-12 h-12 rounded-full border border-[#999] flex items-center justify-center bg-white group-hover:border-[#C04851] transition-colors">
            <span class="text-xs font-bold">汤羹</span>
          </div>
        </div>
      </div>

      <!-- Recipe Cards -->
      <div class="space-y-6">
        <div v-for="(recipe, i) in recipes" :key="recipe.id" class="group cursor-pointer">
          <div class="relative bg-white p-5 shadow-sm border border-[#E8E4D9] flex gap-5 items-stretch transition-all hover:shadow-md hover:border-[#C04851]/30">
            <!-- Corner Decor -->
            <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#C04851] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#C04851] opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <!-- Image/Icon Area -->
            <div class="w-20 bg-[#F2F2F2] flex items-center justify-center relative overflow-hidden">
               <!-- Ink Circle -->
               <div class="absolute w-16 h-16 bg-[#2B2B2B] rounded-full opacity-5 blur-md"></div>
               <span class="text-2xl font-serif text-[#2B2B2B] z-10 writing-vertical-rl font-bold tracking-widest">{{ recipe.name.substring(0, 2) }}</span>
            </div>

            <!-- Info -->
            <div class="flex-1 py-1 flex flex-col justify-between">
              <div class="flex justify-between items-start">
                <h3 class="text-xl font-bold text-[#2B2B2B] tracking-wide">{{ recipe.name }}</h3>
                <Scroll :size="16" class="text-[#999]" />
              </div>
              
              <div class="w-full h-px bg-[#E8E4D9] my-2 group-hover:bg-[#C04851]/20 transition-colors"></div>

              <div class="flex items-center justify-between text-xs text-[#595959]">
                <div class="flex items-center gap-3">
                   <span class="bg-[#F7F4ED] px-2 py-0.5 rounded text-[#768D75] border border-[#768D75]/30">{{ recipe.category }}</span>
                   <span>{{ recipe.ingredients }} 味食材</span>
                </div>
                <div class="flex items-center">
                  <Clock :size="12" class="mr-1" /> {{ recipe.time }}分
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Action Button: Red Seal (Chop) -->
      <button class="fixed bottom-8 right-8 w-16 h-16 bg-[#C04851] text-[#F7F4ED] rounded-lg shadow-xl flex flex-col items-center justify-center z-50 hover:bg-[#A83840] transition-colors border-2 border-[#F7F4ED] outline outline-2 outline-[#C04851]">
        <span class="text-xs writing-vertical-rl font-bold tracking-widest leading-none">新增</span>
      </button>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap');

.font-serif {
  font-family: 'Noto Serif SC', serif;
}

.writing-vertical-rl {
  writing-mode: vertical-rl;
}
</style>
