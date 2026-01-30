export const ContasPagarMock = [
    { 
        id: 1, 
        fornecedorId: 2, 
        produtoId: 101, 
        quantidade: 100, 
        valorUnitario: 5.50, 
        valorTotal: 550.00, 
        dataVencimento: '2024-02-10', 
        status: 'Pago',
        origem: 'ALMOXARIFADO'
    },
    { 
        id: 2, 
        fornecedorId: 4, 
        produtoId: 103, 
        quantidade: 200, 
        valorUnitario: 12.00, 
        valorTotal: 2400.00, 
        dataVencimento: '2024-02-25', 
        status: 'Pendente',
        origem: 'ALMOXARIFADO'
    },
    { 
        id: 3, 
        fornecedorId: 3, 
        produtoId: 105, 
        quantidade: 5, 
        valorUnitario: 45.00, 
        valorTotal: 225.00, 
        dataVencimento: '2024-03-05', 
        status: 'Pendente',
        origem: 'ALMOXARIFADO'
    }
];
