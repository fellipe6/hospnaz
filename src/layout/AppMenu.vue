<script setup>
import { AuthService } from '@/service/AuthService';
import { ROLE_ADMIN, ROLE_DOCTOR } from '@/service/mock/usuarios.mock';
import { computed, ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const authService = new AuthService();
const userRole = authService.getUserRole();

const fullModel = ref([
    {
        label: 'Home',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                to: '/',
                roles: [ROLE_ADMIN, ROLE_DOCTOR]
            }
        ]
    },
    {
        label: 'Gestão Hospitalar',
        items: [
            {
                label: 'Pacientes',
                icon: 'pi pi-fw pi-user-plus',
                to: '/pages/patients',
                roles: [ROLE_ADMIN, ROLE_DOCTOR]
            },
            {
                label: 'Empresas',
                icon: 'pi pi-fw pi-building',
                to: '/pages/companies',
                roles: [ROLE_ADMIN]
            },
            {
                label: 'Agendamento',
                icon: 'pi pi-fw pi-calendar',
                to: '/pages/scheduling',
                roles: [ROLE_ADMIN, ROLE_DOCTOR]
            },
            {
                label: 'PEP (Prontuário)',
                icon: 'pi pi-fw pi-copy',
                to: '/pep',
                roles: [ROLE_ADMIN, ROLE_DOCTOR]
            }
        ]
    },
    {
        label: 'Almoxarifado',
        roles: [ROLE_ADMIN],
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-chart-bar', to: '/pages/almoxarifado/dashboard', roles: [ROLE_ADMIN] },
            { label: 'Produtos', icon: 'pi pi-fw pi-box', to: '/pages/almoxarifado/produtos', roles: [ROLE_ADMIN] },
            { label: 'Movimentações', icon: 'pi pi-fw pi-sort-alt', to: '/pages/almoxarifado/movimentacoes', roles: [ROLE_ADMIN] },
            { label: 'Fornecedores', icon: 'pi pi-fw pi-truck', to: '/pages/almoxarifado/fornecedores', roles: [ROLE_ADMIN] },
            { label: 'Estoque Crítico', icon: 'pi pi-fw pi-exclamation-circle', to: '/pages/almoxarifado/estoque-minimo', roles: [ROLE_ADMIN] }
        ]
    }
]);

const model = computed(() => {
    return fullModel.value
        .filter((node) => !node.roles || node.roles.includes(userRole))
        .map((node) => {
            if (node.items) {
                return {
                    ...node,
                    items: node.items.filter((item) => !item.roles || item.roles.includes(userRole))
                };
            }
            return node;
        })
        .filter((node) => !node.items || node.items.length > 0);
});
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
