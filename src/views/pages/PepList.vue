<script setup>
import { PepService } from '@/service/PepService';
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const pepService = new PepService();

const records = ref([]);
const loading = ref(true);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    pacienteNome: { value: null, matchMode: FilterMatchMode.CONTAINS },
    profissionalNome: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const statuses = ref(['Aberto', 'Em atendimento', 'Finalizado']);

onMounted(() => {
    pepService.getRecords().then((data) => {
        records.value = data;
        loading.value = false;
    });
});

const getSeverity = (status) => {
    switch (status) {
        case 'Finalizado':
            return 'success';
        case 'Em atendimento':
            return 'warn';
        case 'Aberto':
            return 'info';
        default:
            return null;
    }
};

const formatDate = (value) => {
    return new Date(value).toLocaleString('pt-BR');
};

const onRowSelect = (event) => {
    router.push(`/pep/${event.data.id}`);
};
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Prontuário Eletrônico (PEP)</div>
        <p class="mb-6 text-muted-color">Listagem de atendimentos e históricos clínicos.</p>

        <DataTable
            :value="records"
            :loading="loading"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['pacienteNome', 'profissionalNome', 'status']"
            selectionMode="single"
            @row-click="onRowSelect"
            responsiveLayout="scroll"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Busca geral..." />
                    </span>
                    <Button type="button" icon="pi pi-filter-slash" label="Limpar Filtros" outlined @click="filters.value = {}" />
                </div>
            </template>
            <template #empty> Nenhum atendimento encontrado. </template>
            
            <Column field="dataHora" header="Data/Hora" sortable>
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.dataHora) }}
                </template>
            </Column>
            <Column field="pacienteNome" header="Paciente" sortable filterField="pacienteNome">
                <template #body="slotProps">
                    <div class="font-medium">{{ slotProps.data.pacienteNome }}</div>
                </template>
            </Column>
            <Column field="profissionalNome" header="Profissional" sortable filterField="profissionalNome"></Column>
            <Column field="status" header="Status" sortable filterField="status">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" />
                </template>
            </Column>
            <Column header="Ações" bodyStyle="text-align: center">
                <template #body="slotProps">
                    <Button icon="pi pi-external-link" text aria-label="Ver Detalhes" @click="onRowSelect(slotProps)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
