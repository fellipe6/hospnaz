<script setup>
import HISKpiCard from '@/components/dashboard/HISKpiCard.vue';
import HISRecentActivity from '@/components/dashboard/HISRecentActivity.vue';
import { DashboardHISService } from '@/service/DashboardHISService';
import { onMounted, ref } from 'vue';

const dashboardService = new DashboardHISService();
const data = ref(null);
const loading = ref(true);

const selectedPeriod = ref('Hoje');
const periods = ref(['Hoje', '7 dias', '30 dias', 'Personalizado']);

const specialtyData = ref(null);
const specialtyOptions = ref(null);
const evolutionData = ref(null);
const evolutionOptions = ref(null);
const statusData = ref(null);
const statusOptions = ref(null);
const operationalData = ref(null);
const operationalOptions = ref(null);

onMounted(async () => {
    data.value = await dashboardService.getDashboardData();
    initCharts();
    loading.value = false;
});

function initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const primaryColor = documentStyle.getPropertyValue('--p-primary-500');
    const surfaceBorder = documentStyle.getPropertyValue('--p-surface-200');

    // 1. Especialidades (Bar)
    specialtyData.value = {
        labels: data.value.assistencial.especialidades.map(e => e.label),
        datasets: [
            {
                label: 'Atendimentos',
                backgroundColor: primaryColor,
                data: data.value.assistencial.especialidades.map(e => e.value),
                borderRadius: 4
            }
        ]
    };
    specialtyOptions.value = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: { legend: { display: false } },
        scales: { 
            x: { grid: { display: false } }, 
            y: { beginAtZero: true, grid: { color: surfaceBorder } } 
        }
    };

    // 2. Evolução Diária (Line)
    evolutionData.value = {
        labels: data.value.assistencial.evoluçãoDiaria.labels,
        datasets: [
            {
                label: 'Volume de Atendimentos',
                data: data.value.assistencial.evoluçãoDiaria.values,
                fill: true,
                borderColor: primaryColor,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }
        ]
    };
    evolutionOptions.value = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { color: surfaceBorder } },
            y: { grid: { color: surfaceBorder } }
        }
    };

    // 3. Status PEP (Pie)
    statusData.value = {
        labels: data.value.assistencial.statusPep.map(s => s.label),
        datasets: [
            {
                data: data.value.assistencial.statusPep.map(s => s.value),
                backgroundColor: [
                    primaryColor,
                    documentStyle.getPropertyValue('--p-orange-500'),
                    documentStyle.getPropertyValue('--p-red-500')
                ]
            }
        ]
    };
    statusOptions.value = {
        plugins: { legend: { position: 'bottom' } }
    };

    // 4. Fluxo Operacional (Double Bar)
    operationalData.value = {
        labels: data.value.operacional.entradasAltas.labels,
        datasets: [
            {
                label: 'Entradas',
                backgroundColor: documentStyle.getPropertyValue('--p-blue-400'),
                data: data.value.operacional.entradasAltas.entradas
            },
            {
                label: 'Altas',
                backgroundColor: documentStyle.getPropertyValue('--p-green-400'),
                data: data.value.operacional.entradasAltas.altas
            }
        ]
    };
    operationalOptions.value = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        scales: {
            x: { stacked: false, grid: { display: false } },
            y: { stacked: false, grid: { color: surfaceBorder } }
        }
    };
}
</script>

<template>
    <div v-if="loading" class="flex justify-center p-8">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
    </div>

    <div v-else class="flex flex-col gap-6">
        <!-- Dashboard Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 card mb-0 p-4 border-l-4 border-primary">
            <div>
                <h1 class="text-2xl font-bold m-0">Dashboard HIS</h1>
                <p class="text-muted-color m-0">Visão geral operacional e assistencial do hospital</p>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-sm font-bold secondary-color">Período:</span>
                <SelectButton v-model="selectedPeriod" :options="periods" aria-labelledby="basic" />
                <Button icon="pi pi-refresh" severity="secondary" rounded text />
            </div>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <template v-for="kpi in data.kpis" :key="kpi.label">
                <HISKpiCard v-bind="kpi" />
            </template>
        </div>

        <div class="grid grid-cols-12 gap-6">
            <!-- Indicadores Assistenciais -->
            <div class="col-span-12 lg:col-span-8">
                <div class="card h-full">
                    <div class="flex items-center gap-2 mb-4">
                        <i class="pi pi-heart-fill text-red-500"></i>
                        <h2 class="text-xl font-bold m-0">Indicadores Assistenciais</h2>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-6">
                        <div class="col-span-2 md:col-span-1">
                            <div class="font-bold mb-4 text-muted-color uppercase text-xs">Atendimentos por Especialidade</div>
                            <Chart type="bar" :data="specialtyData" :options="specialtyOptions" class="h-64" />
                        </div>
                        <div class="col-span-2 md:col-span-1">
                            <div class="font-bold mb-4 text-muted-color uppercase text-xs">Evolução de Atendimentos</div>
                            <Chart type="line" :data="evolutionData" :options="evolutionOptions" class="h-64" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Status de Prontuários -->
            <div class="col-span-12 lg:col-span-4">
                <div class="card h-full">
                    <h2 class="text-xl font-bold mb-4">Qualidade PEP</h2>
                    <div class="font-bold mb-4 text-muted-color uppercase text-xs">Status dos Prontuários (%)</div>
                    <Chart type="pie" :data="statusData" :options="statusOptions" class="h-64" />
                </div>
            </div>

            <!-- Indicadores Operacionais -->
            <div class="col-span-12 lg:col-span-7">
                <div class="card">
                    <div class="flex items-center gap-2 mb-4">
                        <i class="pi pi-sliders-h text-primary"></i>
                        <h2 class="text-xl font-bold m-0">Fluxo Operacional (HIS)</h2>
                    </div>
                    <div class="font-bold mb-4 text-muted-color uppercase text-xs">Fluxo de Pacientes (Entradas vs Altas)</div>
                    <Chart type="bar" :data="operationalData" :options="operationalOptions" class="h-80" />
                </div>
            </div>

            <!-- Profissionais com Mais Atendimentos -->
            <div class="col-span-12 lg:col-span-5">
                <div class="card">
                    <h2 class="text-xl font-bold mb-4">Produtividade</h2>
                    <div class="font-bold mb-4 text-muted-color uppercase text-xs">Profissionais (Top Atendimentos)</div>
                    <DataTable :value="data.operacional.profissionaisTop" class="p-datatable-sm">
                        <Column field="nome" header="Profissional"></Column>
                        <Column field="atendimentos" header="Qtd" sortable style="width: 5rem"></Column>
                        <Column header="Meta">
                            <template #body="slotProps">
                                <ProgressBar :value="(slotProps.data.atendimentos / 150) * 100" :showValue="false" style="height: .5rem" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>

            <!-- Atividade Recente -->
            <div class="col-span-12 lg:col-span-12">
                <HISRecentActivity :activities="data.atividadesRecentes" />
            </div>
        </div>
    </div>
</template>
