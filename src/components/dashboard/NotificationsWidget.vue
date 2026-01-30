<script setup>
import { ref } from 'vue';

const menu = ref(null);

const items = ref([
    { label: 'Limpar Tudo', icon: 'pi pi-fw pi-trash' }
]);
</script>

<template>
    <div class="card">
        <div class="flex items-center justify-between mb-6">
            <div class="font-semibold text-xl">Notificações e Alertas</div>
            <div>
                <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu.toggle($event)"></Button>
                <Menu ref="menu" popup :model="items" class="min-w-40!"></Menu>
            </div>
        </div>

        <span class="block text-muted-color font-medium mb-4">HOJE</span>
        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-exclamation-triangle text-xl! text-orange-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >Estoque Crítico:
                    <span class="text-surface-700 dark:text-surface-100">O produto <span class="text-primary font-bold">Seringa 5ml</span> atingiu o nível crítico.</span>
                </span>
            </li>
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-calendar text-xl! text-blue-500"></i>
                </div>
                <span class="text-surface-700 dark:text-surface-100 leading-normal">Você tem <span class="text-primary font-bold">12 agendamentos</span> para o período da tarde.</span>
            </li>
        </ul>

        <span class="block text-muted-color font-medium mb-4">ONTEM</span>
        <ul class="p-0 m-0 list-none mb-6">
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-check-circle text-xl! text-green-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >Relatório Mensal:
                    <span class="text-surface-700 dark:text-surface-100">O fechamento financeiro de Janeiro foi <span class="text-primary font-bold">concluído</span>.</span>
                </span>
            </li>
        </ul>
        <span class="block text-muted-color font-medium mb-4">ESTOQUE</span>
        <ul class="p-0 m-0 list-none">
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-truck text-xl! text-purple-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal">Nova entrada de <span class="text-primary font-bold">Equipamentos Brasil</span> processada com sucesso.</span>
            </li>
        </ul>
    </div>
</template>
