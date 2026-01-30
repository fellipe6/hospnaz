<script setup>
import { FinanceService } from '@/service/FinanceService';
import { onMounted, ref } from 'vue';

const centros = ref([]);
const loading = ref(true);

onMounted(async () => {
    centros.value = await FinanceService.getCentrosCusto();
    loading.value = false;
});
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-4">
            <div class="font-semibold text-xl">Centros de Custo</div>
            <Button label="Novo Centro" icon="pi pi-plus" size="small" />
        </div>
        <DataTable :value="centros" :loading="loading" tableStyle="min-width: 30rem">
            <Column field="id" header="ID" style="width: 10%"></Column>
            <Column field="nome" header="Nome do Centro" style="width: 60%"></Column>
            <Column field="status" header="Status" style="width: 15%">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status" severity="success" />
                </template>
            </Column>
            <Column header="Ações" style="width: 15%">
                <template #body>
                    <Button icon="pi pi-pencil" text rounded />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
