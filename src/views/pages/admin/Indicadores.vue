<script setup>
import { IndicatorService } from '@/service/IndicatorService';
import { onMounted, ref } from 'vue';

const indicatorService = new IndicatorService();
const indicators = ref(null);
const loading = ref(true);

const pieData = ref(null);
const pieOptions = ref(null);
const barData = ref(null);
const barOptions = ref(null);

onMounted(async () => {
    indicators.value = await indicatorService.getDashboardIndicators();
    setChartData();
    loading.value = false;
});

function setChartData() {
    const documentStyle = getComputedStyle(document.documentElement);

    // Pie Chart: Diagnósticos Frequentes
    pieData.value = {
        labels: indicators.value.diagnosticosFrequentes.map(d => d.label),
        datasets: [
            {
                data: indicators.value.diagnosticosFrequentes.map(d => d.value),
                backgroundColor: [
                    documentStyle.getPropertyValue('--p-primary-500'),
                    documentStyle.getPropertyValue('--p-orange-500'),
                    documentStyle.getPropertyValue('--p-green-500'),
                    documentStyle.getPropertyValue('--p-cyan-500')
                ]
            }
        ]
    };

    pieOptions.value = {
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    // Bar Chart: Atendimentos por Médico
    barData.value = {
        labels: indicators.value.atendimentosPorMedico.map(m => m.label),
        datasets: [
            {
                label: 'Atendimentos',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                data: indicators.value.atendimentosPorMedico.map(m => m.value)
            }
        ]
    };

    barOptions.value = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };
}
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="card">
            <h1 class="text-2xl font-bold mb-6">Indicadores e Dashboards Executivos</h1>
            
            <div class="grid grid-cols-12 gap-6 mb-6">
                <!-- KPI Cards -->
                <div class="col-span-12 md:col-span-4">
                    <div class="card p-4 border-l-4 border-primary shadow-sm h-full flex flex-col justify-center">
                        <span class="block text-muted-color font-medium mb-2 uppercase">Tempo Médio de Atendimento</span>
                        <div class="text-3xl font-bold">{{ indicators?.tempoMedioAtendimento || '---' }}</div>
                    </div>
                </div>
                <div class="col-span-12 md:col-span-4">
                    <div class="card p-4 border-l-4 border-green-500 shadow-sm h-full flex flex-col justify-center">
                        <span class="block text-muted-color font-medium mb-2 uppercase">Satisfação do Paciente</span>
                        <div class="text-3xl font-bold">98.5%</div>
                    </div>
                </div>
                <div class="col-span-12 md:col-span-4">
                    <div class="card p-4 border-l-4 border-orange-500 shadow-sm h-full flex flex-col justify-center">
                        <span class="block text-muted-color font-medium mb-2 uppercase">Taxa de Conversão de Exames</span>
                        <div class="text-3xl font-bold">72%</div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-6">
                <!-- Charts -->
                <div class="col-span-12 lg:col-span-6">
                    <div class="card shadow-none border">
                        <div class="font-bold text-xl mb-4">Atendimentos por Médico</div>
                        <Chart type="bar" :data="barData" :options="barOptions" class="h-80" />
                    </div>
                </div>
                <div class="col-span-12 lg:col-span-6">
                    <div class="card shadow-none border">
                        <div class="font-bold text-xl mb-4">Diagnósticos Frequentes (CID-10)</div>
                        <Chart type="pie" :data="pieData" :options="pieOptions" class="h-80" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Pacientes Recorrentes List -->
        <div class="card">
            <div class="font-bold text-xl mb-4">Pacientes com Maior Recorrência (Frequência Clínica)</div>
            <DataTable :value="indicators?.pacientesRecorrentes" stripedRows>
                <Column field="nome" header="Paciente"></Column>
                <Column field="atendimentos" header="Qtde de Atendimentos" style="width: 15rem">
                    <template #body="slotProps">
                        <ProgressBar :value="slotProps.data.atendimentos * 20" :showValue="false" style="height: .5rem" />
                        <span class="text-sm font-bold mt-1 block">{{ slotProps.data.atendimentos }} atendimentos</span>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
