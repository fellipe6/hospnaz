<script setup>
import { computed } from 'vue';

const props = defineProps({
    status: {
        type: String,
        required: true
    },
    estoque: {
        type: Number,
        default: 0
    }
});

const severity = computed(() => {
    switch (props.status) {
        case 'ZERADO': return 'danger';
        case 'BAIXO': return 'danger';
        case 'ALERTA': return 'warn';
        case 'NORMAL': return 'success';
        case 'CRITICO': return 'danger';
        default: return 'info';
    }
});

const label = computed(() => {
    switch (props.status) {
        case 'ZERADO': return 'Zerado';
        case 'BAIXO': return 'Baixo';
        case 'ALERTA': return 'Alerta';
        case 'NORMAL': return 'Normal';
        case 'CRITICO': return 'Crítico';
        default: return props.status;
    }
});
</script>

<template>
    <Tag :severity="severity" :value="label" rounded></Tag>
</template>
