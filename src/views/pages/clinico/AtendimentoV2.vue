<script setup>
import { ClinicoService } from '@/service/ClinicoService';
import { PatientService } from '@/service/PatientService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const clinicoService = new ClinicoService();

const patient = ref(null);
const loading = ref(true);
const saving = ref(false);

const evolution = ref('');
const selectedCid = ref(null);
const cids = ref([]);
const prescriptionItems = ref([
    { medicamento: '', dose: '', via: '', frequencia: '', duracao: '' }
]);

const vias = ['Oral (VO)', 'Intravenosa (EV)', 'Intramuscular (IM)', 'Subcutânea (SC)', 'Inalatória', 'Tópica'];
const frequencias = ['6/6h', '8/8h', '12/12h', '24/24h', 'Dose Única', 'Se necessário (SN)'];

onMounted(async () => {
    const id = route.params.id;
    patient.value = await PatientService.getPatientById(id);
    cids.value = await clinicoService.getCids();
    loading.value = false;
});

const addPrescriptionItem = () => {
    prescriptionItems.value.push({ medicamento: '', dose: '', via: '', frequencia: '', duracao: '' });
};

const removePrescriptionItem = (index) => {
    prescriptionItems.value.splice(index, 1);
};

const saveAttendance = async () => {
    saving.value = true;
    const data = {
        pacienteId: patient.value.id,
        pacienteNome: patient.value.name,
        evolucao: evolution.value,
        cid: selectedCid.value,
        prescricao: prescriptionItems.value
    };
    
    await clinicoService.saveAtendimento(data);
    
    setTimeout(() => {
        toast.add({ severity: 'success', summary: 'Atendimento Salvo', detail: 'Encaminhando para dispensação...', life: 3000 });
        saving.value = false;
        router.push('/farmacia/prescricoes'); // Simula fluxo contínuo para farmácia
    }, 1500);
};

const goBack = () => router.back();

const getRiskSeverity = (alergias) => {
    return alergias && alergias !== 'Nenhuma' ? 'danger' : 'success';
};
</script>

