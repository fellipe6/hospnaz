<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { ref } from 'vue';
import EstoqueBadge from './EstoqueBadge.vue';

const props = defineProps({
    products: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['edit', 'delete']);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nome: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    categoria: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
</script>

<template>
    <DataTable 
        :value="products" 
        :paginator="true" 
        :rows="10" 
        dataKey="id" 
        :rowHover="true" 
        v-model:filters="filters" 
        filterDisplay="menu" 
        :loading="loading"
        :globalFilterFields="['nome', 'codigo', 'categoria']"
        showGridlines
        class="w-full"
        :tableStyle="{ width: '100%' }"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" placeholder="Buscar produto..." />
                </span>
            </div>
        </template>
        <template #empty>Nenhum produto encontrado.</template>

        <Column field="codigo" header="Código" sortable style="min-width: 6rem">
            <template #body="{ data }">
                <span class="font-bold">{{ data.codigo }}</span>
            </template>
        </Column>
        
        <Column field="nome" header="Nome" sortable style="min-width: 14rem"></Column>
        
        <Column field="categoria" header="Categoria" sortable style="min-width: 10rem"></Column>
        
        <Column field="estoqueAtual" header="Estoque" sortable dataType="numeric" style="min-width: 8rem">
            <template #body="{ data }">
                {{ data.estoqueAtual }} {{ data.unidade }}
            </template>
        </Column>

        <Column field="status" header="Status" sortable style="min-width: 10rem">
            <template #body="{ data }">
                <EstoqueBadge :status="data.status" :estoque="data.estoqueAtual" />
            </template>
        </Column>

        <Column header="Ações" :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="emit('edit', slotProps.data)" />
                <Button icon="pi pi-trash" outlined rounded severity="danger" @click="emit('delete', slotProps.data)" />
            </template>
        </Column>
    </DataTable>
</template>
