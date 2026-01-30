export default [
    {
        path: '/pages/almoxarifado/dashboard',
        name: 'almoxarifado-dashboard',
        component: () => import('@/views/pages/almoxarifado/AlmoxarifadoDashboard.vue')
    },
    {
        path: '/pages/almoxarifado/produtos',
        name: 'almoxarifado-produtos',
        component: () => import('@/views/pages/almoxarifado/Produtos.vue')
    },
    {
        path: '/pages/almoxarifado/movimentacoes',
        name: 'almoxarifado-movimentacoes',
        component: () => import('@/views/pages/almoxarifado/Movimentacoes.vue')
    },
    {
        path: '/pages/almoxarifado/fornecedores',
        name: 'almoxarifado-fornecedores',
        component: () => import('@/views/pages/almoxarifado/Fornecedores.vue')
    },
    {
        path: '/pages/almoxarifado/estoque-minimo',
        name: 'almoxarifado-estoque-minimo',
        component: () => import('@/views/pages/almoxarifado/EstoqueMinimo.vue')
    }
];
