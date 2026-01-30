<script setup>
import { AppointmentService } from '@/service/AppointmentService';
import { FinanceService } from '@/service/FinanceService';
import { PatientService } from '@/service/PatientService';
import { onMounted, ref } from 'vue';

const stats = ref({
    patients: 0,
    appointments: 0,
    expenses: 0,
    pendingBills: 0
});

onMounted(async () => {
    const patients = await PatientService.getPatients();
    const appointments = await AppointmentService.getAppointments();
    const finance = await FinanceService.getDashboardStats();

    stats.value = {
        patients: patients.length,
        appointments: appointments.length,
        expenses: finance.totalDespesas,
        pendingBills: finance.contasPendentes
    };
});

const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
</script>

<template>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Pacientes</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats.patients }}</div>
                </div>
                <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-users text-blue-500 text-xl!"></i>
                </div>
            </div>
            <span class="text-primary font-medium">8 novos </span>
            <span class="text-muted-color">este mês</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Agenda / Dia</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats.appointments }}</div>
                </div>
                <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-calendar text-orange-500 text-xl!"></i>
                </div>
            </div>
            <span class="text-primary font-medium">12 </span>
            <span class="text-muted-color">para hoje</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Despesas Mensais</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ formatCurrency(stats.expenses) }}</div>
                </div>
                <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-dollar text-cyan-500 text-xl!"></i>
                </div>
            </div>
            <span class="text-primary font-medium">{{ stats.pendingBills }} </span>
            <span class="text-muted-color">contas pendentes</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Atendimentos PEP</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">24 Ativos</div>
                </div>
                <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-copy text-purple-500 text-xl!"></i>
                </div>
            </div>
            <span class="text-primary font-medium">95% </span>
            <span class="text-muted-color">concluídos</span>
        </div>
    </div>
</template>
