<script setup>
import { AppointmentService } from '@/service/AppointmentService';
import { DoctorService } from '@/service/DoctorService';
import { PatientService } from '@/service/PatientService';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref, watch } from 'vue';

const toast = useToast();

// Estados
const date = ref(new Date());
const doctors = ref([]);
const selectedDoctor = ref(null);
const timeSlots = ref([]);
const displayConfirmation = ref(false);
const patients = ref([]);
const filteredPatients = ref([]);
const selectedPatient = ref(null);
const loadingDoctors = ref(false);
const existingAppointments = ref([]);

// Setup Inicial
onMounted(() => {
    loadDoctors();
    loadPatients();
});

// Watch para recarregar médicos quando a data mudar
watch(date, () => {
    selectedDoctor.value = null;
    timeSlots.value = [];
    loadDoctors();
});

// Watch para gerar slots quando um médico for selecionado
watch(selectedDoctor, () => {
    if (selectedDoctor.value) {
        generateTimeSlots();
    }
});

// Carregar Dados
async function loadDoctors() {
    loadingDoctors.value = true;
    try {
        doctors.value = await DoctorService.getDoctorsByDate(date.value);
    } finally {
        loadingDoctors.value = false;
    }
}

async function loadPatients() {
    patients.value = await PatientService.getPatientsData();
}

const currentDateStr = computed(() => {
    const offset = date.value.getTimezoneOffset();
    const d = new Date(date.value.getTime() - (offset*60*1000));
    return d.toISOString().split('T')[0];
});

async function generateTimeSlots() {
    if (!selectedDoctor.value) return;

    // Buscar agendamentos existentes para esse dia e médico
    const apps = await AppointmentService.getAppointmentsByDateAndDoctor(currentDateStr.value, selectedDoctor.value.id);
    existingAppointments.value = apps;

    const slots = [];
    const start = selectedDoctor.value.startHour;
    const end = selectedDoctor.value.endHour;
    
    // Intervalo de 30 minutos
    for (let hour = start; hour < end; hour++) {
        for (let min = 0; min < 60; min += 30) {
            const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            
            // Verificar se está agendado
            const isTaken = apps.some(a => a.time === timeStr);
            const appointment = apps.find(a => a.time === timeStr);

            slots.push({
                time: timeStr,
                available: !isTaken,
                appointment: appointment
            });
        }
    }
    timeSlots.value = slots;
}

// Interações
const selectedSlot = ref(null);

function selectSlot(slot) {
    if (!slot.available) {
        toast.add({ severity: 'info', summary: 'Horário Indisponível', detail: `Agendado para: ${slot.appointment.patientName}`, life: 3000 });
        return;
    }
    selectedSlot.value = slot;
    selectedPatient.value = null;
    displayConfirmation.value = true;
}

