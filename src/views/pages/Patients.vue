<script setup>
import { PatientService } from '@/service/PatientService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

onMounted(() => {
    PatientService.getPatients().then((data) => (patients.value = data));
});

const toast = useToast();
const router = useRouter();
const dt = ref();
const patients = ref();
const patientDialog = ref(false);
const deletePatientDialog = ref(false);
const deletePatientsDialog = ref(false);
const patient = ref({});
const selectedPatients = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const isViewMode = ref(false);
const statuses = ref([
    { label: 'Ativo', value: 'active' },
    { label: 'Inativo', value: 'inactive' }
]);

const brazilianStates = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

function openNew() {
    patient.value = {
        address: {}
    };
    submitted.value = false;
    isViewMode.value = false;
    patientDialog.value = true;
}

function hideDialog() {
    patientDialog.value = false;
    submitted.value = false;
}

function savePatient() {
    submitted.value = true;

    if (patient?.value.name?.trim() && patient?.value.cpf?.trim() && patient?.value.dateOfBirth) {
        if (patient.value.id) {
            patient.value.status = patient.value.status.value ? patient.value.status.value : patient.value.status;
            patients.value[findIndexById(patient.value.id)] = patient.value;
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Paciente Atualizado', life: 3000 });
        } else {
            patient.value.id = createId();
            patient.value.status = patient.value.status ? patient.value.status.value : 'active';
            patients.value.push(patient.value);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Paciente Cadastrado', life: 3000 });
        }

        patientDialog.value = false;
        patient.value = {};
    }
}

function viewPatient(pat) {
    router.push(`/pages/patients/${pat.id}`);
}

function editPatient(pat) {
    patient.value = { ...pat };
    
    // Converte string de data para objeto Date para o DatePicker
    if (patient.value.dateOfBirth) {
        patient.value.dateOfBirth = new Date(patient.value.dateOfBirth);
    }
    
    // Mapeia o status de string para o objeto esperado pelo Select (ou usa optionValue no template)
    if (patient.value.status && typeof patient.value.status === 'string') {
        patient.value.status = statuses.value.find(s => s.value === patient.value.status) || patient.value.status;
    }

    isViewMode.value = false;
    patientDialog.value = true;
}

function confirmDeletePatient(pat) {
    patient.value = pat;
    deletePatientDialog.value = true;
}

function deletePatient() {
    patients.value = patients.value.filter((val) => val.id !== patient.value.id);
    deletePatientDialog.value = false;
    patient.value = {};
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Paciente Excluído', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < patients.value.length; i++) {
        if (patients.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

function createId() {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function exportCSV() {
    dt.value.exportCSV();
}

function confirmDeleteSelected() {
    deletePatientsDialog.value = true;
}

function deleteSelectedPatients() {
    patients.value = patients.value.filter((val) => !selectedPatients.value.includes(val));
    deletePatientsDialog.value = false;
    selectedPatients.value = null;
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Pacientes Excluídos', life: 3000 });
}

function getStatusLabel(status) {
    switch (status) {
        case 'active':
            return 'success';
        case 'inactive':
            return 'danger';
        default:
            return null;
    }
}

function getStatusText(status) {
    switch (status) {
        case 'active':
            return 'Ativo';
        case 'inactive':
            return 'Inativo';
        default:
            return status;
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function applyCpfMask(value) {
    if (!value) return '';
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return value;
}

function applyPhoneMask(value) {
    if (!value) return '';
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    return value;
}

function applyZipMask(value) {
    if (!value) return '';
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    return value;
}

async function fetchAddressByCep() {
    const cep = patient.value.address?.zip?.replace(/\D/g, '');

    if (!cep || cep.length !== 8) {
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            toast.add({
                severity: 'warn',
                summary: 'CEP não encontrado',
                detail: 'O CEP informado não foi encontrado.',
                life: 3000
            });
            return;
        }

        // Preenche os campos de endereço
        patient.value.address = {
            ...patient.value.address,
            street: data.logradouro || '',
            city: data.localidade || '',
            state: data.uf || '',
            zip: patient.value.address.zip // Mantém o CEP formatado
        };

        toast.add({
            severity: 'success',
            summary: 'Endereço encontrado',
            detail: 'Dados do endereço preenchidos automaticamente.',
            life: 3000
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível buscar o endereço. Tente novamente.',
            life: 3000
        });
    }
}
// Câmera Logic
const cameraDialog = ref(false);
const videoRef = ref(null);
const canvasRef = ref(null);
const stream = ref(null);

function openCamera() {
    console.log("Botão clicado! Abrindo dialog...");
    cameraDialog.value = true;
    // O startCamera será chamado pelo @show do Dialog ou watch
}

async function startCamera() {
    console.log("Iniciando câmera...");
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("API de mídia não suportada neste navegador/contexto (use HTTPS ou localhost).");
        }

        console.log("Solicitando permissão...");
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log("Permissão concedida. Stream:", mediaStream);
        
        stream.value = mediaStream;
        
        nextTick(() => {
            const videoEl = videoRef.value || document.querySelector('video'); // Fallback
            console.log("Tentando vincular stream ao vídeo. Elemento:", videoEl);
            
            if (videoEl) {
                videoEl.srcObject = mediaStream;
                videoEl.play().catch(e => {
                    console.error("Erro no play:", e);
                    toast.add({ severity: 'error', summary: 'Erro no Vídeo', detail: 'Falha ao reproduzir: ' + e.message, life: 5000 });
                });
            } else {
                console.error("Elemento de vídeo não encontrado no DOM!");
                toast.add({ severity: 'error', summary: 'Erro de Interface', detail: 'Elemento de vídeo não encontrado.', life: 5000 });
            }
        });

    } catch (err) {
        console.error("ERRO CÂMERA DETALHADO:", err);
        // Mostra a mensagem real do erro para debug
        toast.add({ 
            severity: 'error', 
            summary: 'Erro de Câmera (' + err.name + ')', 
            detail: err.message || 'Erro desconhecido', 
            life: 8000 
        });
    }
}

function stopCamera() {
    if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop());
        stream.value = null;
    }
}