<template>
    <div v-if="loading" class="flex justify-center p-8">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
    </div>

    <div v-else class="flex flex-col gap-4">
        <!-- Clinical Header -->
        <div class="card p-4 border-l-4 border-primary shadow-md sticky top-0 z-10 bg-surface-0 dark:bg-surface-900">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div class="flex items-center gap-4">
                    <Button icon="pi pi-arrow-left" text rounded @click="goBack" />
                    <Avatar :label="patient.name?.charAt(0)" size="large" shape="circle" class="bg-primary text-white" />
                    <div>
                        <div class="flex items-center gap-2">
                            <h1 class="text-xl font-bold m-0">{{ patient.name }}</h1>
                            <Tag :value="patient.gender || 'F'" severity="secondary" rounded />
                        </div>
                        <p class="text-sm text-muted-color m-0">CPF: {{ patient.cpf }} | Idade: 45 anos</p>
                    </div>
                </div>
                
                <div class="flex flex-wrap gap-3">
                    <div class="flex flex-col items-center p-2 bg-surface-50 dark:bg-surface-800 rounded border border-dashed">
                        <span class="text-[10px] font-bold uppercase text-muted-color">Pressão</span>
                        <span class="font-bold text-blue-500">120/80</span>
                    </div>
                    <div class="flex flex-col items-center p-2 bg-surface-50 dark:bg-surface-800 rounded border border-dashed">
                        <span class="text-[10px] font-bold uppercase text-muted-color">Freq. Card.</span>
                        <span class="font-bold text-red-500">72 bpm</span>
                    </div>
                    <div class="flex flex-col items-center p-2 bg-surface-50 dark:bg-surface-800 rounded border border-dashed">
                        <span class="text-[10px] font-bold uppercase text-muted-color">Sat. O2</span>
                        <span class="font-bold text-green-500">98%</span>
                    </div>
                    <Tag :value="patient.alergias ? 'Alergia: ' + patient.alergias : 'Sem Alergias'" :severity="getRiskSeverity(patient.alergias)" icon="pi pi-exclamation-triangle" />
                </div>
                
                <Button label="Finalizar e Prescrever" icon="pi pi-check-circle" @click="saveAttendance" :loading="saving" />
            </div>
        </div>

        <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12 lg:col-span-8">
                <div class="card p-0">
                    <Tabs value="0">
                        <TabList>
                            <Tab value="0"><i class="pi pi-comment mr-2"></i>Evolução Clínica</Tab>
                            <Tab value="1"><i class="pi pi-list mr-2"></i>Prescrição Eletrônica</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel value="0">
                                <div class="p-4">
                                    <h3 class="text-lg font-bold mb-3">Anamnese e Evolução</h3>
                                    <Textarea v-model="evolution" rows="12" class="w-full font-serif text-lg leading-relaxed p-4" placeholder="Descreva o quadro clínico do paciente, queixas, exame físico e conduta..." fluid />
                                    
                                    <div class="mt-6">
                                        <h3 class="text-lg font-bold mb-3">Hipótese Diagnóstica (CID-10)</h3>
                                        <div class="flex gap-2">
                                            <Select v-model="selectedCid" :options="cids" optionLabel="name" placeholder="Selecionar CID-10" class="w-full" filter fluid>
                                                <template #option="slotProps">
                                                    <span class="font-bold text-primary mr-2">{{ slotProps.option.code }}</span>
                                                    <span>{{ slotProps.option.name }}</span>
                                                </template>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value="1">
                                <div class="p-4">
                                    <div class="flex justify-between items-center mb-4">
                                        <h3 class="text-lg font-bold m-0">Medicamentos</h3>
                                        <Button label="Adicionar Item" icon="pi pi-plus" size="small" outlined @click="addPrescriptionItem" />
                                    </div>
                                    
                                    <div v-for="(item, index) in prescriptionItems" :key="index" class="p-4 bg-surface-50 dark:bg-surface-800 rounded-lg border mb-4 relative group">
                                        <Button icon="pi pi-trash" severity="danger" text rounded class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" @click="removePrescriptionItem(index)" />
                                        
                                        <div class="grid grid-cols-12 gap-4">
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="block text-xs font-bold mb-2 uppercase text-muted-color">Medicamento</label>
                                                <InputText v-model="item.medicamento" placeholder="Ex: Dipirona Sódica 500mg/ml" fluid />
                                            </div>
                                            <div class="col-span-12 md:col-span-3">
                                                <label class="block text-xs font-bold mb-2 uppercase text-muted-color">Dose</label>
                                                <InputText v-model="item.dose" placeholder="Ex: 1 ampolla" fluid />
                                            </div>
                                            <div class="col-span-12 md:col-span-3">
                                                <label class="block text-xs font-bold mb-2 uppercase text-muted-color">Via</label>
                                                <Select v-model="item.via" :options="vias" placeholder="Selecione" fluid />
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="block text-xs font-bold mb-2 uppercase text-muted-color">Frequência</label>
                                                <Select v-model="item.frequencia" :options="frequencias" placeholder="Selecione" fluid />
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <label class="block text-xs font-bold mb-2 uppercase text-muted-color">Observação / Duração</label>
                                                <InputText v-model="item.duracao" placeholder="Ex: Por 5 dias" fluid />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-4">
                <div class="card">
                    <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                        <i class="pi pi-history text-primary"></i>
                        Ações Rápidas
                    </h3>
                    <div class="flex flex-col gap-3">
                        <Button label="Emitir Atestado" icon="pi pi-file-pdf" text severity="secondary" class="justify-start" />
                        <Button label="Solicitar Exames" icon="pi pi-microchip" text severity="secondary" class="justify-start" />
                        <Button label="Encaminhamento" icon="pi pi-directions" text severity="secondary" class="justify-start" />
                        <Divider />
                        <Button label="Histórico Longitudinal" icon="pi pi-clock" text @click="router.push(`/pages/patients/${patient.id}/history`)" class="justify-start" />
                    </div>
                </div>

                <div class="card bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                    <h4 class="text-blue-700 dark:text-blue-300 font-bold mb-2">Dica Clínica</h4>
                    <p class="text-sm m-0 text-blue-600 dark:text-blue-400 italic">
                        "A integração com a farmácia permite visualizar em tempo real se o medicamento prescrito possui estoque no hospital."
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.p-tabview-panels) {
    padding: 0;
}
</style>