function searchPatient(event) {
    if (!event.query.trim().length) {
        filteredPatients.value = [...patients.value];
    } else {
        filteredPatients.value = patients.value.filter((patient) => {
            return patient.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
    }
}

async function confirmAppointment() {
    if (!selectedPatient.value) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Selecione um paciente', life: 3000 });
        return;
    }

    try {
        const newApp = {
            doctorId: selectedDoctor.value.id,
            patientId: selectedPatient.value.id,
            patientName: selectedPatient.value.name,
            date: currentDateStr.value,
            time: selectedSlot.value.time
        };

        await AppointmentService.addAppointment(newApp);
        
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Agendamento realizado!', life: 3000 });
        displayConfirmation.value = false;
        generateTimeSlots(); // Recarrega os slots
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao agendar', life: 3000 });
    }
}

function formatDate(date) {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <!-- Coluna Esquerda: Calendário e Lista de Médicos -->
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div class="card flex flex-col gap-4">
                <h5 class="m-0">Selecione a Data</h5>
                <DatePicker v-model="date" inline class="w-full" :minDate="new Date()" />
            </div>

            <div class="card">
                <h5 class="mb-4">Médicos Disponíveis</h5>
                <div v-if="loadingDoctors" class="flex justify-center p-4">
                    <i class="pi pi-spin pi-spinner text-4xl"></i>
                </div>
                <div v-else-if="doctors.length === 0" class="text-center p-4 text-gray-500">
                    Nenhum médico atende nesta data.
                </div>
                <div v-else class="flex flex-col gap-3">
                    <div 
                        v-for="doc in doctors" 
                        :key="doc.id"
                        class="p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md flex items-center gap-4"
                        :class="{ 'bg-primary-50 border-primary-500': selectedDoctor?.id === doc.id, 'border-surface-200 bg-surface-0': selectedDoctor?.id !== doc.id }"
                        @click="selectedDoctor = doc"
                    >
                        <Avatar :image="'/demo/images/avatar/' + (doc.image || 'onyamalimba.png')" size="large" shape="circle" />
                        <div class="flex-1">
                            <h6 class="m-0 font-bold text-gray-800">{{ doc.name }}</h6>
                            <span class="text-sm text-gray-600 block">{{ doc.specialty }}</span>
                            <div class="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                <i class="pi pi-clock"></i>
                                <span>{{ doc.startHour }}h - {{ doc.endHour }}h</span>
                            </div>
                        </div>
                        <i v-if="selectedDoctor?.id === doc.id" class="pi pi-check-circle text-primary-500 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Coluna Direita: Agenda do Médico Selecionado -->
        <div class="col-span-12 lg:col-span-8">
            <div class="card h-full">
                <div v-if="!selectedDoctor" class="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                    <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <i class="pi pi-user-plus text-4xl"></i>
                    </div>
                    <h3 class="font-light">Selecione um médico ao lado</h3>
                    <p>Escolha um profissional para visualizar a agenda de {{ formatDate(date) }}</p>
                </div>

                <div v-else>
                    <div class="flex items-center justify-between mb-6 border-b pb-4">
                        <div>
                            <h4 class="m-0 font-bold">Agenda: <span class="text-primary">{{ selectedDoctor.name }}</span></h4>
                            <p class="text-gray-500 mt-1">{{ doc?.specialty }} • {{ formatDate(date) }}</p>
                        </div>
                        <Tag severity="info" :value="`${timeSlots.filter(s => s.available).length} horários livres`"></Tag>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        <button 
                            v-for="slot in timeSlots" 
                            :key="slot.time"
                            @click="selectSlot(slot)"
                            class="p-3 rounded-lg border text-center transition-all duration-200 flex flex-col gap-1 items-center justify-center relative overflow-hidden group"
                            :class="[
                                slot.available 
                                    ? 'bg-white hover:border-primary-500 hover:text-primary-500 hover:shadow-md cursor-pointer border-surface-200' 
                                    : 'bg-red-50 border-red-100 text-red-400 opacity-80 cursor-not-allowed'
                            ]"
                        >
                            <span class="text-lg font-bold">{{ slot.time }}</span>
                            <span class="text-xs" v-if="slot.available">Livre</span>
                            <span class="text-xs font-semibold truncate w-full px-1" v-else>Ocupado</span>
                            
                            <!-- Tooltip fake para ocupado -->
                            <div v-if="!slot.available" class="hidden group-hover:flex absolute inset-0 bg-red-100 items-center justify-center text-xs text-red-700 font-bold p-1 text-center">
                                {{ slot.appointment.patientName.split(' ')[0] }}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dialog de Confirmação -->
        <Dialog v-model:visible="displayConfirmation" header="Confirmar Agendamento" :modal="true" :style="{ width: '450px' }">
            <div class="flex flex-col gap-4">
                <div class="flex items-center gap-3 p-3 bg-surface-50 rounded border border-surface-100">
                    <i class="pi pi-calendar text-primary text-2xl"></i>
                    <div>
                        <span class="block font-bold">{{ formatDate(date) }}</span>
                        <span class="text-primary font-bold text-xl">{{ selectedSlot?.time }}</span>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <label class="font-bold">Médico</label>
                    <InputText :value="selectedDoctor?.name" disabled fluid />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="font-bold">Paciente</label>
                    <AutoComplete 
                        v-model="selectedPatient" 
                        :suggestions="filteredPatients" 
                        optionLabel="name" 
                        placeholder="Busque o paciente..." 
                        @complete="searchPatient"
                        dropdown
                        forceSelection
                        fluid
                    >
                        <template #option="slotProps">
                            <div class="flex flex-col">
                                <span class="font-bold">{{ slotProps.option.name }}</span>
                                <span class="text-sm text-gray-500">CPF: {{ slotProps.option.cpf }}</span>
                            </div>
                        </template>
                    </AutoComplete>
                    <small v-if="!selectedPatient" class="text-gray-400">Digite para buscar</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="displayConfirmation = false" />
                <Button label="Agendar" icon="pi pi-check" @click="confirmAppointment" :disabled="!selectedPatient" />
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
/* Estilos extra se necessário */
</style>
