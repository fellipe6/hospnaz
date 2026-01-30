import { AGENDAMENTOS_MOCK } from './mock/agendamentos.mock';
import { ANEXOS_MOCK } from './mock/anexos.mock';
import { EVOLUCOES_MOCK } from './mock/evolucoes.mock';
import { PACIENTES_MOCK } from './mock/pacientes.mock';
import { PEP_MOCK } from './mock/pep.mock';
import { PROFISSIONAIS_MOCK } from './mock/profissionais.mock';
import { SINAIS_VITAIS_MOCK } from './mock/sinaisVitais.mock';

export class PepService {
    getRecords() {
        return Promise.resolve(
            PEP_MOCK.map((record) => {
                const paciente = PACIENTES_MOCK.find((p) => p.id === record.pacienteId);
                const profissional = PROFISSIONAIS_MOCK.find((pr) => pr.id === record.profissionalId);
                const agendamento = AGENDAMENTOS_MOCK.find((a) => a.id === record.agendamentoId);

                return {
                    ...record,
                    pacienteNome: paciente ? paciente.nome : 'Não encontrado',
                    profissionalNome: profissional ? profissional.nome : 'Não encontrado',
                    agendamentoData: agendamento ? agendamento.dataHora : record.dataHora
                };
            })
        );
    }

    getRecordById(id) {
        const record = PEP_MOCK.find((r) => r.id === parseInt(id));
        if (!record) return Promise.reject('Registro não encontrado');

        const paciente = PACIENTES_MOCK.find((p) => p.id === record.pacienteId);
        const profissional = PROFISSIONAIS_MOCK.find((pr) => pr.id === record.profissionalId);
        const agendamento = AGENDAMENTOS_MOCK.find((a) => a.id === record.agendamentoId);

        return Promise.resolve({
            ...record,
            paciente,
            profissional,
            agendamento
        });
    }

    getEvolucoes(pepId) {
        return Promise.resolve(EVOLUCOES_MOCK.filter((e) => e.pepId === parseInt(pepId)));
    }

    getSinaisVitais(pepId) {
        return Promise.resolve(SINAIS_VITAIS_MOCK.filter((s) => s.pepId === parseInt(pepId)));
    }

    getAnexos(pepId) {
        return Promise.resolve(ANEXOS_MOCK.filter((a) => a.pepId === parseInt(pepId)));
    }

    getHistorialGeral(pacienteId) {
        return Promise.resolve(
            PEP_MOCK.filter((r) => r.pacienteId === parseInt(pacienteId))
                .map((record) => {
                    const profissional = PROFISSIONAIS_MOCK.find((pr) => pr.id === record.profissionalId);
                    return {
                        ...record,
                        profissionalNome: profissional ? profissional.nome : 'Médico'
                    };
                })
                .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
        );
    }

    saveRecord(record) {
        // Mock save logic
        console.log('Record saved:', record);
        return Promise.resolve(record);
    }
}
