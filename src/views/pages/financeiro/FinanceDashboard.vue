<script setup>
import { FinanceService } from '@/service/FinanceService';
import { onMounted, ref } from 'vue';

const stats = ref(null);
const loading = ref(true);

const chartData = ref(null);
const chartOptions = ref(null);

onMounted(async () => {
    stats.value = await FinanceService.getDashboardStats();
    initChart();
    loading.value = false;
});

const initChart = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    chartData.value = {
        labels: stats.value.custoPorSetor.map(s => s.label),
        datasets: [
            {
                data: stats.value.custoPorSetor.map(s => s.value),
                backgroundColor: [
                    documentStyle.getPropertyValue('--p-primary-500'),
                    documentStyle.getPropertyValue('--p-orange-500'),
                    documentStyle.getPropertyValue('--p-green-500'),
                    documentStyle.getPropertyValue('--p-cyan-500')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--p-primary-400'),
                    documentStyle.getPropertyValue('--p-orange-400'),
                    documentStyle.getPropertyValue('--p-green-400'),
                    documentStyle.getPropertyValue('--p-cyan-400')
                ]
            }
        ]
    };

    chartOptions.value = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true
                }
            }
        }
    };
};

const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
</script>

<template>
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Despesas Totais</span>
                        <div class="text-surface-900 font-medium text-xl" v-if="stats">{{ formatCurrency(stats.totalDespesas) }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 rounded-border w-10 h-10">
                        <i class="pi pi-dollar text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">Jan/2024 </span>
                <span class="text-muted-color">referência</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Valor em Estoque</span>
                        <div class="text-surface-900 font-medium text-xl" v-if="stats">{{ formatCurrency(stats.valorEstoque) }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 rounded-border w-10 h-10">
                        <i class="pi pi-box text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">Atualizado </span>
                <span class="text-muted-color">em tempo real</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Contas a Pagar</span>
                        <div class="text-surface-900 font-medium text-xl" v-if="stats">{{ formatCurrency(stats.totalContasPagar) }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 rounded-border w-10 h-10">
                        <i class="pi pi-receipt text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium" v-if="stats">{{ stats.contasPendentes }} </span>
                <span class="text-muted-color">contas pendentes</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Custo / Paciente</span>
                        <div class="text-surface-900 font-medium text-xl">R$ 145,20</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 rounded-border w-10 h-10">
                        <i class="pi pi-users text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">+5% </span>
                <span class="text-muted-color">que mês anterior</span>
            </div>
        </div>

        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Custo por Setor (Centro de Custo)</div>
                <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-80 mx-auto" />
            </div>
        </div>

        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Principais Despesas Recentes</div>
                <DataTable :value="stats?.custoPorSetor" :rows="5" :paginator="false" responsiveLayout="scroll">
                    <Column field="label" header="Setor" style="width: 50%"></Column>
                    <Column field="value" header="Valor Acumulado" style="width: 50%">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.value) }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
