import { USUARIOS_MOCK } from './mock/usuarios.mock';

export class UserService {
    getUsers() {
        return Promise.resolve(USUARIOS_MOCK);
    }

    getUserById(id) {
        return Promise.resolve(USUARIOS_MOCK.find(u => u.id === parseInt(id)));
    }

    saveUser(user) {
        console.log('User saved:', user);
        return Promise.resolve(user);
    }
}
