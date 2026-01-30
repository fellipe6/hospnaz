<script setup>
defineProps({
    activities: Array
});

const getStatusSeverity = (status) => {
    switch (status) {
        case 'Completo': return 'success';
        case 'Finalizado': return 'success';
        case 'Em aberto': return 'info';
        case 'Pendente Assinatura': return 'warn';
        default: return 'secondary';
    }
};

const getTipoIcon = (tipo) => {
    switch (tipo) {
        case 'PEP': return 'pi pi-book text-blue-500';
        case 'Documento': return 'pi pi-file-pdf text-orange-500';
        case 'Altas': return 'pi pi-sign-out text-green-500';
        default: return 'pi pi-info-circle text-gray-500';
    }
};
</script>

<template>
    <div class="card">
        <div class="flex items-center justify-between mb-4">
            <div class="font-bold text-xl">Atividade Recente do PEP</div>
            <Button icon="pi pi-ellipsis-v" rounded text severity="secondary" />
        </div>
        <ul class="list-none p-0 m-0">
            <li v-for="act in activities" :key="act.id" class="flex items-center p-4 border-b last:border-0 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-700 mr-4">
                    <i :class="getTipoIcon(act.tipo)"></i>
                </div>
                <div class="flex-grow">
                    <div class="flex justify-between items-center mb-1">
                        <span class="font-bold text-surface-900 dark:text-surface-0">{{ act.paciente }}</span>
                        <small class="text-muted-color font-medium">{{ act.data }}</small>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-muted-color text-sm">{{ act.acao }}</span>
                        <Tag :value="act.status" :severity="getStatusSeverity(act.status)" size="small" />
                    </div>
                </div>
            </li>
        </ul>
        <div class="mt-4">
            <Button label="Ver Tudo" text class="w-full" icon="pi pi-arrow-right" iconPos="right" />
        </div>
    </div>
</template>
