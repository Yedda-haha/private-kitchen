<script setup lang="ts">
import { ArrowLeft, ChefHat, Clock, Info, Utensils } from 'lucide-vue-next';

const goBack = () => {};
</script>

<template>
  <div class="min-h-screen bg-neu-base text-neu-text p-6 space-y-12 pb-24">
    <header class="flex items-center gap-4">
      <h1 class="text-2xl font-bold">A+B 结合方案预览</h1>
    </header>

    <!-- Variant A+B: Deep Inset + Warm Gradient -->
    <section>
      <h2 class="text-lg font-bold mb-4 text-neu-text-secondary">方案 A+B: 暖调凹陷 (Warm Inset)</h2>
      <div class="h-64 relative overflow-hidden rounded-[2rem] neu-pressed border border-neu-secondary/20 flex flex-col items-center justify-center">
        
        <!-- Gradient Background (From B) -->
        <div class="absolute inset-0 bg-gradient-to-br from-neu-secondary/20 via-transparent to-neu-secondary/5 pointer-events-none"></div>
        
        <!-- Inner Shadow Overlay (From A, softened) -->
        <div class="absolute inset-0 shadow-[inset_0_4px_20px_rgba(0,0,0,0.05)] pointer-events-none"></div>

        <!-- Decorative Blur (From B) -->
        <div class="absolute top-[-20%] right-[-20%] w-[200px] h-[200px] bg-neu-primary/5 rounded-full blur-3xl"></div>
        
        <!-- Icon Container (From A style, but larger like B) -->
        <div class="w-24 h-24 rounded-full neu-flat flex items-center justify-center text-neu-text-secondary/60 mb-4 relative z-10">
          <Utensils :size="40" stroke-width="1.5" />
        </div>
        
        <p class="text-neu-text-secondary/60 font-medium tracking-widest text-sm uppercase relative z-10">No Image Uploaded</p>
        
        <!-- Mock Overlay Content -->
        <div class="absolute top-4 left-4 z-20">
           <button class="neu-btn-icon bg-neu-base/60 backdrop-blur border border-white/20">
             <ArrowLeft :size="24" />
           </button>
        </div>
        <div class="absolute bottom-6 left-6 right-6 z-20">
           <h1 class="text-3xl font-bold mb-2 text-neu-text opacity-40">菜品名称</h1>
        </div>
      </div>
    </section>

  </div>
</template>
