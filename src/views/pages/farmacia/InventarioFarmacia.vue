<script setup>
import { simulacaoService } from '@/service/SimulacaoService';
import { onMounted, ref } from 'vue';

const inventario = ref([]);
const loading = ref(true);

onMounted(async () => {
    inventario.value = simulacaoService.getInventario();
    loading.value = false;
});

const getStockSeverity = (item) => {
    if (item.estoqueAtual <= item.estoqueMinimo / 2) return 'danger';
    if (item.estoqueAtual <= item.estoqueMinimo) return 'warn';
    return 'success';
};

const getStatusLabel = (item) => {
    if (item.estoqueAtual <= item.estoqueMinimo / 2) return 'CRÍTICO';
    if (item.estoqueAtual <= item.estoqueMinimo) return 'ATENÇÃO';
    return 'ADEQUADO';
};

const getValidadeSeverity = (validade) => {
    const diff = (new Date(validade) - new Date()) / (1000 * 60 * 60 * 24);
    if (diff < 30) return 'text-red-500 font-bold';
    if (diff < 90) return 'text-orange-500 font-bold';
    return 'text-surface-900 dark:text-surface-0';
};
</script>

<template>
    <div class="card">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold m-0 italic">Inventário Farmacêutico</h1>
                <p class="text-muted-color m-0">Controle de lotes, validades e níveis de segurança</p>
            </div>
            <div class="flex gap-2">
                <Button label="Ajuste de Estoque" icon="pi pi-sliders-h" outlined severity="secondary" />
                <Button label="Entrada por NF" icon="pi pi-file-import" />
            </div>
        </div>

        <DataTable :value="inventario" v-model:expandedRows="expandedRows" dataKey="id" responsiveLayout="scroll" :loading="loading" stripedRows>
            <template #empty> Nenhum item no inventário. </template>
            <Column expander style="width: 3rem" />
            <Column field="codigo" header="Código" style="width: 8rem"></Column>
            <Column field="nome" header="Medicamento" sortable style="min-width: 15rem">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-lg">{{ slotProps.data.nome }}</span>
                            <Tag v-if="slotProps.data.lastModified" value="ALTERAÇÃO RECENTE" severity="info" size="small" />
                        </div>
                        <small class="text-muted-color">{{ slotProps.data.categoria }}</small>
                    </div>
                </template>
            </Column>
            <Column header="Estoque Total" style="width: 10rem">
                <template #body="slotProps">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl font-bold">{{ slotProps.data.estoqueAtual }}</span>
                        <span class="text-xs uppercase text-muted-color">{{ slotProps.data.unidade }}</span>
                    </div>
                </template>
            </Column>
            <Column header="Status" style="width: 10rem">
                <template #body="slotProps">
                    <Tag :value="getStatusLabel(slotProps.data)" :severity="getStockSeverity(slotProps.data)" />
                </template>
            </Column>
            <Column header="Ações" style="width: 8rem">
                <template #body>
                    <Button icon="pi pi-history" text rounded severity="secondary" v-tooltip.top="'Trilha de Auditoria'" />
                    <Button icon="pi pi-chart-line" text rounded severity="secondary" v-tooltip.top="'Ver Consumo'" />
                </template>
            </Column>

            <!-- Expanded Rows for Batch Details -->
            <template #expansion="slotProps">
                <div class="p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                    <h5 class="mb-3 font-bold">Lotes Disponíveis - {{ slotProps.data.nome }}</h5>
                    <DataTable :value="slotProps.data.lotes" class="p-datatable-sm">
                        <Column field="numero" header="Número do Lote"></Column>
                        <Column field="validade" header="Data de Validade">
                            <template #body="subProps">
                                <span :class="getValidadeSeverity(subProps.data.validade)">
                                    {{ new Date(subProps.data.validade).toLocaleDateString('pt-BR') }}
                                </span>
                            </template>
                        </Column>
                        <Column field="quantidade" header="Quantidade"></Column>
                        <Column header="Ocupação">
                            <template #body="subProps">
                                <ProgressBar :value="(subProps.data.quantidade / slotProps.data.estoqueMinimo) * 100" :showValue="false" style="height: 0.4rem" />
                            </template>
                        </Column>
                        <Column header="Ações">
                            <template #body>
                                <Button icon="pi pi-ban" text severity="danger" size="small" v-tooltip.top="'Bloquear Lote'" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script>
const expandedRows = ref([]);
</script>
