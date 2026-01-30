<script setup>
import { PepService } from '@/service/PepService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const pepService = new PepService();

const record = ref({
    paciente: {},
    agendamento: {},
    sinaisVitais: {},
    diagnostico: {},
    status: 'Em atendimento'
});

const loading = ref(true);
const saving = ref(false);

const statuses = [
    { label: 'Em atendimento', value: 'Em atendimento' },
    { label: 'Finalizado', value: 'Finalizado' }
];

onMounted(() => {
    const id = route.params.id;
    if (id) {
        pepService.getRecordById(id).then((data) => {
            record.value = data;
            loading.value = false;
        }).catch(err => {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Registro não encontrado', life: 3000 });
            router.push('/pep');
        });
    } else {
        // Initialize for new record if needed (mocked)
        loading.value = false;
    }
});

const onSave = () => {
    saving.value = true;
    pepService.saveRecord(record.value).then(() => {
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Prontuário salvo com sucesso', life: 3000 });
        if (record.value.status === 'Finalizado') {
            router.push('/pep');
        }
    }).finally(() => {
        saving.value = false;
    });
};

const goBack = () => {
    router.push('/pep');
};

const isReadOnly = () => record.value.status === 'Finalizado';
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="card p-4 flex justify-between items-center bg-primary-50">
            <div class="flex items-center gap-4">
                <Button icon="pi pi-chevron-left" rounded text @click="goBack" />
                <div>
                    <h1 class="text-2xl font-bold m-0">Atendimento Clínico</h1>
                    <span v-if="record.paciente" class="text-muted-color">
                        {{ record.paciente.nome }} | {{ record.paciente.cpf }} | {{ record.paciente.genero }}
                    </span>
                </div>
            </div>
            <div class="flex gap-2">
                <Tag v-if="record.status" :value="record.status" :severity="record.status === 'Finalizado' ? 'success' : 'warn'" class="p-2" />
                <Button v-if="!isReadOnly()" label="Salvar e Continuar" icon="pi pi-save" outlined @click="onSave" :loading="saving" />
                <Button v-if="!isReadOnly()" label="Finalizar Atendimento" icon="pi pi-check" @click="record.status = 'Finalizado'; onSave()" :loading="saving" />
            </div>
        </div>

        <div class="grid grid-cols-12 gap-6">
            <!-- Coluna Esquerda: Dados Gerais -->
            <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div class="card">
                    <div class="font-semibold text-lg mb-4">Sinais Vitais</div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-2">
                            <label for="pa">PA (mmHg)</label>
                            <InputText id="pa" v-model="record.sinaisVitais.pa" :disabled="isReadOnly()" placeholder="120x80" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="temp">Temp (°C)</label>
                            <InputText id="temp" v-model="record.sinaisVitais.temp" :disabled="isReadOnly()" placeholder="36.5" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="fc">FC (bpm)</label>
                            <InputText id="fc" v-model="record.sinaisVitais.fc" :disabled="isReadOnly()" placeholder="70" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="spo2">SpO2 (%)</label>
                            <InputText id="spo2" v-model="record.sinaisVitais.spo2" :disabled="isReadOnly()" placeholder="98" />
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="font-semibold text-lg mb-4">Identificação Profissional</div>
                    <div class="flex flex-col gap-2 mb-4">
                        <label>Profissional Responsável</label>
                        <InputText :value="record.profissional?.nome" disabled />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label>Data/Hora Registro</label>
                        <InputText :value="new Date(record.dataHora).toLocaleString('pt-BR')" disabled />
                    </div>
                </div>
            </div>

            <!-- Coluna Direita: Evolução e Diagnóstico -->
            <div class="col-span-12 lg:col-span-8 flex flex-col gap-6">
                <div class="card">
                    <Tabs value="0">
                        <TabList>
                            <Tab value="0">Avaliação</Tab>
                            <Tab value="1">Diagnóstico e Conduta</Tab>
                            <Tab value="2">Prescrição</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel value="0">
                                <div class="flex flex-col gap-4 py-4">
                                    <div class="flex flex-col gap-2">
                                        <label class="font-bold">Queixa Principal</label>
                                        <Textarea v-model="record.queixaPrincipal" rows="2" :disabled="isReadOnly()" />
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label class="font-bold">História da Doença Atual (HDA)</label>
                                        <Textarea v-model="record.historiaDoencaAtual" rows="4" :disabled="isReadOnly()" />
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label class="font-bold">Evolução Clínica</label>
                                        <Textarea v-model="record.evolucao" rows="6" :disabled="isReadOnly()" />
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value="1">
                                <div class="flex flex-col gap-4 py-4">
                                    <div class="grid grid-cols-12 gap-4">
                                        <div class="col-span-3 flex flex-col gap-2">
                                            <label class="font-bold">CID-10</label>
                                            <InputText v-model="record.diagnostico.cid" placeholder="Ex: R51" :disabled="isReadOnly()" />
                                        </div>
                                        <div class="col-span-9 flex flex-col gap-2">
                                            <label class="font-bold">Descrição Diagnóstica</label>
                                            <InputText v-model="record.diagnostico.descricao" placeholder="Ex: Cefaleia" :disabled="isReadOnly()" />
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label class="font-bold">Conduta e Plano Terapêutico</label>
                                        <Textarea v-model="record.conduta" rows="8" :disabled="isReadOnly()" />
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value="2">
                                <div class="flex flex-col gap-4 py-4">
                                    <div class="flex flex-col gap-2">
                                        <label class="font-bold">Prescrição Médica</label>
                                        <Textarea v-model="record.prescricao" rows="12" placeholder="Digite a medicação, dose e via de administração..." :disabled="isReadOnly()" />
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label class="font-bold">Observações</label>
                                        <Textarea v-model="record.observacoes" rows="3" :disabled="isReadOnly()" />
                                    </div>
                                </div>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
     margin-bottom: 0;
}
</style>
