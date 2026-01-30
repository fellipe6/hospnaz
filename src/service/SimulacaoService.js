import { ATENDIMENTOS_MOCK, INVENTARIO_FARMACIA_MOCK, JORNADA_PACIENTE_MOCK } from './mock/fluxoClinico.mock';

class SimulacaoService {
    constructor() {
        this.resetSession();
    }

    resetSession() {
        this.sessionData = {
            inventario: [...INVENTARIO_FARMACIA_MOCK],
            atendimentos: [...ATENDIMENTOS_MOCK],
            timeline: [...JORNADA_PACIENTE_MOCK],
            prescricoesPendentes: []
        };
    }

    // Clinical Actions
    registrarAtendimento(atendimento) {
        const id = Math.floor(Math.random() * 10000);
        const novoAtendimento = { ...atendimento, id, dataHora: new Date().toISOString() };
        this.sessionData.atendimentos.push(novoAtendimento);
        
        // Add to global timeline
        this.sessionData.timeline.unshift({
            id: Math.random(),
            data: new Date().toLocaleString('pt-BR'),
            tipo: 'Atendimento',
            icone: 'pi pi-user-md',
            cor: 'blue',
            titulo: 'Novo Atendimento Finalizado',
            descricao: `CID-10: ${atendimento.cid?.code || 'N/A'}. Prescrição gerada.`,
            responsavel: 'Dr. Ricardo Santos'
        });

        // Add to pharmacy queue
        if (atendimento.prescricao && atendimento.prescricao.length > 0) {
            this.sessionData.prescricoesPendentes.push({
                id: `RX-${id}`,
                pacienteId: atendimento.pacienteId,
                pacienteNome: atendimento.pacienteNome,
                dataHora: new Date().toISOString(),
                medico: 'Dr. Ricardo Santos',
                status: 'Pendente',
                itens: atendimento.prescricao.map(i => ({
                    ...i,
                    nome: i.medicamento,
                    prescrito: 1,
                    dispensado: 0
                }))
            });
        }

        return novoAtendimento;
    }

    // Pharmacy Actions
    getInventario() {
        return this.sessionData.inventario;
    }

    getPrescricoesPendentes() {
        return this.sessionData.prescricoesPendentes;
    }

    getPrescricaoById(id) {
        return this.sessionData.prescricoesPendentes.find(p => p.id === id);
    }

    dispensarMedicamento(prescricaoId, medicamentoNome, loteNumero, quantidade) {
        // Find prescription
        const rx = this.sessionData.prescricoesPendentes.find(p => p.id === prescricaoId);
        if (rx) {
            const item = rx.itens.find(i => i.nome === medicamentoNome);
            if (item) {
                item.dispensado += quantidade;
                if (item.dispensado >= item.prescrito) {
                    rx.status = 'Dispensado';
                }
            }
        }

        // Decrement stock
        const med = this.sessionData.inventario.find(m => m.nome === medicamentoNome);
        if (med) {
            const lote = med.lotes.find(l => l.numero === loteNumero);
            if (lote) {
                lote.quantidade -= quantidade;
                med.estoqueAtual -= quantidade;
                med.lastModified = true; // Flag for UI
            }
        }

        // Log to timeline
        this.sessionData.timeline.unshift({
            id: Math.random(),
            data: new Date().toLocaleString('pt-BR'),
            tipo: 'Dispensação',
            icone: 'pi pi-box',
            cor: 'green',
            titulo: 'Medicamento Dispensado',
            descricao: `${medicamentoNome} - Lote: ${loteNumero} (${quantidade} un)`,
            responsavel: 'Farm. Carla Lima'
        });
    }

    getTimeline() {
        return this.sessionData.timeline;
    }
}

export const simulacaoService = new SimulacaoService();
