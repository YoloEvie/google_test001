
<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import { PaymentType, type OrderData, type SavedCard } from '../types';
import PaymentOption from './PaymentOption.vue';
import OrderSummary from './OrderSummary.vue';
import SmartAssistant from './SmartAssistant.vue';

const props = defineProps<{
  order: OrderData;
  forceStep?: 'checkout' | 'failure';
}>();

const emit = defineEmits(['close']);

// 状态管理
const selectedMethod = ref<string | null>(PaymentType.CREDIT_CARD); // 默认选中信用卡以匹配截图
const isProcessing = ref(false);
const step = ref<'checkout' | 'success' | 'failure'>(props.forceStep || 'checkout');
const errorMessage = ref<string | null>(null);
const toastVisible = ref(false);

// 监听 forceStep 变化
watch(() => props.forceStep, (newVal) => {
  if (newVal) step.value = newVal;
});

// 信用卡数据
const savedCards = ref<SavedCard[]>([
  { id: 'sc_1', brand: 'Visa', last4: '4242', expiry: '12/26', holderName: 'J. Smith' },
]);
const selectedCardId = ref<string | 'new'>('new'); // 默认显示表单
const shouldSaveNewCard = ref(false);
const newCardData = reactive({ number: '', expiry: '', cvc: '', name: '' });

const finalAmount = computed(() => props.order.totalAmount - props.order.discountAmount);

const showToast = (msg: string) => {
  errorMessage.value = msg;
  toastVisible.value = true;
  setTimeout(() => { toastVisible.value = false; }, 3000);
};

const handlePayment = () => {
  if (!selectedMethod.value) {
    showToast("请先选择一种支付方式进行支付");
    return;
  }

  if (selectedMethod.value === PaymentType.CREDIT_CARD && selectedCardId.value === 'new') {
    if (!newCardData.number || !newCardData.expiry || !newCardData.cvc) {
      showToast("请完善您的信用卡信息");
      return;
    }
  }

  isProcessing.value = true;
  setTimeout(() => {
    const isSuccess = Math.random() > 0.1; // 提高成功率以方便演示
    if (isSuccess) {
      step.value = 'success';
    } else {
      step.value = 'failure';
    }
    isProcessing.value = false;
  }, 1500);
};

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close');
};

onMounted(() => window.addEventListener('keydown', handleEsc));
onUnmounted(() => window.removeEventListener('keydown', handleEsc));

