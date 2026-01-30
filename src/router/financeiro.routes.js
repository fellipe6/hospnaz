export default [
    {
        path: '/financeiro/dashboard',
        name: 'finance-dashboard',
        component: () => import('@/views/pages/financeiro/FinanceDashboard.vue')
    },
    {
        path: '/financeiro/contas-pagar',
        name: 'contas-pagar',
        component: () => import('@/views/pages/financeiro/ContasPagar.vue')
    },
    {
        path: '/financeiro/lancamentos',
        name: 'lancamentos-financeiros',
        component: () => import('@/views/pages/financeiro/LancamentosFinanceiros.vue')
    },
    {
        path: '/financeiro/centros-custo',
        name: 'centros-custo',
        component: () => import('@/views/pages/financeiro/CentrosCusto.vue')
    },
    {
        path: '/financeiro/relatorios',
        name: 'finance-reports',
        component: () => import('@/views/pages/financeiro/FinanceReports.vue')
    }
];
