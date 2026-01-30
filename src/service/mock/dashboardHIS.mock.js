export const DASHBOARD_HIS_MOCK = {
    kpis: [
        {
            label: 'Pacientes Ativos',
            value: '1.284',
            variation: '+12%',
            trend: 'up',
            icon: 'pi pi-users',
            color: 'blue',
            description: 'Novos prontuários este mês'
        },
        {
            label: 'Atendimentos',
            value: '842',
            variation: '+5%',
            trend: 'up',
            icon: 'pi pi-check-circle',
            color: 'green',
            description: 'Consultas finalizadas hoje'
        },
        {
            label: 'Tempo Médio',
            value: '18 min',
            variation: '-2%',
            trend: 'down',
            icon: 'pi pi-clock',
            color: 'cyan',
            description: 'Redução vs mês anterior'
        },
        {
            label: 'Pendências PEP',
            value: '24',
            variation: '+8%',
            trend: 'up',
            icon: 'pi pi-exclamation-triangle',
            color: 'orange',
            description: 'Prontuários incompletos'
        }
    ],
    assistencial: {
        especialidades: [
            { label: 'Clínica Médica', value: 450 },
            { label: 'Pediatria', value: 210 },
            { label: 'Ortopedia', value: 180 },
            { label: 'Cardiologia', value: 120 },
            { label: 'Ginecologia', value: 95 }
        ],
        statusPep: [
            { label: 'Completo', value: 68 },
            { label: 'Em Andamento', value: 20 },
            { label: 'Com Pendência', value: 12 }
        ],
        evoluçãoDiaria: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            values: [120, 150, 180, 160, 210, 80, 45]
        }
    },
    operacional: {
        entradasAltas: {
            labels: ['08h', '10h', '12h', '14h', '16h', '18h'],
            entradas: [10, 25, 30, 20, 45, 15],
            altas: [5, 12, 40, 15, 20, 35]
        },
        profissionaisTop: [
            { nome: 'Dr. Ricardo Santos', atendimentos: 145 },
            { nome: 'Dra. Fernanda Lima', atendimentos: 132 },
            { label: 'Dr. André Costa', atendimentos: 98 }
        ]
    },
    atividadesRecentes: [
        {
            id: 1,
            paciente: 'Maria Silva',
            acao: 'Evolução Clínica lançada',
            data: 'Há 5 min',
            status: 'Completo',
            tipo: 'PEP'
        },
        {
            id: 2,
            paciente: 'João Oliveira',
            acao: 'Prescrição gerada',
            data: 'Há 15 min',
            status: 'Pendente Assinatura',
            tipo: 'Documento'
        },
        {
            id: 3,
            paciente: 'Ana Costa',
            acao: 'Atendimento iniciado',
            data: 'Há 1h',
            status: 'Em aberto',
            tipo: 'PEP'
        },
        {
            id: 4,
            paciente: 'Carlos Souza',
            acao: 'Alta hospitalar',
            data: 'Há 2h',
            status: 'Finalizado',
            tipo: 'Altas'
        }
    ]
};
