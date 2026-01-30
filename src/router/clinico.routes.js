export default [
    {
        path: '/clinico/atendimento/:id',
        name: 'clinico-atendimento',
        component: () => import('@/views/pages/clinico/AtendimentoV2.vue'),
        meta: {
            breadcrumb: ['Clínico', 'Atendimento']
        }
    },
    {
        path: '/clinico/historico/:id',
        name: 'clinico-historico',
        component: () => import('@/views/pages/clinico/HistoricoLongitudinal.vue'),
        meta: {
            breadcrumb: ['Clínico', 'Histórico Longitudinal']
        }
    },
    {
        path: '/clinico/pep360/:id',
        name: 'clinico-pep360',
        component: () => import('@/views/pages/clinico/Pep360.vue'),
        meta: {
            breadcrumb: ['Clínico', 'PEP 360º']
        }
    }
];
