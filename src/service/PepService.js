import { AGENDAMENTOS_MOCK } from './mock/agendamentos.mock';
import { PACIENTES_MOCK } from './mock/pacientes.mock';
import { PEP_MOCK } from './mock/pep.mock';
import { PROFISSIONAIS_MOCK } from './mock/profissionais.mock';

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

    saveRecord(record) {
        // Mock save logic (would update PEP_MOCK in a real app or with reactive state)
        console.log('Record saved:', record);
        return Promise.resolve(record);
    }
}
