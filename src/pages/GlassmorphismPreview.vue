<script setup lang="ts">
import { ref } from 'vue';
import { Clock, ChefHat, Search, Plus, Settings, ChevronRight } from 'lucide-vue-next';

const recipes = [
  { id: '1', name: 'Avocado Toast', time: 10, ingredients: 4, category: 'Breakfast', image: '' },
  { id: '2', name: 'Salmon Poke Bowl', time: 25, ingredients: 8, category: 'Lunch', image: '' },
  { id: '3', name: 'Berry Smoothie', time: 5, ingredients: 5, category: 'Drink', image: '' },
];
</script>

<template>
  <!-- Global Container: Gradient Background -->
  <div class="min-h-screen bg-gradient-to-br from-[#E0F7FA] via-[#F3E5F5] to-[#E1F5FE] text-gray-800 pb-24 relative overflow-hidden font-sans">
    
    <!-- Floating Orbs (Background Decoration) -->
    <div class="fixed top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#B39DDB] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div class="fixed top-[20%] right-[-100px] w-[250px] h-[250px] bg-[#80DEEA] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div class="fixed bottom-[-50px] left-[20%] w-[350px] h-[350px] bg-[#F48FB1] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

    <!-- Main Content -->
    <div class="relative z-10 p-6 max-w-md mx-auto">
      
      <!-- Header -->
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-800/80 backdrop-blur-sm">My Kitchen</h1>
          <p class="text-sm text-gray-500 font-medium ml-1">What's cooking today?</p>
        </div>
        <button class="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md border border-white/40 shadow-lg flex items-center justify-center text-gray-600 hover:bg-white/50 transition-all">
          <Settings :size="20" />
        </button>
      </header>

      <!-- Search Bar (Glass) -->
      <div class="mb-8">
        <div class="relative bg-white/30 backdrop-blur-md border border-white/50 rounded-2xl flex items-center px-4 py-3 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
          <Search :size="20" class="text-gray-500 mr-3" />
          <input 
            type="text" 
            placeholder="Search recipes..." 
            class="w-full bg-transparent outline-none placeholder-gray-400 text-gray-700 font-medium"
          />
        </div>
      </div>

      <!-- Categories (Glass Pills) -->
      <div class="flex space-x-4 overflow-x-auto pb-6 mb-2 scrollbar-hide px-1">
        <div class="px-5 py-2 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 shadow-lg text-sm font-bold text-gray-800 whitespace-nowrap cursor-pointer">
          All
        </div>
        <div class="px-5 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-sm font-medium text-gray-600 whitespace-nowrap cursor-pointer hover:bg-white/20 transition-colors">
          Breakfast
        </div>
        <div class="px-5 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-sm font-medium text-gray-600 whitespace-nowrap cursor-pointer hover:bg-white/20 transition-colors">
          Lunch
        </div>
        <div class="px-5 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-sm font-medium text-gray-600 whitespace-nowrap cursor-pointer hover:bg-white/20 transition-colors">
          Dinner
        </div>
      </div>

      <!-- Recipe Cards (Glass) -->
      <div class="space-y-5">
        <div v-for="(recipe, i) in recipes" :key="recipe.id" class="group cursor-pointer">
          <div class="relative bg-white/25 backdrop-blur-md border border-white/40 p-4 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] flex gap-4 items-center transition-transform hover:scale-[1.02] hover:bg-white/35">
            
            <!-- Icon/Image Area -->
            <div class="w-16 h-16 bg-gradient-to-br from-white/60 to-white/10 rounded-2xl flex items-center justify-center shadow-inner border border-white/50">
               <span class="text-2xl">🥑</span>
            </div>

            <!-- Info -->
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-800">{{ recipe.name }}</h3>
              <div class="flex items-center gap-3 mt-1 text-xs font-semibold text-gray-500">
                <span class="px-2 py-0.5 bg-white/30 rounded-lg border border-white/20">{{ recipe.category }}</span>
                <span class="flex items-center gap-1">
                  <Clock :size="12" /> {{ recipe.time }} min
                </span>
              </div>
            </div>

            <!-- Arrow -->
            <div class="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight :size="16" />
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Action Button (Glass + Gradient) -->
      <button class="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-[#80DEEA] to-[#B39DDB] shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] flex items-center justify-center text-white border border-white/30 backdrop-blur-sm z-50 hover:brightness-110 transition-all active:scale-95">
        <Plus :size="28" stroke-width="3" />
      </button>

      <!-- Bottom Nav (Glass Bar) -->
      <nav class="fixed bottom-6 left-6 right-6 h-16 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg flex justify-around items-center px-2 z-40">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-white/40 text-gray-800 shadow-sm">
           <ChefHat :size="20" />
        </div>
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-white/20 transition-colors">
           <Search :size="20" />
        </div>
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-white/20 transition-colors">
           <Settings :size="20" />
        </div>
      </nav>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

.font-sans {
  font-family: 'Nunito', sans-serif;
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
