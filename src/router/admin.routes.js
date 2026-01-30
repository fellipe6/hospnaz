export default [
    {
        path: '/admin/usuarios',
        name: 'admin-users',
        component: () => import('@/views/pages/admin/UsuariosList.vue'),
        meta: {
            breadcrumb: ['Administração', 'Gestão de Usuários']
        }
    },
    {
        path: '/admin/auditoria',
        name: 'admin-audit',
        component: () => import('@/views/pages/admin/Auditoria.vue'),
        meta: {
            breadcrumb: ['Administração', 'Auditoria']
        }
    },
    {
        path: '/admin/indicadores',
        name: 'admin-indicators',
        component: () => import('@/views/pages/admin/Indicadores.vue'),
        meta: {
            breadcrumb: ['Administração', 'Indicadores']
        }
    }
];
