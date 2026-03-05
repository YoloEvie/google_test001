
<script setup lang="ts">
import { ref } from 'vue';
import type { OrderData } from '../types';

const MOCK_ORDER: OrderData = {
  orderNumber: "LX-98725410",
  totalAmount: 1380.00,
  discountAmount: 121.00,
  currency: "$",
  items: [
    { id: "1", name: "Smart Pro Monitor X1", price: 899.00, quantity: 1, image: "https://picsum.photos/seed/monitor/200/200", description: "27-inch 4K UHD display." },
    { id: "2", name: "Mechanical Keyboard G-Series", price: 150.00, quantity: 1, image: "https://picsum.photos/seed/keyboard/200/200", description: "RGB backlit mechanical keyboard." },
    { id: "3", name: "Ergonomic Office Mouse", price: 85.00, quantity: 2, image: "https://picsum.photos/seed/mouse/200/200", description: "Wireless ergonomic mouse." },
    { id: "4", name: "Premium Desk Mat", price: 40.00, quantity: 1, image: "https://picsum.photos/seed/mat/200/200", description: "Large waterproof felt mat." }
  ]
};

const isModalOpen = ref(false);
const initialStep = ref<'checkout' | 'failure'>('checkout');

const openCheckout = (mode: 'checkout' | 'failure') => {
  initialStep.value = mode;
  isModalOpen.value = true;
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-[#F8FAF9] font-sans">
    <div class="text-center max-w-xl">
      <!-- 最大标题 22px -->
      <h1 class="text-[22px] font-medium text-slate-900 mb-4">LuxeStore Premium Checkout</h1>
      <!-- 正文 14px -->
      <p class="text-[14px] font-medium text-slate-500 mb-8 leading-relaxed">
        体验符合您品牌调性的高端收银台流程。我们为您准备了正常的支付流程以及支付失败的预览入口。
      </p>
      
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button @click="openCheckout('checkout')" class="bg-[#051129] hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-xl">
          打开收银台
        </button>
        <button @click="openCheckout('failure')" class="bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg">
          查看支付错误页面
        </button>
      </div>
    </div>

    <CheckoutModal v-if="isModalOpen" :order="MOCK_ORDER" :force-step="initialStep" @close="isModalOpen = false" />
  </div>
</template>

<style>
/* 确保加载 PingFang 类似字体感 */
body {
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
