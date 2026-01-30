<script setup>
import { PatientService } from '@/service/PatientService';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const patient = ref(null);
const loading = ref(true);

onMounted(() => {
    const id = route.params.id;
    PatientService.getPatients().then((data) => {
        patient.value = data.find(p => p.id === id);
        loading.value = false;
    });
});

function goBack() {
    router.push('/pages/patients');
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function getStatusLabel(status) {
    switch (status) {
        case 'active': return 'success';
        case 'inactive': return 'danger';
        default: return null;
    }
}

function getStatusText(status) {
    switch (status) {
        case 'active': return 'Ativo';
        case 'inactive': return 'Inativo';
        default: return status;
    }
}
</script>

<template>
    <div class="card">
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
                <Button icon="pi pi-arrow-left" text rounded @click="goBack" />
                <h3 class="m-0">Detalhes do Paciente</h3>
            </div>
            <div v-if="patient">
                <Tag :value="getStatusText(patient.status)" :severity="getStatusLabel(patient.status)" />
            </div>
        </div>

        <div v-if="loading" class="flex justify-center p-8">
            <i class="pi pi-spin pi-spinner text-4xl"></i>
        </div>

        <div v-else-if="patient" class="grid grid-cols-12 gap-8">
            <!-- Coluna da Esquerda: Foto e Info Básica -->
            <div class="col-span-12 lg:col-span-4 flex flex-col items-center">
                <div class="w-48 h-60 border rounded-lg bg-surface-50 overflow-hidden flex items-center justify-center mb-4 shadow-sm">
                    <img v-if="patient.image" :src="patient.image" class="w-full h-full object-cover" />
                    <Avatar v-else :label="patient.name?.charAt(0)" class="w-full h-full text-6xl" :style="{ color: '#2a1261', backgroundColor: 'transparent' }" />
                </div>
                <h4 class="m-0 text-xl font-bold text-center">{{ patient.name }}</h4>
                <p class="text-muted-color mb-4">ID: {{ patient.id }}</p>
            </div>

            <!-- Coluna da Direita: Dados Detalhados -->
            <div class="col-span-12 lg:col-span-8">
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12">
                        <h5 class="border-b pb-2 mb-4 text-primary font-bold uppercase tracking-wider text-sm">Informações Pessoais</h5>
                    </div>
                    
                    <div class="col-span-12 md:col-span-6">
                        <label class="block text-sm text-muted-color mb-1">CPF</label>
                        <div class="text-lg font-medium">{{ patient.cpf }}</div>
                    </div>
                    
                    <div class="col-span-12 md:col-span-6">
                        <label class="block text-sm text-muted-color mb-1">Data de Nascimento</label>
                        <div class="text-lg font-medium">{{ formatDate(patient.dateOfBirth) }}</div>
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <label class="block text-sm text-muted-color mb-1">Telefone</label>
                        <div class="text-lg font-medium">{{ patient.phone || 'Não informado' }}</div>
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <label class="block text-sm text-muted-color mb-1">E-mail</label>
                        <div class="text-lg font-medium">{{ patient.email || 'Não informado' }}</div>
                    </div>

                    <div class="col-span-12 mt-4">
                        <h5 class="border-b pb-2 mb-4 text-primary font-bold uppercase tracking-wider text-sm">Endereço</h5>
                    </div>

                    <div class="col-span-12 md:col-span-4">
                        <label class="block text-sm text-muted-color mb-1">CEP</label>
                        <div class="text-lg font-medium">{{ patient.address?.zip || 'Não informado' }}</div>
                    </div>

                    <div class="col-span-12 md:col-span-8">
                        <label class="block text-sm text-muted-color mb-1">Rua / Logradouro</label>
                        <div class="text-lg font-medium">{{ patient.address?.street || 'Não informado' }}</div>
                    </div>

                    <div class="col-span-12 md:col-span-4">
                        <label class="block text-sm text-muted-color mb-1">Número</label>
                        <div class="text-lg font-medium">{{ patient.address?.number || '-' }}</div>
                    </div>

                    <div class="col-span-12 md:col-span-8">
                        <label class="block text-sm text-muted-color mb-1">Complemento</label>
                        <div class="text-lg font-medium">{{ patient.address?.complement || '-' }}</div>
                    </div>

                    <div class="col-span-12 md:col-span-8">
                        <label class="block text-sm text-muted-color mb-1">Cidade</label>
                        <div class="text-lg font-medium">{{ patient.address?.city || 'Não informado' }}</div>
                    </div>

                    <div class="col-span-12 md:col-span-4">
                        <label class="block text-sm text-muted-color mb-1">Estado (UF)</label>
                        <div class="text-lg font-medium">{{ patient.address?.state || '-' }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-center p-8">
            <p>Paciente não encontrado.</p>
            <Button label="Voltar" icon="pi pi-arrow-left" @click="goBack" />
        </div>
    </div>
</template>

<style scoped>
.text-muted-color {
    color: var(--text-color-secondary);
}
</style>
