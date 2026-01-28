<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { BookOpen, Tag, ShoppingCart } from 'lucide-vue-next';

const route = useRoute();
const showTabs = computed(() => !route.meta.hideTabs);

const tabs = [
  { name: '菜单', path: '/', icon: BookOpen },
  { name: '菜价', path: '/price', icon: Tag },
  { name: '清单', path: '/shopping', icon: ShoppingCart },
];
</script>

<template>
  <div class="min-h-screen bg-neu-base flex justify-center font-sans text-neu-primary">
    <div class="w-full max-w-md bg-neu-base min-h-screen relative flex flex-col">
      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Bottom Tab Bar -->
      <nav v-if="showTabs" class="fixed bottom-6 left-6 right-6 h-20 bg-neu-base neu-flat rounded-2xl flex justify-around items-center px-2 z-40 max-w-[calc(28rem-3rem)] mx-auto">
        <router-link
          v-for="tab in tabs"
          :key="tab.path"
          :to="tab.path"
          class="flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300"
          active-class="neu-pressed text-neu-accent"
          :class="route.path !== tab.path ? 'text-gray-400 hover:text-neu-text' : ''"
        >
          <component :is="tab.icon" :size="24" stroke-width="2.5" />
        </router-link>
      </nav>
    </div>
  </div>
</template>

<style>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
