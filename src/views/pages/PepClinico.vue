<script setup>
import { PepService } from '@/service/PepService';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const pepService = new PepService();

const record = ref({
    paciente: {},
    agendamento: {},
    status: 'Em atendimento',
    diagnostico: {},
    sinaisVitais: {}
});

const evolucoes = ref([]);
const sinaisVitaisHistory = ref([]);
const anexos = ref([]);
const historicoGeral = ref([]);
const loading = ref(true);
const saving = ref(false);

const activeTab = ref(0);

onMounted(async () => {
    const id = route.params.id;
    if (id) {
        try {
            record.value = await pepService.getRecordById(id);
            evolucoes.value = await pepService.getEvolucoes(id);
            sinaisVitaisHistory.value = await pepService.getSinaisVitais(id);
            anexos.value = await pepService.getAnexos(id);
            
            if (record.value.pacienteId) {
                historicoGeral.value = await pepService.getHistorialGeral(record.value.pacienteId);
            }
            
            loading.value = false;
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Registro não encontrado', life: 3000 });
            router.push('/pep');
        }
    }
});

const calculatedAge = computed(() => {
    if (!record.value.paciente?.dataNascimento) return '---';
    const birthDate = new Date(record.value.paciente.dataNascimento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age + ' anos';
});

const clinicalSummary = computed(() => {
    if (!record.value.paciente) return '';
    const name = record.value.paciente.nome;
    const gender = record.value.paciente.genero === 'Feminino' ? 'Feminina' : 'Masculino';
    const age = calculatedAge.value;
    const count = historicoGeral.value.length;
    return `${gender}, ${age}, com ${count} atendimentos registrados. Último diagnóstico: ${record.value.diagnostico?.descricao || 'Nenhum'}.`;
});

const getVitalSeverity = (type, value) => {
    const val = parseFloat(value);
    if (isNaN(val)) return 'secondary';
    
    if (type === 'pa') {
        const sys = parseInt(value.split('/')[0] || value.split('x')[0]);
        if (sys > 140) return 'danger';
        if (sys > 130) return 'warn';
        return 'success';
    }
    if (type === 'temp') {
        if (val > 37.8) return 'danger';
        if (val > 37.2) return 'warn';
        return 'success';
    }
    if (type === 'spo2') {
        if (val < 92) return 'danger';
        if (val < 95) return 'warn';
        return 'success';
    }
    return 'success';
};

const onSave = async () => {
    saving.value = true;
    try {
        await pepService.saveRecord(record.value);
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Prontuário atualizado', life: 3000 });
        if (record.value.status === 'Finalizado') {
            router.push('/pep');
        }
    } finally {
        saving.value = false;
    }
};

const goBack = () => router.push('/pep');
const isReadOnly = () => record.value.status === 'Finalizado';
</script>

<template>
    <div class="flex flex-col gap-4">
        <!-- 1️⃣ Cabeçalho Clínico Rico -->
        <div class="card p-4 border-l-4 border-primary shadow-md sticky top-0 z-10 bg-surface-0 dark:bg-surface-900">
            <div class="flex justify-between items-start">
                <div class="flex gap-4 items-center">
                    <Button icon="pi pi-chevron-left" rounded text @click="goBack" class="mr-2" />
                    <div>
                        <div class="flex items-center gap-3 mb-1">
                            <h1 class="text-xl font-bold m-0">{{ record.paciente?.nome || 'Carregando...' }}</h1>
                            <Tag :value="record.status" :severity="record.status === 'Finalizado' ? 'success' : 'warn'" />
                        </div>
                        <div class="flex gap-4 text-sm text-muted-color">
                            <span><i class="pi pi-id-card mr-1"></i> {{ record.paciente?.cpf }}</span>
                            <span><i class="pi pi-calendar mr-1"></i> {{ calculatedAge }} ({{ record.paciente?.genero }})</span>
                            <span><i class="pi pi-book mr-1"></i> Prontuário: #{{ record.id }}</span>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <Button v-if="!isReadOnly()" label="Salvar" icon="pi pi-save" text @click="onSave" :loading="saving" />
                    <Button v-if="!isReadOnly()" label="Finalizar" icon="pi pi-check" severity="success" @click="record.status = 'Finalizado'; onSave()" :loading="saving" />
                </div>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 lg:col-span-12">
                <div class="card p-0 overflow-hidden">
                    <Tabs v-model:value="activeTab">
                        <TabList>
                            <Tab value="0"><i class="pi pi-user mr-2"></i>Resumo</Tab>
                            <Tab value="1"><i class="pi pi-heart mr-2"></i>Sinais Vitais</Tab>
                            <Tab value="2"><i class="pi pi-comment mr-2"></i>Evolução</Tab>
                            <Tab value="3"><i class="pi pi-info-circle mr-2"></i>Diagnóstico</Tab>
                            <Tab value="4"><i class="pi pi-prescription mr-2"></i>Prescrição</Tab>
                            <Tab value="5"><i class="pi pi-paperclip mr-2"></i>Anexos</Tab>
                            <Tab value="6"><i class="pi pi-history mr-2"></i>Histórico Geral</Tab>
                        </TabList>
                        
                        <TabPanels>
                            <!-- 🧍 Resumo do Paciente -->
                            <TabPanel value="0">
                                <div class="p-4 grid grid-cols-12 gap-6">
                                    <div class="col-span-12 md:col-span-6 lg:col-span-8">
                                        <div class="text-xl font-bold mb-4">Resumo Clínico Cognitivo</div>
                                        <div class="p-4 bg-primary-50 dark:bg-primary-900/10 border-l-4 border-primary rounded text-lg italic leading-relaxed">
                                            "{{ clinicalSummary }}"
                                        </div>
                                        <Divider />
                                        <div class="grid grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <span class="block text-sm text-muted-color font-bold uppercase mb-1">Alergias</span>
                                                <Tag :value="record.paciente?.alergias || 'Nenhuma'" severity="danger" />
                                            </div>
                                            <div>
                                                <span class="block text-sm text-muted-color font-bold uppercase mb-1">Tipo Sanguíneo</span>
                                                <Tag :value="record.paciente?.tipoSanguineo || '---'" severity="info" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-span-12 md:col-span-6 lg:col-span-4">
                                        <div class="surface-ground p-4 rounded-lg border border-surface">
                                            <div class="font-bold mb-3">Últimas Medições</div>
                                            <div class="flex flex-col gap-3">
                                                <div class="flex justify-between items-center">
                                                    <span>Pressão Arterial</span>
                                                    <Tag :value="record.sinaisVitais?.pa" :severity="getVitalSeverity('pa', record.sinaisVitais?.pa)" />
                                                </div>
                                                <div class="flex justify-between items-center">
                                                    <span>Temperatura</span>
                                                    <Tag :value="record.sinaisVitais?.temp + '°C'" :severity="getVitalSeverity('temp', record.sinaisVitais?.temp)" />
                                                </div>
                                                <div class="flex justify-between items-center">
                                                    <span>Saturação O2</span>
                                                    <Tag :value="record.sinaisVitais?.spo2 + '%'" :severity="getVitalSeverity('spo2', record.sinaisVitais?.spo2)" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>

                            <!-- 🫀 Sinais Vitais -->
                            <TabPanel value="1">
                                <div class="p-4 flex flex-col gap-6">
                                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div class="card text-center p-4 border bg-surface-50 dark:bg-surface-800">
                                            <span class="block text-muted-color mb-2">P.A. (mmHg)</span>
                                            <InputText v-model="record.sinaisVitais.pa" class="w-full text-center text-xl font-bold" :disabled="isReadOnly()" placeholder="120/80" />
                                        </div>
                                        <div class="card text-center p-4 border bg-surface-50 dark:bg-surface-800">
                                            <span class="block text-muted-color mb-2">Temp. (°C)</span>
                                            <InputText v-model="record.sinaisVitais.temp" class="w-full text-center text-xl font-bold" :disabled="isReadOnly()" placeholder="36.5" />
                                        </div>
                                        <div class="card text-center p-4 border bg-surface-50 dark:bg-surface-800">
                                            <span class="block text-muted-color mb-2">F.C. (bpm)</span>
                                            <InputText v-model="record.sinaisVitais.fc" class="w-full text-center text-xl font-bold" :disabled="isReadOnly()" placeholder="70" />
                                        </div>
                                        <div class="card text-center p-4 border bg-surface-50 dark:bg-surface-800">
                                            <span class="block text-muted-color mb-2">SpO2 (%)</span>
                                            <InputText v-model="record.sinaisVitais.spo2" class="w-full text-center text-xl font-bold" :disabled="isReadOnly()" placeholder="98" />
                                        </div>
                                    </div>
                                    
                                    <div class="font-semibold mt-4 mb-2">Histórico de Medições do Período</div>
                                    <DataTable :value="sinaisVitaisHistory" size="small" stripedRows tableStyle="min-width: 50rem">
                                        <Column field="dataHora" header="Data/Hora">
                                            <template #body="slotProps">
                                                {{ new Date(slotProps.data.dataHora).toLocaleString('pt-BR') }}
                                            </template>
                                        </Column>
                                        <Column field="pa" header="P.A."></Column>
                                        <Column field="temp" header="Temp. (°C)"></Column>
                                        <Column field="fc" header="F.C. (bpm)"></Column>
                                        <Column field="spo2" header="SpO2 (%)"></Column>
                                    </DataTable>
                                </div>
                            </TabPanel>

                            <!-- 📝 Evolução (Timeline) -->
                            <TabPanel value="2">
                                <div class="p-4">
                                    <div class="flex justify-between items-center mb-6">
                                        <div class="text-lg font-bold">Linha do Tempo de Evoluções</div>
                                        <Button label="Nova Evolução" icon="pi pi-plus" size="small" :disabled="isReadOnly()" />
                                    </div>
                                    
                                    <Timeline :value="evolucoes" align="left" class="customized-timeline">
                                        <template #marker="slotProps">
                                            <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm bg-primary">
                                                <i class="pi pi-pencil text-sm"></i>
                                            </span>
                                        </template>
                                        <template #content="slotProps">
                                            <div class="card mb-6 p-4 border surface-card">
                                                <div class="flex justify-between items-center mb-3">
                                                    <span class="font-bold">{{ slotProps.data.dataHora ? new Date(slotProps.data.dataHora).toLocaleString('pt-BR') : 'Agora' }}</span>
                                                    <Tag value="Médico Responsável" severity="secondary" outlined />
                                                </div>
                                                <p class="m-0 text-lg leading-relaxed text-surface-700 dark:text-surface-100 italic">
                                                    {{ slotProps.data.texto }}
                                                </p>
                                            </div>
                                        </template>
                                    </Timeline>
                                    
                                    <div v-if="!isReadOnly()" class="mt-4 flex flex-col gap-2">
                                        <label class="font-bold">Evolução em Tempo Real</label>
                                        <Textarea v-model="record.evolucao" rows="6" class="w-full" placeholder="Descreva a evolução do paciente aqui..." />
                                    </div>
                                </div>
                            </TabPanel>

                            <!-- 🧠 Diagnóstico -->
                            <TabPanel value="3">
                                <div class="p-4">
                                    <div class="grid grid-cols-12 gap-6">
                                        <div class="col-span-12 md:col-span-4 flex flex-col gap-4">
                                            <div class="flex flex-col gap-2 font-bold">
                                                <label>CID-10 Principal</label>
                                                <InputText v-model="record.diagnostico.cid" placeholder="Ex: R51" :disabled="isReadOnly()" />
                                            </div>
                                            <div class="flex flex-col gap-2 font-bold">
                                                <label>Descrição</label>
                                                <InputText v-model="record.diagnostico.descricao" placeholder="Ex: Cefaleia" :disabled="isReadOnly()" />
                                            </div>
                                        </div>
                                        <div class="col-span-12 md:col-span-8 flex flex-col gap-4">
                                            <div class="flex flex-col gap-2 font-bold">
                                                <label>Plano de Conduta</label>
                                                <Textarea v-model="record.conduta" rows="10" :disabled="isReadOnly()" placeholder="Descreva os próximos passos, exames solicitados e orientações..." />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>

                            <!-- 💊 Prescrição -->
                            <TabPanel value="4">
                                <div class="p-4 flex flex-col gap-4">
                                    <div class="flex items-center gap-3 p-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded mb-2">
                                        <i class="pi pi-exclamation-circle text-xl"></i>
                                        <span>Atenção: Valide alergias antes de prescrever medicação. <strong>Paciente alérgico a: {{ record.paciente?.alergias || 'Nenhuma' }}</strong>.</span>
                                    </div>
                                    <div class="flex flex-col gap-2 font-bold">
                                        <label>Itens da Prescrição</label>
                                        <Textarea v-model="record.prescricao" rows="15" class="w-full text-lg font-mono" placeholder="1. Medicamento A - 500mg - Via Oral - de 8/8h..." :disabled="isReadOnly()" />
                                    </div>
                                    <div class="flex flex-col gap-2 font-bold">
                                        <label>Observações Adicionais</label>
                                        <InputText v-model="record.observacoes" :disabled="isReadOnly()" />
                                    </div>
                                </div>
                            </TabPanel>

                            <!-- 📎 Anexos -->
                            <TabPanel value="5">
                                <div class="p-4">
                                    <div class="flex justify-between items-center mb-6">
                                        <div class="text-lg font-bold">Documentos e Exames Anexados</div>
                                        <Button label="Anexar Arquivo" icon="pi pi-upload" size="small" outlined />
                                    </div>
                                    
                                    <ul class="list-none p-0 m-0 border rounded overflow-hidden">
                                        <li v-for="anexo in anexos" :key="anexo.id" class="flex items-center justify-between p-4 border-b last:border-0 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                                            <div class="flex items-center gap-4">
                                                <i :class="[anexo.tipo === 'Imagem' ? 'pi pi-image' : 'pi pi-file-pdf', 'text-2xl text-primary']"></i>
                                                <div>
                                                    <div class="font-bold">{{ anexo.nome }}</div>
                                                    <small class="text-muted-color">{{ anexo.tipo }} | Enviado em: {{ anexo.data }}</small>
                                                </div>
                                            </div>
                                            <Button icon="pi pi-eye" text rounded @click="toast.add({severity: 'info', summary: 'Preview', detail: 'Visualização simulada do arquivo'})" />
                                        </li>
                                    </ul>
                                </div>
                            </TabPanel>

                            <!-- 📜 Histórico do Paciente (Timeline Geral) -->
                            <TabPanel value="6">
                                <div class="p-4">
                                    <div class="text-lg font-bold mb-6">Linha do Tempo Clínica (Longitudinal)</div>
                                    
                                    <Timeline :value="historicoGeral" align="alternate" class="customized-timeline">
                                        <template #opposite="slotProps">
                                            <small class="text-muted-color font-bold">{{ new Date(slotProps.data.dataHora).toLocaleDateString('pt-BR') }}</small>
                                        </template>
                                        <template #marker="slotProps">
                                            <span class="flex w-10 h-10 items-center justify-center text-white rounded-full z-10 shadow-sm"
                                                :class="slotProps.data.id === record.id ? 'bg-primary' : 'bg-surface-400 dark:bg-surface-600'">
                                                <i class="pi pi-calendar"></i>
                                            </span>
                                        </template>
                                        <template #content="slotProps">
                                            <div class="card cursor-pointer hover:shadow-lg transition-shadow" 
                                                :class="{'border-2 border-primary': slotProps.data.id === record.id}">
                                                <div class="flex flex-col">
                                                    <span class="font-bold text-lg mb-1">{{ slotProps.data.id === record.id ? 'Atendimento Atual' : 'Atendimento Anterior' }}</span>
                                                    <span class="text-sm text-muted-color italic mb-2">Profissional: {{ slotProps.data.profissionalNome }}</span>
                                                    <div class="flex gap-2">
                                                        <Tag :value="slotProps.data.diagnostico?.cid || 'SEM CID'" severity="secondary" />
                                                        <Tag :value="slotProps.data.diagnostico?.descricao || 'Sem diagnóstico'" severity="info" outlined />
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </Timeline>
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
.customized-timeline :deep(.p-timeline-event-opposite) {
    flex: 0;
    padding: 0 1rem;
    min-width: 100px;
}

@media screen and (max-width: 960px) {
    .customized-timeline :deep(.p-timeline-event-opposite) {
        display: none;
    }
}
</style>
