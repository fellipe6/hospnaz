import { ATENDIMENTOS_MOCK, CIDS_MOCK, JORNADA_PACIENTE_MOCK } from './mock/fluxoClinico.mock';

export class ClinicoService {
    getAtendimentosByPaciente(pacienteId) {
        return Promise.resolve(ATENDIMENTOS_MOCK.filter(a => a.pacienteId === parseInt(pacienteId)));
    }

    getHistorioLongitudinal(pacienteId) {
        return Promise.resolve(JORNADA_PACIENTE_MOCK);
    }

    getCids() {
        return Promise.resolve(CIDS_MOCK);
    }

    saveAtendimento(atendimento) {
        console.log('Salvando Atendimento:', atendimento);
        return Promise.resolve({ success: true, id: Math.floor(Math.random() * 10000) });
    }
}
