<script setup>
import { MovimentacaoService } from '@/service/almoxarifado/movimentacao.mock';
import { onMounted, ref } from 'vue';

const movements = ref(null);

function formatDate(value) {
    if (!value) return '';
    return new Date(value).toLocaleDateString('pt-BR');
}

onMounted(async () => {
    movements.value = await MovimentacaoService.getMovimentacoesComProdutos();
});
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Últimas Movimentações (Estoque)</div>
        <DataTable :value="movements" :rows="5" :paginator="true" responsiveLayout="scroll">
            <Column field="data" header="Data" :sortable="true" style="width: 25%">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.data) }}
                </template>
            </Column>
            <Column field="produtoNome" header="Produto" :sortable="true" style="width: 40%"></Column>
            <Column field="quantidade" header="Qtd" :sortable="true" style="width: 15%"></Column>
            <Column field="tipo" header="Tipo" :sortable="true" style="width: 20%">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.tipo" :severity="slotProps.data.tipo === 'ENTRADA' ? 'success' : 'warn'" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
