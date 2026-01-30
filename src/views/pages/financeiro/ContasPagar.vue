<script setup>
import { FinanceService } from '@/service/FinanceService';
import { onMounted, ref } from 'vue';

const contas = ref([]);
const loading = ref(true);

onMounted(async () => {
    contas.value = await FinanceService.getContasPagar();
    loading.value = false;
});

const getSeverity = (status) => {
    switch (status) {
        case 'Pago': return 'success';
        case 'Pendente': return 'warn';
        case 'Atrasado': return 'danger';
        default: return null;
    }
};

const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (value) => {
    return new Date(value).toLocaleDateString('pt-BR');
};
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Contas a Pagar (Integração Almoxarifado)</div>
        <DataTable :value="contas" :loading="loading" paginator :rows="10" tableStyle="min-width: 50rem">
            <Column field="dataVencimento" header="Vencimento" sortable>
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.dataVencimento) }}
                </template>
            </Column>
            <Column field="fornecedorNome" header="Fornecedor" sortable></Column>
            <Column field="produtoNome" header="Produto" sortable></Column>
            <Column field="quantidade" header="Qtd" sortable></Column>
            <Column field="valorTotal" header="Valor Total" sortable>
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.valorTotal) }}
                </template>
            </Column>
            <Column field="status" header="Status" sortable>
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" />
                </template>
            </Column>
            <Column header="Ações">
                <template #body="slotProps">
                    <Button icon="pi pi-search" text rounded />
                    <Button icon="pi pi-check" text rounded severity="success" v-if="slotProps.data.status === 'Pendente'" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