// 卡品牌图标 Mocks (SVG 路径简化版)
const brands = [
  { name: 'UnionPay', color: 'bg-[#00707b]', icon: '银联' },
  { name: 'Mastercard', color: 'bg-white', icon: 'M' },
  { name: 'Maestro', color: 'bg-white', icon: 'm' },
  { name: 'Visa', color: 'bg-[#1a1f71]', icon: 'VISA' },
  { name: 'Amex', color: 'bg-[#016fd0]', icon: 'AMEX' },
  { name: 'Diners', color: 'bg-white', icon: 'D' },
  { name: 'Discover', color: 'bg-white', icon: 'Disc' },
  { name: 'JCB', color: 'bg-white', icon: 'JCB' },
];
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300">
    
    <!-- Error Toast -->
    <Transition
      enter-active-class="transform transition duration-300 ease-out"
      enter-from-class="-translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transform transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-4 opacity-0"
    >
      <div v-if="toastVisible" class="absolute top-10 left-1/2 -translate-x-1/2 z-[60] bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
        <span class="text-[14px] font-medium">{{ errorMessage }}</span>
      </div>
    </Transition>

    <!-- Success Feedback -->
    <div v-if="step === 'success'" class="bg-white rounded-[32px] p-12 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
      <div class="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-[22px] font-medium text-slate-900 mb-3">支付成功</h2>
      <p class="text-[14px] font-medium text-slate-500 mb-10">订单 #{{ order.orderNumber }} 已完成支付。</p>
      <button @click="emit('close')" class="w-full bg-[#6AB3FC] hover:bg-[#549EE8] text-white font-bold py-4 rounded-xl transition-all">
        完成
      </button>
    </div>

    <!-- Failure Feedback -->
    <div v-else-if="step === 'failure'" class="bg-white rounded-[32px] p-12 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
      <div class="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 class="text-[22px] font-medium text-slate-900 mb-3">支付失败</h2>
      <p class="text-[14px] font-medium text-slate-500 mb-10 leading-relaxed">请检查您的账户信息或尝试使用其他支付方式。</p>
      <div class="space-y-3">
        <button @click="handlePayment" class="w-full bg-[#051129] text-white font-bold py-4 rounded-xl transition-all hover:bg-slate-800">
          重新尝试
        </button>
        <button @click="step = 'checkout'" class="w-full bg-slate-50 text-slate-500 font-bold py-4 rounded-xl transition-all hover:bg-slate-100">
          更换支付方式
        </button>
      </div>
    </div>

    <!-- Main Checkout Modal -->
    <div v-else class="bg-white rounded-[32px] w-full max-w-5xl h-[820px] max-h-[95vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-bottom-8 duration-500">
      <!-- Left Side -->
      <div class="flex-1 p-10 flex flex-col h-full bg-white relative">
        <div class="mb-8 shrink-0">
          <h2 class="text-[22px] font-medium text-slate-900">支付方式</h2>
          <p class="text-slate-400 text-[12px] font-medium mt-1">请选择您偏好的支付工具</p>
        </div>

        <div class="space-y-4 flex-grow overflow-y-auto pr-3 custom-scrollbar pb-6">
          <PaymentOption :type="PaymentType.GOOGLE_PAY" :isSelected="selectedMethod === PaymentType.GOOGLE_PAY" label="Google Pay" @select="v => selectedMethod = v">
            <template #icon>
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h4.74c-.2 1.06-.9 1.95-1.82 2.56l2.72 2.12c1.59-1.47 2.51-3.62 2.51-6.12 0-.63-.06-1.24-.18-1.84h-8.03z"/></svg>
            </template>
          </PaymentOption>

          <PaymentOption :type="PaymentType.APPLE_PAY" :isSelected="selectedMethod === PaymentType.APPLE_PAY" label="Apple Pay" @select="v => selectedMethod = v">
             <template #icon>
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.96.95-2.23 1.55-3.5 1.55-1.27 0-2.32-.45-3.23-.95-.9-.51-2.05-.51-2.95 0-.91.5-1.96.95-3.23.95-1.27 0-2.54-.6-3.5-1.55-3.75-3.71-3.75-9.73 0-13.44.96-.95 2.23-1.55 3.5-1.55 1.27 0-2.32.45 3.23.95.9.51 2.05.51 2.95 0 .91-.5 1.96-.95 3.23-.95 1.27 0 2.54.6 3.5 1.55 3.75 3.71 3.75 9.73 0 13.44z"/></svg>
            </template>
          </PaymentOption>

          <!-- 信用卡部分 - 1:1 还原截图设计 -->
          <div class="border-t border-slate-50 pt-4">
             <div class="flex items-center gap-3 mb-4">
                <div class="w-6 h-6 rounded-full border-4 border-blue-500 flex items-center justify-center">
                   <div class="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div class="flex items-center gap-2">
                   <div class="w-8 h-6 bg-slate-700 rounded flex items-center justify-center text-[6px] text-white italic font-bold">CARD</div>
                   <span class="text-[18px] font-semibold text-slate-900">Credit Card</span>
                </div>
             </div>

             <div class="pl-9 space-y-5">
                <p class="text-[14px] text-slate-400 font-medium">All fields are required unless marked otherwise.</p>
                
                <!-- 卡号输入框 -->
                <div class="space-y-2">
                   <label class="block text-[14px] font-semibold text-slate-800">Card number</label>
                   <div class="relative">
                      <input 
                        v-model="newCardData.number" 
                        placeholder="1234 5678 9012 3456" 
                        class="w-full px-5 py-3.5 border border-slate-300 rounded-xl outline-none text-[18px] font-medium text-slate-400 placeholder-slate-300 bg-white" 
                      />
                      <div class="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-100 w-10 h-6 rounded border border-slate-200 flex items-center justify-center">
                         <div class="w-6 h-1 bg-slate-300"></div>
                      </div>
                   </div>
                </div>

                <!-- 品牌图标行 -->
                <div class="flex flex-wrap gap-2 py-1">
                   <div v-for="brand in brands" :key="brand.name" 
                      class="w-10 h-7 rounded border border-slate-200 flex items-center justify-center text-[6px] font-bold"
                      :class="brand.color">
                      <span :class="brand.color !== 'bg-white' ? 'text-white' : 'text-slate-400'">{{ brand.icon }}</span>
                   </div>
                </div>

                <!-- 有效期 & CVC -->
                <div class="grid grid-cols-2 gap-6">
                   <div class="space-y-2">
                      <label class="block text-[14px] font-semibold text-slate-800">Expiry date</label>
                      <div class="relative">
                         <input 
                            v-model="newCardData.expiry" 
                            placeholder="MM/YY" 
                            class="w-full px-5 py-3.5 border border-slate-300 rounded-xl outline-none text-[18px] font-medium text-slate-400 placeholder-slate-300 bg-white" 
                         />
                         <div class="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-100 w-10 h-6 rounded border border-slate-200 flex items-center justify-center">
                            <div class="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                               <div class="w-1.5 h-1.5 rounded-full bg-red-400/50"></div>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div class="space-y-2">
                      <label class="block text-[14px] font-semibold text-slate-800">Security code</label>
                      <div class="relative">
                         <input 
                            v-model="newCardData.cvc" 
                            placeholder="3 digits" 
                            class="w-full px-5 py-3.5 border border-slate-300 rounded-xl outline-none text-[18px] font-medium text-slate-400 placeholder-slate-300 bg-white" 
                         />
                         <div class="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-100 w-10 h-6 rounded border border-slate-200 flex items-center justify-center">
                            <div class="w-6 h-3 bg-slate-300/40 rounded flex items-center justify-end px-1">
                               <div class="w-1.5 h-1.5 rounded-full bg-red-400/50"></div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <!-- 持卡人姓名 - 蓝色高亮设计 -->
                <div class="space-y-2">
                   <label class="block text-[14px] font-semibold text-blue-500">Name on card</label>
                   <input 
                      v-model="newCardData.name" 
                      placeholder="J. Smith" 
                      class="w-full px-5 py-4 border-2 border-blue-500 rounded-xl outline-none text-[18px] font-medium text-slate-400 placeholder-slate-300 bg-white shadow-[0_0_10px_rgba(59,130,246,0.1)]" 
                   />
                </div>

                <!-- 保存卡片功能 (保留) -->
                <div class="pt-2">
                  <label class="flex items-center gap-3 cursor-pointer group select-none">
                    <div class="relative">
                      <input type="checkbox" v-model="shouldSaveNewCard" class="peer sr-only" />
                      <div class="w-10 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-500 transition-colors"></div>
                      <div class="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                    </div>
                    <span class="text-[14px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Save card for future payments</span>
                  </label>
                </div>
             </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-slate-50 shrink-0">
          <button @click="handlePayment" :disabled="isProcessing"
            :class="['w-full py-4 rounded-2xl font-bold text-[16px] transition-all flex items-center justify-center gap-2', isProcessing ? 'bg-slate-800 text-white' : 'bg-[#051129] text-white shadow-xl shadow-slate-200']">
            <svg v-if="isProcessing" class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <template v-else>立即支付 {{ order.currency }}{{ finalAmount.toFixed(2) }}</template>
          </button>
          <div class="mt-6"><SmartAssistant :order="order" /></div>
        </div>
      </div>

      <!-- Right Side -->
      <div class="w-full md:w-[380px] bg-[#F9FAFB] p-10 border-l border-slate-50 flex flex-col h-full relative">
        <button @click="emit('close')" class="absolute top-8 right-8 text-slate-300 hover:text-slate-500"><svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2" /></svg></button>
        <OrderSummary :order="order" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
