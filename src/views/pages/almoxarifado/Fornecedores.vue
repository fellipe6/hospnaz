<script setup>
import { FornecedorService } from '@/service/almoxarifado/fornecedor.mock';
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref } from 'vue';

const fornecedores = ref([]);
const loading = ref(true);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(() => {
    loading.value = true;
    FornecedorService.getFornecedores().then(data => {
        fornecedores.value = data;
        loading.value = false;
    });
});
</script>

<template>
    <div class="card">
        <DataTable 
            :value="fornecedores" 
            :paginator="true" 
            :rows="10" 
            dataKey="id" 
            :rowHover="true" 
            v-model:filters="filters" 
            filterDisplay="menu" 
            :loading="loading"
            :globalFilterFields="['nome', 'cnpj', 'email', 'telefone']"
            showGridlines
            class="w-full"
            stateStorage="session"
            stateKey="almoxarifado-fornecedores-table"
            :tableStyle="{ width: '100%' }"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <h5 class="m-0">Fornecedores</h5>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Buscar fornecedor..." />
                    </span>
                </div>
            </template>
            <template #empty>Nenhum fornecedor encontrado.</template>

            <Column field="nome" header="Nome" sortable style="min-width: 14rem"></Column>
            <Column field="cnpj" header="CNPJ" sortable style="min-width: 10rem"></Column>
            <Column field="telefone" header="Telefone" sortable style="min-width: 10rem"></Column>
            <Column field="email" header="Email" sortable style="min-width: 14rem"></Column>
            
            <Column header="Ações" :exportable="false" style="min-width: 8rem">
                <template #body>
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" disabled v-tooltip="'Edição desabilitada no mock'" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
