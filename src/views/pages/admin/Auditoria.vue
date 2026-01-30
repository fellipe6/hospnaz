<script setup>
import { AuditService } from '@/service/AuditService';
import { onMounted, ref } from 'vue';

const auditService = new AuditService();
const logs = ref([]);
const loading = ref(true);

onMounted(async () => {
    logs.value = await auditService.getLogs();
    loading.value = false;
});

const getActionSeverity = (action) => {
    switch (action) {
        case 'CRIOU': return 'success';
        case 'EDITOU': return 'warn';
        case 'FINALIZOU': return 'danger';
        case 'EXCLUIU': return 'danger';
        default: return 'info';
    }
};

const getEntityIcon = (entity) => {
    switch (entity) {
        case 'PEP': return 'pi pi-book';
        case 'PACIENTE': return 'pi pi-user';
        case 'FINANCEIRO': return 'pi pi-dollar';
        case 'ESTOQUE': return 'pi pi-box';
        default: return 'pi pi-info-circle';
    }
};
</script>

<template>
    <div class="card">
        <h1 class="text-2xl font-bold mb-6">Trilha de Auditoria e Rastreabilidade</h1>
        
        <div v-if="loading" class="flex justify-center p-8">
            <i class="pi pi-spin pi-spinner text-4xl"></i>
        </div>

        <Timeline v-else :value="logs" align="left" class="customized-timeline">
            <template #marker="slotProps">
                <span class="flex w-10 h-10 items-center justify-center text-white rounded-full z-10 shadow-sm"
                    :class="getActionSeverity(slotProps.data.acao) === 'success' ? 'bg-green-500' : 
                            getActionSeverity(slotProps.data.acao) === 'warn' ? 'bg-orange-500' : 'bg-red-500'">
                    <i :class="getEntityIcon(slotProps.data.entidade)"></i>
                </span>
            </template>
            <template #content="slotProps">
                <div class="card mb-4 p-4 ml-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold text-lg">{{ slotProps.data.acao }} {{ slotProps.data.entidade }}</span>
                        <small class="text-muted-color">{{ new Date(slotProps.data.dataHora).toLocaleString('pt-BR') }}</small>
                    </div>
                    <div class="flex items-center gap-2 mb-3">
                        <Avatar icon="pi pi-user" shape="circle" size="small" />
                        <span class="font-medium">{{ slotProps.data.usuarioNome }}</span>
                        <Tag :value="'ID: #' + slotProps.data.usuarioId" severity="secondary" outlined />
                    </div>
                    <p class="m-0 text-surface-700 dark:text-surface-100 italic border-l-4 border-surface-300 pl-3">
                        "{{ slotProps.data.detalhes }}"
                    </p>
                </div>
            </template>
        </Timeline>
    </div>
</template>

<style scoped>
.customized-timeline :deep(.p-timeline-event-opposite) {
    flex: 0;
    padding: 0;
}
</style>
