export const LancamentosFinanceirosMock = [
    { 
        id: 1, 
        tipo: 'CUSTO_OPERACIONAL', 
        origem: 'ALMOXARIFADO', 
        centroCustoId: 1, 
        produtoId: 101, 
        valor: 550.00, 
        data: '2024-01-10T10:00:00',
        descricao: 'Entrada de Dipirona'
    },
    { 
        id: 2, 
        tipo: 'DESPESA', 
        origem: 'MANUAL', 
        centroCustoId: 4, 
        produtoId: null, 
        valor: 1500.00, 
        data: '2024-01-12T09:00:00',
        descricao: 'Manutenção Mensal'
    },
    { 
        id: 3, 
        tipo: 'CUSTO_OPERACIONAL', 
        origem: 'ALMOXARIFADO', 
        centroCustoId: 2, 
        produtoId: 103, 
        valor: 600.00, 
        data: '2024-01-15T14:30:00',
        descricao: 'Saída de Luvas - Uso Interno'
    }
];
