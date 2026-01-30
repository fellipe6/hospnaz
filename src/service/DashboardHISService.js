import { DASHBOARD_HIS_MOCK } from './mock/dashboardHIS.mock';

export class DashboardHISService {
    getDashboardData() {
        return Promise.resolve(DASHBOARD_HIS_MOCK);
    }
}
