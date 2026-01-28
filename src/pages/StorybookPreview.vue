<script setup lang="ts">
import { ref } from 'vue';
import { Clock, ChefHat, Search, Plus, Settings, Book, Bookmark } from 'lucide-vue-next';

const recipes = [
  { id: '1', name: 'Magic Mushroom Soup', time: 45, ingredients: 6, category: 'Potions', image: '' },
  { id: '2', name: 'Dragon Fire Steak', time: 120, ingredients: 3, category: 'Main', image: '' },
  { id: '3', name: 'Fairy Dust Cake', time: 180, ingredients: 8, category: 'Dessert', image: '' },
];
</script>

<template>
  <!-- Global Container: Light Parchment/Fairy Tale Book Theme -->
  <div class="min-h-screen bg-[#FDF6E3] text-[#5D4037] font-serif pb-24 relative overflow-hidden">
    
    <!-- Book Spine Decoration (Left) - Lighter -->
    <div class="fixed left-0 top-0 bottom-0 w-3 bg-[#DECFB1] z-20 shadow-lg border-r border-[#C5B4A5]"></div>

    <!-- Main Content Area (Page) -->
    <div class="relative z-10 p-6 max-w-md mx-auto pl-8">
      
      <!-- Header: Title with Ornate Decoration -->
      <header class="text-center mb-8 relative">
        <div class="absolute left-1/2 -translate-x-1/2 top-1 w-24 h-24 border border-[#D4C5A9] rotate-45 opacity-40 rounded-lg"></div>
        <h1 class="text-3xl font-bold tracking-[0.2em] text-[#2C1810] mb-2 font-serif relative z-10" style="text-shadow: 0 1px 2px rgba(255,255,255,0.8);">THE MENU</h1>
        <div class="flex justify-center items-center gap-2">
          <div class="h-px w-8 bg-[#8B5E3C]"></div>
          <span class="text-xs text-[#8B5E3C] tracking-widest uppercase">Vol. II</span>
          <div class="h-px w-8 bg-[#8B5E3C]"></div>
        </div>
        
        <button class="absolute right-0 top-1 text-[#8B5E3C] hover:text-[#2C1810] transition-colors">
          <Settings :size="18" />
        </button>
      </header>

      <!-- Search Bar: Magic Spell Input Style (Light) -->
      <div class="mb-8 relative group">
        <div class="absolute -inset-0.5 bg-gradient-to-r from-[#D4C5A9] to-[#E6D5C1] rounded-full opacity-50 group-hover:opacity-80 transition duration-500 blur"></div>
        <div class="relative bg-[#FFFBF0] rounded-full flex items-center px-5 py-3 shadow-sm border border-[#DECFB1]">
          <Search :size="18" class="text-[#8B5E3C] mr-3" />
          <input 
            type="text" 
            placeholder="Search for spells..." 
            class="w-full bg-transparent outline-none placeholder-[#C5B4A5] text-[#5D4037] text-sm tracking-wide"
          />
        </div>
      </div>

      <!-- Categories: Bookmark Style (Light) -->
      <div class="flex space-x-2 overflow-x-auto pb-4 mb-4 scrollbar-hide px-1">
        <div class="relative group cursor-pointer">
          <div class="bg-[#8B5E3C] text-[#FFFBF0] px-4 py-1.5 rounded-t-lg font-bold text-xs tracking-wider border-t border-x border-[#5D4037] shadow-sm">ALL</div>
        </div>
        <div class="relative group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
          <div class="bg-[#E6D5C1] text-[#5D4037] px-4 py-1.5 rounded-t-lg font-bold text-xs tracking-wider border-t border-x border-[#C5B4A5]">POTIONS</div>
        </div>
        <div class="relative group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
          <div class="bg-[#E6D5C1] text-[#5D4037] px-4 py-1.5 rounded-t-lg font-bold text-xs tracking-wider border-t border-x border-[#C5B4A5]">MAIN</div>
        </div>
      </div>

      <!-- Recipe List: Illuminated Manuscript Style (Light) -->
      <div class="space-y-6">
        <div v-for="(recipe, i) in recipes" :key="recipe.id" class="relative group cursor-pointer">
          <!-- Card Background -->
          <div class="absolute inset-0 bg-[#FFFBF0] rounded-sm transform transition-transform group-hover:scale-[1.02] duration-300 border border-[#DECFB1] shadow-md"></div>
          
          <!-- Content -->
          <div class="relative p-4 flex gap-4 items-center">
            <!-- Initial Drop Cap / Image -->
            <div class="w-16 h-16 bg-[#F5F0EB] border border-[#D4C5A9] flex items-center justify-center relative overflow-hidden shadow-inner group-hover:border-[#8B5E3C] transition-colors">
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#DECFB1] to-transparent opacity-30"></div>
              <span class="text-3xl font-serif text-[#8B5E3C] font-bold">{{ recipe.name.charAt(0) }}</span>
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-serif font-bold text-[#2C1810] truncate tracking-wide group-hover:text-[#8B5E3C] transition-colors">{{ recipe.name }}</h3>
              <div class="flex items-center gap-4 mt-2 text-[#8B5E3C] text-xs font-medium">
                <span class="flex items-center gap-1">
                  <Clock :size="12" /> {{ recipe.time }}m
                </span>
                <span class="w-1 h-1 bg-[#DECFB1] rounded-full"></span>
                <span class="uppercase tracking-wider">{{ recipe.category }}</span>
              </div>
            </div>

            <!-- Arrow -->
            <div class="text-[#DECFB1] group-hover:text-[#8B5E3C] transition-colors">
              <Book :size="16" />
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Action Button: Wax Seal (Red on Light) -->
      <button class="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-50 group transition-transform hover:scale-105">
        <div class="absolute inset-0 bg-[#A63C3C] rounded-full shadow-inner opacity-90 blur-[0.5px]"></div>
        <div class="absolute inset-0 bg-[#A63C3C] rounded-full border-4 border-[#7A2020] opacity-100"></div>
        <Plus :size="24" class="relative text-[#FFFBF0] opacity-90 group-hover:opacity-100" />
      </button>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:wght@400;600&display=swap');

.font-serif {
  font-family: 'Cormorant Garamond', serif;
}

h1 {
  font-family: 'Cinzel', serif;
}
</style>
