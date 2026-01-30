<script setup>
import { FinanceService } from '@/service/FinanceService';
import { onMounted, ref } from 'vue';

const lancamentos = ref([]);
const loading = ref(true);

onMounted(async () => {
    lancamentos.value = await FinanceService.getLancamentos();
    loading.value = false;
});

const getTipoLabel = (tipo) => {
    return tipo === 'CUSTO_OPERACIONAL' ? 'Custo Oper.' : 'Despesa';
};

const getTipoSeverity = (tipo) => {
    return tipo === 'CUSTO_OPERACIONAL' ? 'info' : 'secondary';
};

const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (value) => {
    return new Date(value).toLocaleString('pt-BR');
};
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Lançamentos Financeiros Detalhados</div>
        <DataTable :value="lancamentos" :loading="loading" paginator :rows="10" tableStyle="min-width: 50rem text-sm">
            <Column field="data" header="Data/Hora" sortable>
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.data) }}
                </template>
            </Column>
            <Column field="tipo" header="Tipo" sortable>
                <template #body="slotProps">
                    <Tag :value="getTipoLabel(slotProps.data.tipo)" :severity="getTipoSeverity(slotProps.data.tipo)" />
                </template>
            </Column>
            <Column field="centroCustoNome" header="Centro de Custo" sortable></Column>
            <Column field="descricao" header="Descrição" sortable></Column>
            <Column field="produtoNome" header="Produto Relacionado" sortable></Column>
            <Column field="valor" header="Valor" sortable>
                <template #body="slotProps">
                    <span class="font-bold">{{ formatCurrency(slotProps.data.valor) }}</span>
                </template>
            </Column>
            <Column field="origem" header="Origem" sortable>
                <template #body="slotProps">
                    <Tag :value="slotProps.data.origem" outlined severity="secondary" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
