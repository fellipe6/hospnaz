import { AUDITORIA_MOCK } from './mock/auditoria.mock';

export class AuditService {
    getLogs() {
        return Promise.resolve(AUDITORIA_MOCK.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora)));
    }

    log(acao, entidade, detalhes, usuarioId = 1) {
        const newLog = {
            id: AUDITORIA_MOCK.length + 1,
            dataHora: new Date().toISOString(),
            usuarioId,
            usuarioNome: 'Usuário Logado', // Em um sistema real, viria do contexto de auth
            acao,
            entidade,
            detalhes
        };
        console.log('Audit Log:', newLog);
        return Promise.resolve(newLog);
    }
}
