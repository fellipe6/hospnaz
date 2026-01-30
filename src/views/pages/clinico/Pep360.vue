<script setup>
import { FarmaciaService } from '@/service/FarmaciaService';
import { PatientService } from '@/service/PatientService';
import { Pep360Service } from '@/service/Pep360Service';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const pep360Service = new Pep360Service();
const farmaciaService = new FarmaciaService();

const patient = ref(null);
const history = ref(null);
const estoque = ref([]);
const loading = ref(true);

onMounted(async () => {
    const id = route.params.id;
    patient.value = await PatientService.getPatientById(id);
    history.value = await pep360Service.getHistory360(id);
    estoque.value = await farmaciaService.getEstoque();
    loading.value = false;
});

const goBack = () => router.back();

const getSeverity = (color) => {
    switch (color) {
        case 'blue': return 'secondary';
        case 'orange': return 'warn';
        case 'red': return 'danger';
        case 'green': return 'success';
        default: return 'info';
    }
};

const getStockSeverity = (item) => {
    const med = estoque.value.find(m => m.nome === item);
    if (!med) return 'success';
    if (med.estoque <= med.estoqueMinimo) return 'danger';
    return 'success';
};
</script>

<template>
    <div v-if="loading" class="flex justify-center p-8">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
    </div>

    <div v-else class="flex flex-col gap-6">
        <!-- Sticky Header 360º -->
        <div class="card p-4 border-l-4 border-primary shadow-md sticky top-0 z-10 bg-surface-0 dark:bg-surface-900 mb-0">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div class="flex items-center gap-4">
                    <Button icon="pi pi-arrow-left" text rounded @click="goBack" />
                    <div class="relative">
                        <Avatar :image="patient.image" :label="patient.name?.charAt(0)" size="xlarge" shape="circle" class="border-2 border-primary" />
                        <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" v-tooltip="'Paciente Online/Internado'"></div>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h1 class="text-2xl font-bold m-0">{{ patient.name }}</h1>
                            <Tag value="Internado" severity="success" class="h-6" />
                        </div>
                        <p class="text-muted-color m-0 italic">
                            {{ patient.age || '45 anos' }} | {{ patient.gender || 'F' }} | CPF: {{ patient.cpf }} | Convênio: Unimed
                        </p>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2">
                    <Button label="Prescrever" icon="pi pi-file-edit" severity="secondary" size="small" @click="router.push(`/clinico/atendimento/${patient.id}`)" />
                    <Button label="Dispensação" icon="pi pi-box" severity="secondary" size="small" @click="router.push('/farmacia/prescricoes')" />
                    <Button label="Anexar" icon="pi pi-paperclip" severity="secondary" size="small" />
                    <Button label="Atendimento" icon="pi pi-user-md" @click="router.push(`/clinico/atendimento/${patient.id}`)" size="small" />
                </div>
            </div>
        </div>

        <!-- Clinical Indicators -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <template v-for="kpi in history.indicadores" :key="kpi.label">
                <div class="card p-4 flex items-center justify-between border-t-2" :style="{ borderColor: `var(--p-${kpi.color}-500)` }">
                    <div>
                        <span class="text-sm font-medium text-muted-color uppercase tracking-wider">{{ kpi.label }}</span>
                        <div class="text-3xl font-bold">{{ kpi.value }}</div>
                    </div>
                    <div class="flex items-center justify-center p-3 rounded-lg bg-surface-50 dark:bg-surface-800">
                        <i :class="[kpi.icon, `text-2xl text-${kpi.color}-500`]"></i>
                    </div>
                </div>
            </template>
        </div>

        <!-- Main Body Tabs -->
        <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12 lg:col-span-8">
                <div class="card p-0 overflow-hidden">
                    <Tabs value="0">
                        <TabList>
                            <Tab value="0"><i class="pi pi-clock mr-2"></i>Timeline Clínica</Tab>
                            <Tab value="1"><i class="pi pi-file-edit mr-2"></i>Prescrições & Farmácia</Tab>
                            <Tab value="2"><i class="pi pi-microchip mr-2"></i>Exames & Laudos</Tab>
                        </TabList>
                        <TabPanels>
                            <!-- Timeline Tab -->
                            <TabPanel value="0">
                                <div class="p-6">
                                    <Timeline :value="history.timeline">
                                        <template #marker="slotProps">
                                            <span class="flex w-10 h-10 items-center justify-center rounded-full z-10 shadow-sm" :class="`bg-${slotProps.item.color}-500 text-white`">
                                                <i :class="slotProps.item.icon"></i>
                                            </span>
                                        </template>
                                        <template #content="slotProps">
                                            <div class="mb-8 ml-2">
                                                <div class="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 class="text-lg font-bold m-0">{{ slotProps.item.titulo }}</h3>
                                                        <small class="text-muted-color font-medium">
                                                            {{ slotProps.item.data }} | <span class="text-primary">{{ slotProps.item.responsavel }}</span>
                                                        </small>
                                                    </div>
                                                    <Tag :value="slotProps.item.tipo" :severity="getSeverity(slotProps.item.color)" />
                                                </div>
                                                <p class="m-0 text-muted-color leading-relaxed border-l-2 border-surface-200 dark:border-surface-700 pl-4 py-2 italic font-serif text-lg bg-surface-50/50 dark:bg-surface-800/30 rounded">
                                                    "{{ slotProps.item.descricao }}"
                                                </p>
                                                <div class="flex gap-2 mt-3">
                                                    <Button label="Ver Evolução Completa" icon="pi pi-external-link" text size="small" />
                                                </div>
                                            </div>
                                        </template>
                                    </Timeline>
                                </div>
                            </TabPanel>

                            <!-- Pharmacy & Prescription Tab -->
                            <TabPanel value="1">
                                <div class="p-4">
                                    <div class="flex items-center gap-2 mb-4">
                                        <i class="pi pi-briefcase text-orange-500"></i>
                                        <h3 class="m-0 font-bold">Medicamentos Dispensados & Histórico Farmacológico</h3>
                                    </div>
                                    <DataTable :value="estoque" stripedRows class="p-datatable-sm">
                                        <Column field="nome" header="Medicamento" style="min-width: 15rem"></Column>
                                        <Column field="lote" header="Lote"></Column>
                                        <Column field="vencimento" header="Vencimento">
                                            <template #body="slotProps">
                                                {{ new Date(slotProps.data.vencimento).toLocaleDateString('pt-BR') }}
                                            </template>
                                        </Column>
                                        <Column header="Status Estoque">
                                            <template #body="slotProps">
                                                <Tag :value="slotProps.data.estoque > slotProps.data.estoqueMinimo ? 'Disponível' : 'Crítico'" :severity="slotProps.data.estoque > slotProps.data.estoqueMinimo ? 'success' : 'danger'" />
                                            </template>
                                        </Column>
                                        <Column header="Última Saída">
                                            <template #body>
                                                Há 2 horas
                                            </template>
                                        </Column>
                                    </DataTable>
                                </div>
                            </TabPanel>

                            <!-- Exams Tab -->
                            <TabPanel value="2">
                                <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div v-for="exame in history.exames" :key="exame.id" class="card mb-0 p-4 border border-dashed flex justify-between items-center hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer">
                                        <div>
                                            <div class="font-bold text-lg">{{ exame.tipo }}</div>
                                            <div class="text-sm text-muted-color">{{ exame.data }} | <span class="font-bold text-primary">{{ exame.resultado }}</span></div>
                                        </div>
                                        <Button icon="pi pi-file-pdf" rounded text severity="secondary" v-tooltip.top="'Ver Laudo'" />
                                    </div>
                                </div>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </div>

            <!-- Side Widgets -->
            <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <!-- Cognitive Summary -->
                <div class="card bg-surface-50 dark:bg-surface-800 border-l-4 border-blue-500">
                    <div class="flex items-center gap-2 mb-3">
                        <i class="pi pi-comment text-blue-500"></i>
                        <h3 class="font-bold m-0">Resumo Clínico Cognitivo</h3>
                    </div>
                    <p class="m-0 leading-relaxed italic text-muted-color">
                        "{{ history.resumoCognitivo }}"
                    </p>
                    <Divider />
                    <div class="flex items-center gap-2 text-xs font-bold text-muted-color uppercase">
                        <i class="pi pi-verified text-green-500"></i>
                        Validado em: {{ new Date().toLocaleDateString('pt-BR') }}
                    </div>
                </div>

                <!-- Documents List -->
                <div class="card">
                    <h3 class="font-bold mb-4 flex items-center gap-2">
                        <i class="pi pi-folder-open text-primary"></i>
                        Anexos & Documentos
                    </h3>
                    <ul class="list-none p-0 m-0">
                        <li v-for="doc in history.documentos" :key="doc.id" class="flex items-center justify-between p-3 border-b last:border-0 hover:bg-surface-50 dark:hover:bg-surface-800 rounded transition-colors group">
                            <div class="flex items-center gap-3">
                                <i class="pi pi-file-pdf text-red-500 text-xl"></i>
                                <div>
                                    <div class="font-bold text-sm">{{ doc.nome }}</div>
                                    <div class="text-xs text-muted-color">{{ doc.data }} | {{ doc.tamanho }}</div>
                                </div>
                            </div>
                            <Button icon="pi pi-download" text rounded severity="secondary" class="opacity-0 group-hover:opacity-100" />
                        </li>
                    </ul>
                </div>
                
                <!-- Clinical Reminders -->
                <div class="card bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200">
                    <div class="flex items-center gap-2 mb-2">
                        <i class="pi pi-bell text-yellow-600"></i>
                        <h4 class="m-0 font-bold text-yellow-700">Lembretes Clínicos</h4>
                    </div>
                    <ul class="list-none p-0 m-0 text-sm text-yellow-800 dark:text-yellow-400">
                        <li class="mb-2">• Verificar saturação a cada 4 horas.</li>
                        <li>• Manter dieta hipossódica.</li>
                    </ul>
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
