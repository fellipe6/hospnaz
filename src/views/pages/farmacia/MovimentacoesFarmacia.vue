<script setup>
import { FarmaciaService } from '@/service/FarmaciaService';
import { onMounted, ref } from 'vue';

const farmaciaService = new FarmaciaService();
const movimentacoes = ref([]);
const loading = ref(true);

onMounted(async () => {
    movimentacoes.value = await farmaciaService.getMovimentacoes();
    loading.value = false;
});

const getTipoSeverity = (tipo) => {
    return tipo === 'ENTRADA' ? 'success' : 'warn';
};
</script>

<template>
    <div class="card">
        <h1 class="text-2xl font-bold mb-6 italic">Movimentações da Farmácia</h1>
        
        <DataTable :value="movimentacoes" :loading="loading" stripedRows tableStyle="min-width: 50rem">
            <template #empty> Nenhuma movimentação registrada. </template>
            <Column field="dataHora" header="Data/Hora">
                <template #body="slotProps">
                    {{ new Date(slotProps.data.dataHora).toLocaleString('pt-BR') }}
                </template>
            </Column>
            <Column field="tipo" header="Tipo">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.tipo" :severity="getTipoSeverity(slotProps.data.tipo)" />
                </template>
            </Column>
            <Column field="medicamento" header="Medicamento" font-bold></Column>
            <Column field="quantidade" header="Qtd" text-center></Column>
            <Column field="origem" header="Origem/Destino"></Column>
            <Column field="responsavel" header="Responsável"></Column>
        </DataTable>
    </div>
</template>
