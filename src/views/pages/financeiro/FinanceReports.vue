<script setup>
import { ref } from 'vue';

const reports = ref([
    { id: 1, nome: 'Custo Mensal por Fornecedor', categoria: 'Almoxarifado', ultimaGeracao: '30/01/2024' },
    { id: 2, nome: 'Resumo de Despesas por Centro de Custo', categoria: 'Financeiro', ultimaGeracao: '28/01/2024' },
    { id: 3, nome: 'Consumo de Produtos vs Compras', categoria: 'Misto', ultimaGeracao: '25/01/2024' },
    { id: 4, nome: 'Fluxo de Caixa Operacional (Mock)', categoria: 'Financeiro', ultimaGeracao: '29/01/2024' }
]);

const exportReport = (nome) => {
    // Simulação de exportação
    alert(`Exportando relatório: ${nome}... (Simulação CSV/PDF)`);
};
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Relatórios Financeiros</div>
        <p class="text-muted-color mb-6">Gere e exporte relatórios consolidados do sistema.</p>

        <div class="grid grid-cols-12 gap-4">
            <div v-for="report in reports" :key="report.id" class="col-span-12 md:col-span-6 lg:col-span-4">
                <div class="p-4 border rounded-lg surface-card hover:surface-100 cursor-pointer transition-colors shadow-sm">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="p-2 bg-primary-100 rounded-lg">
                            <i class="pi pi-file-pdf text-primary-500 text-xl"></i>
                        </div>
                        <div>
                            <div class="font-medium">{{ report.nome }}</div>
                            <small class="text-muted-color">{{ report.categoria }}</small>
                        </div>
                    </div>
                    <div class="flex justify-between items-center mt-4">
                        <small class="text-muted-color">Último: {{ report.ultimaGeracao }}</small>
                        <div class="flex gap-2">
                            <Button icon="pi pi-download" text rounded size="small" @click="exportReport(report.nome)" v-tooltip.top="'Exportar CSV'" />
                            <Button icon="pi pi-print" text rounded size="small" @click="exportReport(report.nome)" v-tooltip.top="'Imprimir PDF'" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
