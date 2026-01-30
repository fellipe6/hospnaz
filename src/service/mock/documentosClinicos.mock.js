export const DOCUMENTOS_CLINICOS_MOCK = [
    {
        id: 1,
        pepId: 1,
        pacienteId: 1,
        usuarioId: 2,
        tipo: 'Prescrição',
        status: 'Gerado',
        dataHora: '2026-01-20T09:00:00',
        conteudo: 'Dipirona 1g de 6/6h por 3 dias.'
    },
    {
        id: 2,
        pepId: 1,
        pacienteId: 1,
        usuarioId: 2,
        tipo: 'Atestado Médico',
        status: 'Gerado',
        dataHora: '2026-01-20T09:05:00',
        conteudo: 'Atesto para os devidos fins que o paciente necessita de 2 dias de repouso.'
    },
    {
        id: 3,
        pepId: 2,
        pacienteId: 2,
        usuarioId: 2,
        tipo: 'Declaração',
        status: 'Gerado',
        dataHora: '2026-01-25T14:30:00',
        conteudo: 'Declaro que o paciente esteve em consulta das 14h às 15h.'
    }
];
