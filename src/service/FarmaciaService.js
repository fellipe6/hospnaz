import { FARMACIA_DASHBOARD_MOCK, MEDICAMENTOS_MOCK, MOVIMENTACOES_FARMACIA_MOCK, PRESCRICOES_PENDENTES_MOCK } from './mock/farmacia.mock';

export class FarmaciaService {
    getDashboardData() {
        return Promise.resolve(FARMACIA_DASHBOARD_MOCK);
    }

    getEstoque() {
        return Promise.resolve(MEDICAMENTOS_MOCK);
    }

    getPrescricoesPendentes() {
        return Promise.resolve(PRESCRICOES_PENDENTES_MOCK);
    }

    getMovimentacoes() {
        return Promise.resolve(MOVIMENTACOES_FARMACIA_MOCK);
    }

    getPrescricaoById(id) {
        return Promise.resolve(PRESCRICOES_PENDENTES_MOCK.find(p => p.id === parseInt(id)));
    }

    dispensarItem(prescricaoId, itemId, lote, quantidade) {
        console.log(`Dispensando ${quantidade} do item ${itemId} (Prescrição ${prescricaoId}) com lote ${lote}`);
        return Promise.resolve({ success: true });
    }
}
