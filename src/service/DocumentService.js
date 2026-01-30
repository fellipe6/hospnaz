import { DOCUMENTOS_CLINICOS_MOCK } from './mock/documentosClinicos.mock';

export class DocumentService {
    getDocumentsByPep(pepId) {
        return Promise.resolve(DOCUMENTOS_CLINICOS_MOCK.filter(d => d.pepId === parseInt(pepId)));
    }

    generateDocument(doc) {
        const newDoc = {
            ...doc,
            id: DOCUMENTOS_CLINICOS_MOCK.length + 1,
            status: 'Gerado',
            dataHora: new Date().toISOString()
        };
        console.log('Document generated:', newDoc);
        return Promise.resolve(newDoc);
    }
}
