export default [
    {
        path: '/pep',
        name: 'pep-list',
        component: () => import('@/views/pages/PepList.vue'),
        meta: {
            breadcrumb: ['PEP', 'Lista de Atendimentos']
        }
    },
    {
        path: '/pep/:id',
        name: 'pep-detail',
        component: () => import('@/views/pages/PepClinico.vue'),
        meta: {
            breadcrumb: ['PEP', 'Prontuário Eletrônico']
        }
    }
];
