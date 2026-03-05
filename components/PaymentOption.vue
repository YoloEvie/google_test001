
<script setup lang="ts">
const props = defineProps<{
  type: any;
  isSelected: boolean;
  label: string;
}>();

const emit = defineEmits(['select']);
</script>

<template>
  <button
    @click="emit('select', props.type)"
    type="button"
    :class="[
      'w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all shrink-0',
      isSelected 
        ? 'border-blue-500 bg-white shadow-sm' 
        : 'border-slate-50 hover:border-slate-100 bg-white'
    ]"
  >
    <div class="flex items-center gap-4">
      <div :class="['p-2 rounded-xl transition-colors', isSelected ? 'bg-blue-50 text-blue-500' : 'bg-slate-50 text-slate-400']">
        <slot name="icon"></slot>
      </div>
      <!-- 次级小标题 16px Semibold -->
      <span :class="['text-[16px] font-semibold transition-colors', isSelected ? 'text-slate-900' : 'text-slate-500']">
        {{ label }}
      </span>
    </div>
    <div :class="[
      'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
      isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-100'
    ]">
      <svg v-if="isSelected" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </div>
  </button>
</template>
