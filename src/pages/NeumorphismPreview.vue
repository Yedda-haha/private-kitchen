<script setup lang="ts">
import { ref } from 'vue';
import { Clock, ChefHat, Search, Plus, Settings, Heart } from 'lucide-vue-next';

const recipes = [
  { id: '1', name: 'Classic Burger', time: 20, ingredients: 5, category: 'Fast Food', image: '' },
  { id: '2', name: 'Caesar Salad', time: 15, ingredients: 6, category: 'Healthy', image: '' },
  { id: '3', name: 'Pasta Carbonara', time: 30, ingredients: 4, category: 'Italian', image: '' },
];
</script>

<template>
  <!-- Global Container: Warm Beige Background -->
  <div class="min-h-screen bg-[#FDFBF7] text-[#4A3728] pb-24 font-sans relative">
    
    <!-- Main Content -->
    <div class="p-6 max-w-md mx-auto">
      
      <!-- Header -->
      <header class="flex justify-between items-center mb-10 mt-4">
        <h1 class="text-2xl font-bold text-[#4A3728] tracking-wide">NeoKitchen</h1>
        <button class="w-12 h-12 rounded-full bg-[#FDFBF7] shadow-[6px_6px_12px_#E6D5C1,-6px_-6px_12px_#ffffff] flex items-center justify-center text-[#4A3728] hover:text-[#CC4E3D] transition-colors active:shadow-[inset_6px_6px_12px_#E6D5C1,inset_-6px_-6px_12px_#ffffff]">
          <Settings :size="20" />
        </button>
      </header>

      <!-- Search Bar (Pressed In) -->
      <div class="mb-10">
        <div class="relative w-full h-14 rounded-2xl bg-[#FDFBF7] shadow-[inset_6px_6px_12px_#E6D5C1,inset_-6px_-6px_12px_#ffffff] flex items-center px-6">
          <Search :size="20" class="text-[#E6D5C1] mr-4" />
          <input 
            type="text" 
            placeholder="Search..." 
            class="w-full bg-transparent outline-none text-[#4A3728] placeholder-[#E6D5C1] font-medium"
          />
        </div>
      </div>

      <!-- Categories (Popped Out Pills) -->
      <div class="flex space-x-6 overflow-x-auto pb-8 mb-2 scrollbar-hide px-2 pt-2">
        <div class="px-6 py-3 rounded-2xl bg-[#FDFBF7] shadow-[6px_6px_12px_#E6D5C1,-6px_-6px_12px_#ffffff] text-[#CC4E3D] font-bold text-sm whitespace-nowrap active:shadow-[inset_6px_6px_12px_#E6D5C1,inset_-6px_-6px_12px_#ffffff] cursor-pointer border border-white/40">
          All
        </div>
        <div class="px-6 py-3 rounded-2xl bg-[#FDFBF7] shadow-[6px_6px_12px_#E6D5C1,-6px_-6px_12px_#ffffff] text-[#4A3728] font-bold text-sm whitespace-nowrap active:shadow-[inset_6px_6px_12px_#E6D5C1,inset_-6px_-6px_12px_#ffffff] cursor-pointer hover:text-[#CC4E3D]">
          Breakfast
        </div>
        <div class="px-6 py-3 rounded-2xl bg-[#FDFBF7] shadow-[6px_6px_12px_#E6D5C1,-6px_-6px_12px_#ffffff] text-[#4A3728] font-bold text-sm whitespace-nowrap active:shadow-[inset_6px_6px_12px_#E6D5C1,inset_-6px_-6px_12px_#ffffff] cursor-pointer hover:text-[#CC4E3D]">
          Lunch
        </div>
      </div>

      <!-- Recipe Cards (Popped Out) -->
      <div class="space-y-8">
        <div v-for="recipe in recipes" :key="recipe.id" class="group cursor-pointer">
          <div class="bg-[#FDFBF7] p-5 rounded-3xl shadow-[9px_9px_16px_#E6D5C1,-9px_-9px_16px_#ffffff] flex gap-5 items-center transition-transform active:scale-[0.98]">
            
            <!-- Image Area (Inset Circle) -->
            <div class="w-20 h-20 rounded-full bg-[#FDFBF7] shadow-[inset_6px_6px_12px_#E6D5C1,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center text-3xl">
               🍔
            </div>

            <!-- Info -->
            <div class="flex-1">
              <h3 class="text-lg font-bold text-[#4A3728] mb-1">{{ recipe.name }}</h3>
              <div class="flex items-center justify-between mt-2">
                 <span class="text-xs font-semibold text-[#E6D5C1] uppercase tracking-wider">{{ recipe.category }}</span>
                 <div class="flex items-center gap-1 text-xs font-bold text-[#4A3728]">
                    <Clock :size="14" class="text-[#CC4E3D]" /> {{ recipe.time }}m
                 </div>
              </div>
            </div>

            <!-- Like Button -->
            <button class="w-10 h-10 rounded-full bg-[#FDFBF7] shadow-[5px_5px_10px_#E6D5C1,-5px_-5px_10px_#ffffff] flex items-center justify-center text-[#E6D5C1] hover:text-[#CC4E3D] active:shadow-[inset_5px_5px_10px_#E6D5C1,inset_-5px_-5px_10px_#ffffff] transition-all">
              <Heart :size="18" />
            </button>
          </div>
        </div>
      </div>

      <!-- Floating Action Button (Neumorphic) -->
      <button class="fixed bottom-10 right-8 w-16 h-16 rounded-full bg-[#FDFBF7] shadow-[8px_8px_16px_#E6D5C1,-8px_-8px_16px_#ffffff] flex items-center justify-center text-[#CC4E3D] z-50 hover:text-[#A63C3C] active:shadow-[inset_6px_6px_12px_#E6D5C1,inset_-6px_-6px_12px_#ffffff] transition-all">
        <Plus :size="28" stroke-width="3" />
      </button>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

.font-sans {
  font-family: 'Montserrat', sans-serif;
}
</style>
