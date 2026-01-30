export default [
    {
        path: '/farmacia/dashboard',
        name: 'farmacia-dashboard',
        component: () => import('@/views/pages/farmacia/FarmaciaDashboard.vue'),
        meta: {
            breadcrumb: ['Farmácia', 'Dashboard']
        }
    },
    {
        path: '/farmacia/prescricoes',
        name: 'farmacia-prescricoes',
        component: () => import('@/views/pages/farmacia/PrescricoesPendentes.vue'),
        meta: {
            breadcrumb: ['Farmácia', 'Prescrições Pendentes']
        }
    },
    {
        path: '/farmacia/dispensacao/:id',
        name: 'farmacia-dispensacao',
        component: () => import('@/views/pages/farmacia/Dispensacao.vue'),
        meta: {
            breadcrumb: ['Farmácia', 'Dispensação']
        }
    },
    {
        path: '/farmacia/estoque',
        name: 'farmacia-estoque',
        component: () => import('@/views/pages/farmacia/EstoqueFarmacia.vue'),
        meta: {
            breadcrumb: ['Farmácia', 'Estoque']
        }
    },
    {
        path: '/farmacia/movimentacoes',
        name: 'farmacia-movimentacoes',
        component: () => import('@/views/pages/farmacia/MovimentacoesFarmacia.vue'),
        meta: {
            breadcrumb: ['Farmácia', 'Movimentações']
        }
    }
];
