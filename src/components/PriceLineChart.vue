<script setup lang="ts">
import { computed } from 'vue';
import type { PriceHistory } from '../utils/storage';

const props = defineProps<{
  data: PriceHistory[];
  days?: number; // default 120
}>();

const history = computed(() => {
  // Sort by date asc
  return [...props.data].sort((a, b) => a.date - b.date);
});

const chartData = computed(() => {
  if (history.value.length === 0) return null;

  const now = Date.now();
  const days = props.days || 120;
  const cutoff = now - days * 24 * 60 * 60 * 1000;

  // Filter last N days
  const filtered = history.value.filter(h => h.date >= cutoff);

  if (filtered.length === 0) {
    // If no data in range, show last known price as a flat line
    const last = history.value[history.value.length - 1];
    return {
      points: [
        { x: 0, y: last.price, date: cutoff },
        { x: 100, y: last.price, date: now }
      ],
      minPrice: last.price * 0.9,
      maxPrice: last.price * 1.1,
      isFlat: true
    };
  }

  // Calculate scales
  const prices = filtered.map(h => h.price);
  const minPrice = Math.min(...prices) * 0.9;
  const maxPrice = Math.max(...prices) * 1.1 || minPrice * 1.2 || 10; // Avoid div by zero
  const priceRange = maxPrice - minPrice;

  const minDate = filtered[0].date;
  const maxDate = filtered[filtered.length - 1].date;
  const timeRange = maxDate - minDate || 1; // Avoid div by zero

  const points = filtered.map(h => ({
    x: ((h.date - minDate) / timeRange) * 100,
    y: 100 - ((h.price - minPrice) / priceRange) * 100,
    price: h.price,
    date: h.date
  }));

  return { points, minPrice, maxPrice, isFlat: false };
});

const pathD = computed(() => {
  if (!chartData.value) return '';
  const pts = chartData.value.points;
  if (pts.length === 0) return '';
  
  if (pts.length === 1) {
    // Single point: draw a flat line across
    return `M 0 ${pts[0].y} L 100 ${pts[0].y}`;
  }

  return `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
});

const formatDate = (ts: number) => new Date(ts).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
</script>

<template>
  <div class="w-full h-40 bg-neu-pressed rounded-xl p-4 relative overflow-hidden border border-neu-secondary/10">
    <div v-if="!chartData" class="flex items-center justify-center h-full text-neu-text-secondary text-xs">
      暂无价格数据
    </div>
    
    <template v-else>
      <!-- Y-Axis Labels (Min/Max) -->
      <div class="absolute left-2 top-2 text-[10px] text-neu-text-secondary font-bold">¥{{ chartData.maxPrice.toFixed(1) }}</div>
      <div class="absolute left-2 bottom-2 text-[10px] text-neu-text-secondary font-bold">¥{{ chartData.minPrice.toFixed(1) }}</div>

      <!-- Chart Area -->
      <svg class="w-full h-full overflow-visible px-8 py-4" viewBox="0 0 100 100" preserveAspectRatio="none">
        <!-- Line -->
        <path
          :d="pathD"
          fill="none"
          stroke="var(--neu-primary)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="drop-shadow-sm"
        />
        
        <!-- Area under line (optional, maybe too complex for simple SVG) -->
        
        <!-- Points -->
        <circle
          v-for="(p, i) in chartData.points"
          :key="i"
          :cx="p.x"
          :cy="p.y"
          r="3"
          class="fill-neu-bg stroke-neu-primary stroke-2"
        />
      </svg>

      <!-- Tooltip-like Info (Last Price) -->
      <div class="absolute right-4 top-2 text-right">
        <div class="text-xs text-neu-text-secondary">最新</div>
        <div class="text-lg font-bold text-neu-primary">¥{{ data[data.length - 1]?.price.toFixed(1) }}</div>
      </div>
    </template>
  </div>
</template>
