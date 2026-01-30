<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { ref } from 'vue';

const props = defineProps({
    movimentacoes: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    tipo: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR');
};

const getTipoSeverity = (tipo) => {
    return tipo === 'ENTRADA' ? 'success' : 'danger';
};
</script>

<template>
    <DataTable 
        :value="movimentacoes" 
        :paginator="true" 
        :rows="10" 
        dataKey="id" 
        :rowHover="true" 
        v-model:filters="filters" 
        filterDisplay="menu" 
        :loading="loading"
        :globalFilterFields="['produtoNome', 'responsavel', 'observacao']"
        showGridlines
        sortField="data"
        :sortOrder="-1"
        class="w-full"
        :tableStyle="{ width: '100%' }"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" placeholder="Buscar movimentação..." />
                </span>
            </div>
        </template>
        <template #empty>Nenhuma movimentação registrada.</template>

        <Column field="data" header="Data/Hora" sortable style="min-width: 10rem">
            <template #body="{ data }">
                {{ formatDate(data.data) }}
            </template>
        </Column>

        <Column field="tipo" header="Tipo" sortable style="min-width: 8rem">
            <template #body="{ data }">
                <Tag :severity="getTipoSeverity(data.tipo)" :value="data.tipo" rounded></Tag>
            </template>
        </Column>
        
        <Column field="produtoNome" header="Produto" sortable style="min-width: 14rem">
            <template #body="{ data }">
                <span class="font-bold">{{ data.produtoNome }}</span>
                <div class="text-sm text-gray-500">{{ data.produtoCodigo }}</div>
            </template>
        </Column>
        
        <Column field="quantidade" header="Qtd" sortable dataType="numeric" style="min-width: 6rem">
             <template #body="{ data }">
                <span :class="{'text-green-600': data.tipo === 'ENTRADA', 'text-red-600': data.tipo === 'SAIDA', 'font-bold': true}">
                    {{ data.tipo === 'ENTRADA' ? '+' : '-' }}{{ data.quantidade }}
                </span>
            </template>
        </Column>

        <Column field="responsavel" header="Responsável" sortable style="min-width: 10rem"></Column>
        
        <Column field="observacao" header="Obs" style="min-width: 12rem"></Column>

    </DataTable>
</template>
