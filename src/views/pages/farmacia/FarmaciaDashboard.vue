<script setup>
import { FarmaciaService } from '@/service/FarmaciaService';
import { onMounted, ref } from 'vue';

const farmaciaService = new FarmaciaService();
const data = ref(null);
const loading = ref(true);

const consumoData = ref(null);
const consumoOptions = ref(null);
const maisDispensadosData = ref(null);
const maisDispensadosOptions = ref(null);

onMounted(async () => {
    data.value = await farmaciaService.getDashboardData();
    initCharts();
    loading.value = false;
});

function initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const primaryColor = documentStyle.getPropertyValue('--p-primary-500');

    consumoData.value = {
        labels: data.value.consumoPorSetor.map(d => d.label),
        datasets: [{
            data: data.value.consumoPorSetor.map(d => d.value),
            backgroundColor: [
                primaryColor,
                documentStyle.getPropertyValue('--p-orange-500'),
                documentStyle.getPropertyValue('--p-green-500'),
                documentStyle.getPropertyValue('--p-cyan-500')
            ]
        }]
    };

    consumoOptions.value = {
        plugins: { legend: { position: 'bottom' } }
    };

    maisDispensadosData.value = {
        labels: data.value.maisDispensados.map(d => d.label),
        datasets: [{
            label: 'Dispensações',
            backgroundColor: primaryColor,
            data: data.value.maisDispensados.map(d => d.value)
        }]
    };

    maisDispensadosOptions.value = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: { legend: { display: false } }
    };
}
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="card p-4 border-l-4 border-primary flex justify-between items-center mb-0">
            <div>
                <h1 class="text-2xl font-bold m-0 italic">Dashboard da Farmácia</h1>
                <p class="text-muted-color m-0">Visão estratégica e alertas de estoque</p>
            </div>
            <i class="pi pi-box text-3xl text-primary opacity-50"></i>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="card p-4 flex flex-col gap-2 border-l-4 border-orange-500">
                <span class="text-sm font-bold secondary-color uppercase">Prescrições Pendentes</span>
                <div class="text-3xl font-bold">{{ data?.kpis.prescricoesPendentes }}</div>
                <div class="text-xs text-orange-500 font-bold">Aguardando separação</div>
            </div>
            <div class="card p-4 flex flex-col gap-2 border-l-4 border-green-500">
                <span class="text-sm font-bold secondary-color uppercase">Dispensações (Hoje)</span>
                <div class="text-3xl font-bold">{{ data?.kpis.dispensacoesDia }}</div>
                <div class="text-xs text-green-500 font-bold">↑ 12% vs ontem</div>
            </div>
            <div class="card p-4 flex flex-col gap-2 border-l-4 border-red-500">
                <span class="text-sm font-bold secondary-color uppercase">Estoque Crítico</span>
                <div class="text-3xl font-bold">{{ data?.kpis.estoqueCritico }}</div>
                <div class="text-xs text-red-500 font-bold italic">Risco de falta</div>
            </div>
            <div class="card p-4 flex flex-col gap-2 border-l-4 border-blue-500">
                <span class="text-sm font-bold secondary-color uppercase">Custo Estimado Diário</span>
                <div class="text-3xl font-bold">{{ data?.kpis.custoDiario }}</div>
                <div class="text-xs text-muted-color">Gasto com medicamentos</div>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12 lg:col-span-6">
                <div class="card h-full">
                    <div class="font-bold text-lg mb-4">Consumo por Setor (%)</div>
                    <Chart type="pie" :data="consumoData" :options="consumoOptions" class="h-80" />
                </div>
            </div>
            <div class="col-span-12 lg:col-span-6">
                <div class="card h-full">
                    <div class="font-bold text-lg mb-4">Medicamentos Mais Dispensados</div>
                    <Chart type="bar" :data="maisDispensadosData" :options="maisDispensadosOptions" class="h-80" />
                </div>
            </div>
        </div>
    </div>
</template>
