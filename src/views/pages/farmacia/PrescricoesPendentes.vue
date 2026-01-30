<script setup>
import { FarmaciaService } from '@/service/FarmaciaService';
import { simulacaoService } from '@/service/SimulacaoService';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const prescricoes = ref([]);
const loading = ref(true);

onMounted(async () => {
    // Merge static mocks from service with session mocks
    const staticPrescricoes = await new FarmaciaService().getPrescricoesPendentes();
    const sessionPrescricoes = simulacaoService.getPrescricoesPendentes();
    prescricoes.value = [...sessionPrescricoes, ...staticPrescricoes];
    loading.value = false;
});

const getStatusSeverity = (status) => {
    switch (status) {
        case 'Pendente': return 'warn';
        case 'Parcial': return 'info';
        case 'Atendida': return 'success';
        default: return 'secondary';
    }
};

const iniciarDispensacao = (id) => {
    router.push(`/farmacia/dispensacao/${id}`);
};
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="text-2xl font-bold m-0 italic">Prescrições Pendentes</h1>
                <p class="text-muted-color m-0">Aguardando separação e dispensação</p>
            </div>
            <div class="flex gap-2">
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText placeholder="Buscar paciente/medico..." />
                </span>
            </div>
        </div>

        <DataTable :value="prescricoes" :loading="loading" stripedRows responsiveLayout="scroll">
            <template #empty> Nenhuma prescrição pendente. </template>
            <Column field="dataHora" header="Data/Hora" sortable>
                <template #body="slotProps">
                    {{ new Date(slotProps.data.dataHora).toLocaleString('pt-BR') }}
                </template>
            </Column>
            <Column field="pacienteNome" header="Paciente" sortable>
                <template #body="slotProps">
                    <div class="flex flex-col">
                        <span class="font-bold">{{ slotProps.data.pacienteNome }}</span>
                        <small class="text-muted-color">{{ slotProps.data.idade }} | Leito: {{ slotProps.data.leito }}</small>
                    </div>
                </template>
            </Column>
            <Column field="medico" header="Médico Prescritor"></Column>
            <Column field="status" header="Status">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                </template>
            </Column>
            <Column header="Quantidade de Itens">
                <template #body="slotProps">
                    <span class="font-bold">{{ slotProps.data.itens.length }}</span> itens prescritos
                </template>
            </Column>
            <Column header="Ações">
                <template #body="slotProps">
                    <Button label="Dispensar" icon="pi pi-check-square" outlined size="small" @click="iniciarDispensacao(slotProps.data.id)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
