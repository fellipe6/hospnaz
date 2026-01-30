export const PEP_360_MOCK = {
    pacienteId: 1,
    indicadores: [
        { label: 'Atendimentos', value: 12, icon: 'pi pi-user-md', color: 'blue' },
        { label: 'Prescrições', value: 8, icon: 'pi pi-file-edit', color: 'orange' },
        { label: 'Internações', value: 1, icon: 'pi pi-hospital', color: 'red' },
        { label: 'Alertas Farmaco', value: 2, icon: 'pi pi-exclamation-triangle', color: 'yellow' }
    ],
    timeline: [
        {
            id: 1,
            data: '2026-01-30 14:00',
            tipo: 'Atendimento',
            titulo: 'Consulta de Retorno',
            descricao: 'Paciente apresenta melhora no quadro gripal. Pulmões limpos. Mantida medicação de suporte.',
            responsavel: 'Dr. Ricardo Santos',
            categoria: 'Clínica Médica',
            tags: ['Estável'],
            icon: 'pi pi-user-md',
            color: 'blue'
        },
        {
            id: 2,
            data: '2026-01-30 14:15',
            tipo: 'Prescrição',
            titulo: 'Prescrição Médica Renovada',
            descricao: 'Dipirona Sódica 500mg, Omeprazol 20mg.',
            responsavel: 'Dr. Ricardo Santos',
            categoria: 'Farmacologia',
            icon: 'pi pi-file-edit',
            color: 'orange'
        },
        {
            id: 3,
            data: '2026-01-30 15:00',
            tipo: 'Dispensação',
            titulo: 'Medicamentos Dispensados',
            descricao: 'Dispensação completa da prescrição #101. Lotes: L2201, L2203.',
            responsavel: 'Farm. Carla Lima',
            categoria: 'Farmácia',
            icon: 'pi pi-box',
            color: 'green'
        },
        {
            id: 4,
            data: '2026-01-28 09:30',
            tipo: 'Exame',
            titulo: 'Hemograma Completo',
            descricao: 'Leucócitos: 8.500/mm³, Hemoglobina: 14g/dL. Resultados dentro da normalidade.',
            responsavel: 'Lab. Central',
            categoria: 'Diagnóstico',
            icon: 'pi pi-microchip',
            color: 'purple'
        }
    ],
    exames: [
        { id: 1, tipo: 'Hemograma', data: '2026-01-28', resultado: 'Normal', status: 'Liberado', responsavel: 'Dr. Marcos' },
        { id: 2, tipo: 'Proteína C Reativa', data: '2026-01-28', resultado: '2.5 mg/L', status: 'Liberado', responsavel: 'Dr. Marcos' },
        { id: 3, tipo: 'Raio-X de Tórax', data: '2026-01-27', resultado: 'Sem alterações', status: 'Liberado', responsavel: 'Dra. Ana' }
    ],
    documentos: [
        { id: 1, nome: 'Atestado Médico - 2 dias', data: '2026-01-30', tipo: 'PDF', tamanho: '450KB' },
        { id: 2, nome: 'Termo de Consentimento', data: '2026-01-25', tipo: 'PDF', tamanho: '1.2MB' }
    ],
    resumoCognitivo: "Paciente feminina, 45 anos, com histórico de hipertensão controlada. Atualmente em tratamento para gripe comum (J11). Apresenta boa adesão ao tratamento e sem intercorrências alérgicas registradas nesta internação. Últimos exames laboratoriais estáveis."
};
