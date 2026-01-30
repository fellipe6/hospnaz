import { INDICADORES_MOCK } from './mock/indicadores.mock';

export class IndicatorService {
    getDashboardIndicators() {
        return Promise.resolve(INDICADORES_MOCK);
    }
}
