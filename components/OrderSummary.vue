
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { OrderData } from '../types';

const props = defineProps<{
  order: OrderData;
}>();

const isExpanded = ref(false);
const finalAmount = computed(() => props.order.totalAmount - props.order.discountAmount);
const displayCount = computed(() => isExpanded.value ? props.order.items.length : 3);
const hasMore = computed(() => props.order.items.length > 3);
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Header 20px -->
    <h3 class="text-[20px] font-medium text-slate-900 mb-6">订单摘要</h3>

    <!-- Product List -->
    <div class="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-8">
      <div 
        v-for="item in order.items.slice(0, displayCount)" 
        :key="item.id" 
        class="flex gap-4 items-center"
      >
        <div class="relative shrink-0">
          <img :src="item.image" :alt="item.name" class="w-14 h-14 rounded-xl object-cover bg-white border border-slate-100" />
          <span v-if="item.quantity > 1" class="absolute -top-1 -right-1 bg-[#051129] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
            {{ item.quantity }}
          </span>
        </div>
        <div class="flex-grow min-w-0">
          <!-- 正文 14px Bold -->
          <div class="text-[14px] font-bold text-slate-800 truncate">{{ item.name }}</div>
          <!-- 辅助说明 12px -->
          <div class="text-[12px] font-medium text-slate-400 truncate mt-0.5">{{ item.description }}</div>
        </div>
        <!-- 正文 14px Bold -->
        <div class="text-[14px] font-bold text-slate-900 shrink-0">
          {{ order.currency }}{{ item.price.toFixed(2) }}
        </div>
      </div>

      <button 
        v-if="hasMore"
        @click="isExpanded = !isExpanded"
        class="w-full text-center text-slate-400 hover:text-slate-600 text-[12px] font-medium py-2 rounded-lg border border-dashed border-slate-200 transition-all mt-2"
      >
        {{ isExpanded ? '收起列表' : `查看全部 ${order.items.length} 件商品` }}
      </button>
    </div>

    <!-- Amount Calculation -->
    <div class="mt-auto space-y-3 pt-6 border-t border-slate-100">
      <!-- 正文 14px -->
      <div class="flex justify-between text-[14px] font-medium text-slate-500">
        <span>小计</span>
        <span>{{ order.currency }}{{ order.totalAmount.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between text-[14px] font-medium text-red-500">
        <span>优惠金额</span>
        <span>-{{ order.currency }}{{ order.discountAmount.toFixed(2) }}</span>
      </div>
      
      <div class="pt-4 flex flex-col items-end">
        <!-- 正文 14px Bold -->
        <span class="text-[14px] font-bold text-slate-900 mb-1">应付总额</span>
        <!-- 最大字号 32px Semibold -->
        <span class="text-[32px] font-semibold text-[#051129] tracking-tight leading-none">
          {{ order.currency }}{{ finalAmount.toFixed(2) }}
        </span>
      </div>
    </div>
    
    <!-- 特别特殊字号 10px -->
    <p class="text-[10px] text-slate-300 text-center mt-6">
      点击支付即代表您同意 LuxeStore 的服务条款与隐私政策。
    </p>
  </div>
</template>