function takePhoto() {
    if (videoRef.value && canvasRef.value) {
        const video = videoRef.value;
        const canvas = canvasRef.value;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const photoData = canvas.toDataURL('image/png');
        patient.value.image = photoData;
        
        stopCamera();
        cameraDialog.value = false;
        
        toast.add({ severity: 'success', summary: 'Foto capturada', detail: 'Imagem salva!', life: 3000 });
    }
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Novo Paciente" icon="pi pi-plus" severity="secondary" @click="openNew" />
                </template>

                <template #end>
                    <Button label="Exportar" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedPatients"
                :value="patients"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} pacientes"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Gerenciar Pacientes</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column header="Ações" :exportable="false" style="min-width: 14rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-play" class="mr-2" severity="primary" @click="router.push(`/clinico/atendimento/${slotProps.data.id}`)" v-tooltip.top="'Iniciar Atendimento'" />
                        <Button icon="pi pi-shield" outlined class="mr-2" severity="warn" @click="router.push(`/clinico/pep360/${slotProps.data.id}`)" v-tooltip.top="'PEP 360º (Visão Integrada)'" />
                        <Button icon="pi pi-clock" outlined class="mr-2" severity="info" @click="router.push(`/clinico/historico/${slotProps.data.id}`)" v-tooltip.top="'Histórico Longitudinal'" />
                        <Button icon="pi pi-eye" outlined rounded class="mr-2" @click="viewPatient(slotProps.data)" v-tooltip.top="'Ficha Cadastral'" />
                        <Button icon="pi pi-pencil" outlined rounded severity="success" @click="editPatient(slotProps.data)" v-tooltip.top="'Editar'" />
                    </template>
                </Column>
                <Column field="name" header="Nome" sortable style="min-width: 16rem"></Column>
                <Column field="cpf" header="CPF" sortable style="min-width: 12rem"></Column>
                <Column field="dateOfBirth" header="Data de Nascimento" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.dateOfBirth) }}
                    </template>
                </Column>
                <Column field="phone" header="Telefone" sortable style="min-width: 12rem"></Column>
                <Column field="email" header="Email" sortable style="min-width: 14rem"></Column>
                <Column field="status" header="Status" sortable style="min-width: 10rem">
                    <template #body="slotProps">
                        <Tag :value="getStatusText(slotProps.data.status)" :severity="getStatusLabel(slotProps.data.status)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="patientDialog" :style="{ width: '650px' }" :header="isViewMode ? 'Visualizar Paciente' : 'Manutenção de Paciente'" :modal="true">
            <div class="flex flex-col gap-6">
                <!-- Foto do Paciente -->
                <div class="flex flex-col items-center gap-4 mb-4">
                    <div class="relative w-40 h-52 border rounded-lg bg-surface-50 overflow-hidden flex items-center justify-center">
                        <img 
                            v-if="patient.image" 
                            :src="patient.image" 
                            class="w-full h-full object-cover" 
                            alt="Foto do Paciente"
                        />
                        <Avatar 
                            v-else
                            :label="patient.name?.charAt(0) || 'P'" 
                            class="w-full h-full text-5xl bg-transparent" 
                            shape="square" 
                            :style="{ color: '#2a1261' }"
                        />
                        <Button 
                            icon="pi pi-camera" 
                            rounded 
                            severity="secondary" 
                            class="absolute -bottom-3 -right-3 w-10 h-10 shadow-md z-10" 
                            @click="openCamera"
                            v-tooltip="'Tirar Foto'"
                            v-if="!isViewMode"
                        />
                    </div>
                </div>

                <div>
                    <label for="name" class="block font-bold mb-3">Nome Completo *</label>
                    <InputText id="name" v-model.trim="patient.name" required="true" autofocus :invalid="submitted && !patient.name" :disabled="isViewMode" fluid />
                    <small v-if="submitted && !patient.name" class="text-red-500">Nome é obrigatório.</small>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="cpf" class="block font-bold mb-3">CPF *</label>
                        <InputText id="cpf" v-model="patient.cpf" @input="patient.cpf = applyCpfMask($event.target.value)" required="true" :invalid="submitted && !patient.cpf" placeholder="000.000.000-00" :disabled="isViewMode" fluid />
                        <small v-if="submitted && !patient.cpf" class="text-red-500">CPF é obrigatório.</small>
                    </div>
                    <div class="col-span-6">
                        <label for="dateOfBirth" class="block font-bold mb-3">Data de Nascimento *</label>
                        <DatePicker id="dateOfBirth" v-model="patient.dateOfBirth" dateFormat="dd/mm/yy" :invalid="submitted && !patient.dateOfBirth" :disabled="isViewMode" fluid />
                        <small v-if="submitted && !patient.dateOfBirth" class="text-red-500">Data de nascimento é obrigatória.</small>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="phone" class="block font-bold mb-3">Telefone</label>
                        <InputText id="phone" v-model="patient.phone" @input="patient.phone = applyPhoneMask($event.target.value)" placeholder="(00) 00000-0000" :disabled="isViewMode" fluid />
                    </div>
                    <div class="col-span-6">
                        <label for="email" class="block font-bold mb-3">Email</label>
                        <InputText id="email" v-model="patient.email" type="email" :disabled="isViewMode" fluid />
                    </div>
                </div>

                <div>
                    <label for="status" class="block font-bold mb-3">Status</label>
                    <Select id="status" v-model="patient.status" :options="statuses" optionLabel="label" optionValue="value" placeholder="Selecione um Status" :disabled="isViewMode" fluid></Select>
                </div>

                <div class="border-t pt-4">
                    <h5 class="mb-4">Endereço</h5>

                    <div class="mb-4">
                        <label for="zip" class="block font-bold mb-3">CEP</label>
                        <InputText id="zip" v-model="patient.address.zip" @input="patient.address.zip = applyZipMask($event.target.value)" @blur="fetchAddressByCep" placeholder="00000-000" :disabled="isViewMode" fluid />
                    </div>

                    <div class="grid grid-cols-12 gap-4 mb-4">
                        <div class="col-span-8">
                            <label for="street" class="block font-bold mb-3">Rua</label>
                            <InputText id="street" v-model="patient.address.street" :disabled="isViewMode" fluid />
                        </div>
                        <div class="col-span-4">
                            <label for="number" class="block font-bold mb-3">Número</label>
                            <InputText id="number" v-model="patient.address.number" :disabled="isViewMode" fluid />
                        </div>
                    </div>

                    <div class="mb-4">
                        <label for="complement" class="block font-bold mb-3">Complemento</label>
                        <InputText id="complement" v-model="patient.address.complement" :disabled="isViewMode" fluid />
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-8">
                            <label for="city" class="block font-bold mb-3">Cidade</label>
                            <InputText id="city" v-model="patient.address.city" :disabled="isViewMode" fluid />
                        </div>
                        <div class="col-span-4">
                            <label for="state" class="block font-bold mb-3">Estado</label>
                            <Select id="state" v-model="patient.address.state" :options="brazilianStates" placeholder="UF" :disabled="isViewMode" fluid></Select>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button :label="isViewMode ? 'Fechar' : 'Cancelar'" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Salvar" icon="pi pi-check" @click="savePatient" v-if="!isViewMode" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deletePatientDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle text-3xl!" />
                <span v-if="patient"
                    >Tem certeza que deseja excluir <b>{{ patient.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" text @click="deletePatientDialog = false" />
                <Button label="Sim" icon="pi pi-check" @click="deletePatient" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deletePatientsDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle text-3xl!" />
                <span v-if="patient">Tem certeza que deseja excluir os pacientes selecionados?</span>
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" text @click="deletePatientsDialog = false" />
                <Button label="Sim" icon="pi pi-check" text @click="deleteSelectedPatients" />
            </template>
        </Dialog>

        <!-- Dialog da Câmera -->
        <Dialog v-model:visible="cameraDialog" header="Tirar Foto" :modal="true" :style="{ width: '500px' }" @show="startCamera" @hide="stopCamera">
            <div class="flex flex-col items-center gap-4">
                <div class="relative w-full aspect-video bg-black rounded overflow-hidden">
                    <video ref="videoRef" autoplay playsinline class="w-full h-full object-cover"></video>
                </div>
                <canvas ref="canvasRef" class="hidden"></canvas>
            </div>
            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="cameraDialog = false" />
                <Button label="Capturar" icon="pi pi-camera" @click="takePhoto" severity="success" />
            </template>
        </Dialog>
    </div>
</template>
