<script setup>
import { FinanceService } from '@/service/FinanceService';
import { onMounted, ref } from 'vue';

const sectorCosts = ref([]);
const totalBudget = 10000; // Mock budget for percentage calculation

onMounted(async () => {
    const stats = await FinanceService.getDashboardStats();
    sectorCosts.value = stats.custoPorSetor;
});

const calculatePercentage = (value) => {
    return Math.min(Math.round((value / totalBudget) * 100), 100);
};

const getProgressBarColor = (index) => {
    const colors = ['bg-orange-500', 'bg-cyan-500', 'bg-pink-500', 'bg-green-500', 'bg-purple-500', 'bg-teal-500'];
    return colors[index % colors.length];
};

const getTextColor = (index) => {
    const colors = ['text-orange-500', 'text-cyan-500', 'text-pink-500', 'text-primary', 'text-purple-500', 'text-teal-500'];
    return colors[index % colors.length];
};
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">Custos por Setor (Mensal)</div>
        </div>
        <ul class="list-none p-0 m-0">
            <li v-for="(sector, index) in sectorCosts" :key="index" class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">{{ sector.label }}</span>
                    <div class="mt-1 text-muted-color">Centro de Custo</div>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div :class="[getProgressBarColor(index), 'h-full']" :style="{ width: calculatePercentage(sector.value) + '%' }"></div>
                    </div>
                    <span :class="[getTextColor(index), 'ml-4 font-medium']">%{{ calculatePercentage(sector.value) }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>
