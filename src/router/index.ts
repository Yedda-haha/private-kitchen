import { createRouter, createWebHashHistory } from 'vue-router';
import MenuPage from '../pages/MenuPage.vue';
import PricePage from '../pages/PricePage.vue';
import ShoppingPage from '../pages/ShoppingPage.vue';
import RecipeDetail from '../pages/RecipeDetail.vue';
import RecipeEdit from '../pages/RecipeEdit.vue';
import DesignPreview from '../pages/DesignPreview.vue';
import StorybookPreview from '../pages/StorybookPreview.vue';
import ChineseStylePreview from '../pages/ChineseStylePreview.vue';
import GlassmorphismPreview from '../pages/GlassmorphismPreview.vue';
import NeumorphismPreview from '../pages/NeumorphismPreview.vue';
import HeaderPreview from '../pages/HeaderPreview.vue';

const routes = [
  { path: '/', component: MenuPage, meta: { title: '私房菜谱' } },
  { path: '/price', component: PricePage, meta: { title: '今日菜价' } },
  { path: '/shopping', component: ShoppingPage, meta: { title: '采购清单' } },
  { path: '/menu/create', component: RecipeEdit, meta: { title: '新建菜谱', hideTabs: true } },
  { path: '/menu/:id', component: RecipeDetail, meta: { title: '菜谱详情', hideTabs: true } },
  { path: '/menu/:id/edit', component: RecipeEdit, meta: { title: '编辑菜谱', hideTabs: true } },
  { path: '/design-preview', component: DesignPreview, meta: { title: '设计预览', hideTabs: true } },
  { path: '/storybook-preview', component: StorybookPreview, meta: { title: '魔法书预览', hideTabs: true } },
  { path: '/chinese-preview', component: ChineseStylePreview, meta: { title: '国风预览', hideTabs: true } },
  { path: '/glass-preview', component: GlassmorphismPreview, meta: { title: '毛玻璃预览', hideTabs: true } },
  { path: '/neu-preview', component: NeumorphismPreview, meta: { title: '新拟态预览', hideTabs: true } },
  { path: '/header-preview', component: HeaderPreview, meta: { title: '顶部图预览', hideTabs: true } },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
