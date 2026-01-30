import { INVENTARIO_FARMACIA_MOCK } from './mock/fluxoClinico.mock';

export class InventarioFarmaciaService {
    getInventario() {
        return Promise.resolve(INVENTARIO_FARMACIA_MOCK);
    }

    ajustarEstoque(medicamentoId, loteId, quantidade, tipo) {
        console.log(`Ajuste de estoque: Med ${medicamentoId}, Lote ${loteId}, Qtd ${quantidade}, Tipo ${tipo}`);
        return Promise.resolve({ success: true });
    }
}
