
<script setup lang="ts">
import { ref } from 'vue';
import { useGemini } from '../composables/useGemini';
import type { OrderData } from '../types';

const props = defineProps<{
  order: OrderData;
}>();

const isOpen = ref(false);
const input = ref('');
const messages = ref<{role: 'user' | 'assistant', content: string}[]>([]);
const isLoading = ref(false);
const { getOrderAssistance } = useGemini();

const handleSend = async () => {
  if (!input.value.trim() || isLoading.value) return;
  
  const userMsg = input.value;
  messages.value.push({ role: 'user', content: userMsg });
  input.value = '';
  isLoading.value = true;

  const response = await getOrderAssistance(userMsg, props.order);
  messages.value.push({ role: 'assistant', content: response });
  isLoading.value = false;
};
</script>

<template>
  <div class="relative">
    <!-- 常规-小-Semibold: 14px -->
    <button v-if="!isOpen" @click="isOpen = true" class="flex items-center gap-2 text-slate-500 hover:text-[#6AB3FC] transition-colors text-[14px] font-semibold group">
      <div class="w-8 h-8 rounded-full bg-slate-200 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>
      Have a question about your order?
    </button>
    
    <div v-else class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[260px] animate-in slide-in-from-bottom-2">
      <div class="bg-slate-50 px-4 py-2 flex justify-between items-center border-b border-slate-100">
        <!-- 辅助文字-Semibold: 12px -->
        <span class="text-[12px] font-semibold text-slate-600">Luxe Assistant</span>
        <button @click="isOpen = false" class="text-slate-400 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <!-- 聊天内容 常规-小: 14px -->
      <div class="flex-grow p-4 overflow-y-auto space-y-3 custom-scrollbar text-[14px]">
        <p v-if="messages.length === 0" class="text-slate-400 text-[12px] text-center italic">Ask me anything about your items.</p>
        <div v-for="(m, i) in messages" :key="i" :class="['flex', m.role === 'user' ? 'justify-end' : 'justify-start']">
          <div :class="['max-w-[80%] px-3 py-2 rounded-xl', m.role === 'user' ? 'bg-[#6AB3FC] text-white rounded-br-none' : 'bg-slate-100 text-slate-700 rounded-bl-none']">
            {{ m.content }}
          </div>
        </div>
        <div v-if="isLoading" class="flex justify-start">
          <div class="bg-slate-100 px-3 py-2 rounded-xl animate-pulse text-[12px]">Thinking...</div>
        </div>
      </div>
      <div class="p-2 border-t border-slate-100 flex gap-2">
        <input v-model="input" @keyup.enter="handleSend" type="text" placeholder="Ask..." class="flex-grow text-[12px] px-3 py-2 rounded-lg bg-slate-50 border-none focus:ring-1 focus:ring-[#6AB3FC] outline-none" />
        <button @click="handleSend" class="bg-[#6AB3FC] text-white p-2 rounded-lg hover:bg-[#549EE8]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>
