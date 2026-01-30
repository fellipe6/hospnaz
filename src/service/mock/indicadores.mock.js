export const INDICADORES_MOCK = {
    atendimentosPorMedico: [
        { label: 'Dr. Ricardo Santos', value: 45 },
        { label: 'Dra. Fernanda Lima', value: 38 },
        { label: 'Dr. André Costa', value: 25 }
    ],
    diagnosticosFrequentes: [
        { label: 'I10 - Hipertensão', value: 30 },
        { label: 'E11 - Diabetes', value: 22 },
        { label: 'J06 - Infecção Respiratória', value: 18 },
        { label: 'R51 - Cefaleia', value: 15 }
    ],
    evolucaoMensal: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        consultas: [120, 150, 180, 160, 210, 240],
        procedimentos: [40, 55, 60, 45, 70, 85]
    },
    pacientesRecorrentes: [
        { nome: 'Maria Silva', atendimentos: 5 },
        { nome: 'João Oliveira', atendimentos: 3 },
        { nome: 'Ana Costa', atendimentos: 2 }
    ],
    tempoMedioAtendimento: '18 min'
};
