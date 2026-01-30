<script setup>
import { FarmaciaService } from '@/service/FarmaciaService';
import { onMounted, ref } from 'vue';

const farmaciaService = new FarmaciaService();
const estoque = ref([]);
const loading = ref(true);

onMounted(async () => {
    estoque.value = await farmaciaService.getEstoque();
    loading.value = false;
});

const getStockSeverity = (item) => {
    if (item.estoque <= item.estoqueMinimo / 2) return 'danger';
    if (item.estoque <= item.estoqueMinimo) return 'warn';
    return 'success';
};

const getStockLabel = (item) => {
    if (item.estoque <= item.estoqueMinimo / 2) return 'CRÍTICO';
    if (item.estoque <= item.estoqueMinimo) return 'ATENÇÃO';
    return 'OK';
};
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold m-0 italic">Estoque da Farmácia</h1>
            <div class="flex gap-2">
                <Button label="Inventário" icon="pi pi-file-excel" outlined severity="secondary" />
                <Button label="Entrada" icon="pi pi-plus" />
            </div>
        </div>

        <DataTable :value="estoque" :loading="loading" stripedRows responsiveLayout="scroll">
            <template #empty> Nenhum medicamento no estoque. </template>
            <Column field="codigo" header="Código" style="width: 8rem"></Column>
            <Column field="nome" header="Medicamento" sortable style="min-width: 15rem">
                <template #body="slotProps">
                    <div class="flex flex-col">
                        <span class="font-bold">{{ slotProps.data.nome }}</span>
                        <small class="text-muted-color">{{ slotProps.data.categoria }}</small>
                    </div>
                </template>
            </Column>
            <Column field="lote" header="Lote/Vencimento" style="width: 12rem">
                <template #body="slotProps">
                    <div>{{ slotProps.data.lote }}</div>
                    <small :class="{'text-red-500': new Date(slotProps.data.vencimento) < new Date()}" class="font-bold">
                        {{ new Date(slotProps.data.vencimento).toLocaleDateString('pt-BR') }}
                    </small>
                </template>
            </Column>
            <Column field="estoque" header="Qtd Atual" style="width: 8rem">
                <template #body="slotProps">
                    <span class="text-xl font-bold">{{ slotProps.data.estoque }}</span>
                    <small class="ml-1">{{ slotProps.data.unidade }}</small>
                </template>
            </Column>
            <Column header="Status" style="width: 10rem">
                <template #body="slotProps">
                    <Tag :value="getStockLabel(slotProps.data)" :severity="getStockSeverity(slotProps.data)" />
                </template>
            </Column>
            <Column header="Ações" style="width: 8rem">
                <template #body>
                    <Button icon="pi pi-history" text rounded severity="secondary" v-tooltip.top="'Histórico'" />
                    <Button icon="pi pi-pencil" text rounded severity="secondary" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
