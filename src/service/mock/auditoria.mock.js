export const AUDITORIA_MOCK = [
    {
        id: 1,
        dataHora: '2026-01-30T10:00:00',
        usuarioId: 1,
        usuarioNome: 'Administrador',
        acao: 'CRIOU',
        entidade: 'PACIENTE',
        detalhes: 'Novo paciente Maria Silva cadastrado.'
    },
    {
        id: 2,
        dataHora: '2026-01-30T11:30:00',
        usuarioId: 2,
        usuarioNome: 'Dr. Ricardo Santos',
        acao: 'CRIOU',
        entidade: 'PEP',
        detalhes: 'Iniciado atendimento para paciente 1.'
    },
    {
        id: 3,
        dataHora: '2026-01-30T14:00:00',
        usuarioId: 2,
        usuarioNome: 'Dr. Ricardo Santos',
        acao: 'FINALIZOU',
        entidade: 'PEP',
        detalhes: 'Atendimento #1 finalizado e bloqueado para edição.'
    },
    {
        id: 4,
        dataHora: '2026-01-30T15:00:00',
        usuarioId: 4,
        usuarioNome: 'Carlos Financeiro',
        acao: 'EDITOU',
        entidade: 'FINANCEIRO',
        detalhes: 'Contas a pagar atualizadas para fornecedor Farmácia Central.'
    }
];
