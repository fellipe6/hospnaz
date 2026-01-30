export const MEDICAMENTOS_MOCK = [
    { id: 1, codigo: 'MED001', nome: 'Dipirona Sódica 500mg/ml', categoria: 'Analgésico', estoque: 450, estoqueMinimo: 100, unidade: 'Ampolas', lote: 'L2201', vencimento: '2026-12-31' },
    { id: 2, codigo: 'MED002', nome: 'Amoxicilina 500mg', categoria: 'Antibiótico', estoque: 85, estoqueMinimo: 150, unidade: 'Comprimidos', lote: 'L2202', vencimento: '2025-06-30' },
    { id: 3, codigo: 'MED003', nome: 'Omeprazol 20mg', categoria: 'Gastroprotetor', estoque: 12, estoqueMinimo: 50, unidade: 'Cápsulas', lote: 'L2203', vencimento: '2025-08-15' },
    { id: 4, codigo: 'MED004', nome: 'Ceftriaxona 1g', categoria: 'Antibiótico', estoque: 200, estoqueMinimo: 50, unidade: 'Frascos', lote: 'L2204', vencimento: '2027-01-20' },
    { id: 5, codigo: 'MED005', nome: 'Insulina NPH', categoria: 'Hipoglicemiante', estoque: 35, estoqueMinimo: 30, unidade: 'Frascos', lote: 'L2205', vencimento: '2025-03-10' }
];

export const PRESCRICOES_PENDENTES_MOCK = [
    {
        id: 101,
        pacienteId: 1,
        pacienteNome: 'Maria Silva',
        idade: '45 anos',
        leito: 'UTI-01',
        medico: 'Dr. Ricardo Santos',
        dataHora: '2026-01-30T10:00:00',
        status: 'Pendente',
        itens: [
            { id: 1, medicamentoId: 1, nome: 'Dipirona Sódica', dose: '1 amp', via: 'EV', frequencia: '6/6h', prescrito: 4, dispensado: 0 },
            { id: 2, medicamentoId: 4, nome: 'Ceftriaxona 1g', dose: '1 frasco', via: 'EV', frequencia: '12/12h', prescrito: 2, dispensado: 0 }
        ]
    },
    {
        id: 102,
        pacienteId: 2,
        pacienteNome: 'João Oliveira',
        idade: '62 anos',
        leito: 'ENF-204',
        medico: 'Dra. Fernanda Lima',
        dataHora: '2026-01-30T10:30:00',
        status: 'Parcial',
        itens: [
            { id: 3, medicamentoId: 2, nome: 'Amoxicilina 500mg', dose: '1 comp', via: 'VO', frequencia: '8/8h', prescrito: 3, dispensado: 1 },
            { id: 4, medicamentoId: 3, nome: 'Omeprazol 20mg', dose: '1 cap', via: 'VO', frequencia: 'Jejum', prescrito: 1, dispensado: 0 }
        ]
    }
];

export const MOVIMENTACOES_FARMACIA_MOCK = [
    { id: 1, tipo: 'SAÍDA', origem: 'Dispensação', medicamento: 'Dipirona Sódica', quantidade: 5, dataHora: '2026-01-30T09:15:00', responsavel: 'Farm. Carla Lima' },
    { id: 2, tipo: 'ENTRADA', origem: 'Almoxarifado Central', medicamento: 'Ceftriaxona 1g', quantidade: 100, dataHora: '2026-01-30T08:30:00', responsavel: 'Farm. Carla Lima' },
    { id: 3, tipo: 'SAÍDA', origem: 'Perda/Vencimento', medicamento: 'Amoxicilina 500mg', quantidade: 2, dataHora: '2026-01-29T16:45:00', responsavel: 'Farm. Marcos Dias' }
];

export const FARMACIA_DASHBOARD_MOCK = {
    kpis: {
        prescricoesPendentes: 12,
        dispensacoesDia: 84,
        estoqueCritico: 8,
        custoDiario: 'R$ 4.250,00'
    },
    consumoPorSetor: [
        { label: 'UTI', value: 45 },
        { label: 'Enfermaria', value: 30 },
        { label: 'Pronto Socorro', value: 15 },
        { label: 'Centro Cirúrgico', value: 10 }
    ],
    maisDispensados: [
        { label: 'Dipirona', value: 150 },
        { label: 'Soro Fisiológico', value: 120 },
        { label: 'Omeprazol', value: 90 },
        { label: 'Ceftriaxona', value: 75 }
    ]
};
