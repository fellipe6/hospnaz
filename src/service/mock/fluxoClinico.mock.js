export const INVENTARIO_FARMACIA_MOCK = [
    { 
        id: 1, 
        codigo: 'MED001', 
        nome: 'Dipirona Sódica 500mg/ml', 
        categoria: 'Analgésico', 
        estoqueAtual: 450, 
        estoqueMinimo: 100,
        unidade: 'Ampolas',
        lotes: [
            { id: 10, numero: 'L2201', validade: '2026-12-31', quantidade: 200 },
            { id: 11, numero: 'L2305', validade: '2027-06-15', quantidade: 250 }
        ]
    },
    { 
        id: 2, 
        codigo: 'MED002', 
        nome: 'Amoxicilina 500mg', 
        categoria: 'Antibiótico', 
        estoqueAtual: 85, 
        estoqueMinimo: 150,
        unidade: 'Comprimidos',
        lotes: [
            { id: 20, numero: 'L2202', validade: '2025-06-30', quantidade: 50 },
            { id: 21, numero: 'L2208', validade: '2025-02-15', quantidade: 35 } // Próximo do vencimento
        ]
    },
    { 
        id: 3, 
        codigo: 'MED003', 
        nome: 'Omeprazol 20mg', 
        categoria: 'Gastroprotetor', 
        estoqueAtual: 12, 
        estoqueMinimo: 50,
        unidade: 'Cápsulas',
        lotes: [
            { id: 30, numero: 'L2203', validade: '2025-08-15', quantidade: 12 }
        ]
    }
];

export const ATENDIMENTOS_MOCK = [
    {
        id: 5001,
        pacienteId: 1,
        pacienteNome: 'Maria Silva',
        dataHora: '2026-01-30T10:00:00',
        medico: 'Dr. Ricardo Santos',
        diagnostico: 'Gripe Comum (J11)',
        evolucao: 'Paciente apresenta febre e coriza há 2 dias. Pulmões limpos.',
        prescricao: [
            { medicamento: 'Dipirona Sódica', dose: '1 amp', via: 'EV', frequencia: '6/6h' }
        ],
        status: 'Finalizado'
    }
];

export const JORNADA_PACIENTE_MOCK = [
    { id: 1, data: '2026-01-30 10:00', tipo: 'Atendimento', icone: 'pi pi-user-md', cor: 'blue', titulo: 'Consulta Médica', descricao: 'Diagnóstico: J11 - Gripe Comum', responsavel: 'Dr. Ricardo Santos' },
    { id: 2, data: '2026-01-30 10:15', tipo: 'Prescrição', icone: 'pi pi-file-edit', cor: 'orange', titulo: 'Prescrição Gerada', descricao: 'Dipirona Sódica, Ceftriaxona', responsavel: 'Dr. Ricardo Santos' },
    { id: 3, data: '2026-01-30 10:45', tipo: 'Dispensação', icone: 'pi pi-box', cor: 'green', titulo: 'Medicamentos Dispensados', descricao: 'Lote L2201 (Dipirona), Lote L2204 (Ceftriaxona)', responsavel: 'Farm. Carla Lima' }
];

export const CIDS_MOCK = [
    { code: 'J11', name: 'Gripe' },
    { code: 'I10', name: 'Hipertensão Essencial' },
    { code: 'E11', name: 'Diabetes Mellitus Tipo 2' },
    { code: 'K21', name: 'Doença de Refluxo Gastroesofágico' },
    { code: 'M54.5', name: 'Dor Lombar Baixa' }
];
