import { PEP_360_MOCK } from './mock/pep360.mock';

export class Pep360Service {
    getHistory360(pacienteId) {
        // Simula busca filtrada por paciente ID
        return Promise.resolve(PEP_360_MOCK);
    }

    getExames(pacienteId) {
        return Promise.resolve(PEP_360_MOCK.exames);
    }

    getDocumentos(pacienteId) {
        return Promise.resolve(PEP_360_MOCK.documentos);
    }
}
