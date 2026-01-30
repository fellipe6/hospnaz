<script setup>
import { ClinicoService } from '@/service/ClinicoService';
import { PatientService } from '@/service/PatientService';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const clinicoService = new ClinicoService();

const patient = ref(null);
const events = ref([]);
const loading = ref(true);

onMounted(async () => {
    const id = route.params.id;
    patient.value = await PatientService.getPatientById(id);
    events.value = await clinicoService.getHistorioLongitudinal(id);
    loading.value = false;
});

const goBack = () => router.back();
</script>

<template>
    <div v-if="loading" class="flex justify-center p-8">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
    </div>

    <div v-else class="flex flex-col gap-6">
        <div class="card p-4 flex justify-between items-center border-l-4 border-primary">
            <div class="flex items-center gap-3">
                <Button icon="pi pi-arrow-left" text rounded @click="goBack" />
                <div>
                    <h1 class="text-2xl font-bold m-0 italic">Histórico Longitudinal</h1>
                    <p class="text-muted-color m-0">Linha do tempo clínica de: <span class="font-bold text-surface-900 dark:text-surface-0">{{ patient.name }}</span></p>
                </div>
            </div>
            <div class="flex gap-2">
                <Button label="Imprimir Prontuário" icon="pi pi-print" outlined severity="secondary" />
                <Button label="Novo Atendimento" icon="pi pi-plus" @click="router.push(`/clinico/atendimento/${patient.id}`)" />
            </div>
        </div>

        <div class="card">
            <Timeline :value="events" align="alternate" class="customized-timeline">
                <template #marker="slotProps">
                    <span class="flex w-8 h-8 items-center justify-center rounded-full z-10 shadow-sm" :class="`bg-${slotProps.item.cor}-500 text-white`">
                        <i :class="slotProps.item.icone"></i>
                    </span>
                </template>
                <template #content="slotProps">
                    <Card class="mt-4 transition-all hover:scale-[1.02]">
                        <template #title>
                            <span class="text-lg">{{ slotProps.item.titulo }}</span>
                        </template>
                        <template #subtitle>
                            <div class="flex items-center gap-2">
                                <i class="pi pi-calendar text-xs"></i>
                                <span>{{ slotProps.item.data }}</span>
                            </div>
                        </template>
                        <template #content>
                            <p class="m-0 text-muted-color leading-relaxed">
                                {{ slotProps.item.descricao }}
                            </p>
                            <div class="mt-4 pt-3 border-t flex items-center gap-2">
                                <Avatar icon="pi pi-user" size="small" shape="circle" />
                                <small class="font-bold italic">{{ slotProps.item.responsavel }}</small>
                            </div>
                        </template>
                        <template #footer>
                            <Button label="Ver Detalhes" text size="small" />
                        </template>
                    </Card>
                </template>
            </Timeline>
        </div>
    </div>
</template>

<style scoped>
.customized-timeline :deep(.p-timeline-event-opposite) {
    display: none;
}

@media screen and (min-width: 960px) {
    .customized-timeline :deep(.p-timeline-event-opposite) {
        display: block;
    }
}
</style>
