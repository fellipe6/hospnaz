import { USUARIOS_MOCK } from './mock/usuarios.mock';

export class AuthService {
    login(email, password) {
        const user = USUARIOS_MOCK.find((u) => u.email === email && u.senha === password);
        if (user) {
            // No backend, save info to localStorage
            const sessionData = {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.role,
                isAuthenticated: true
            };
            localStorage.setItem('hospnaz_user', JSON.stringify(sessionData));
            return Promise.resolve(sessionData);
        }
        return Promise.reject('Credenciais inválidas');
    }

    logout() {
        localStorage.removeItem('hospnaz_user');
    }

    getUser() {
        const data = localStorage.getItem('hospnaz_user');
        return data ? JSON.parse(data) : null;
    }

    isAuthenticated() {
        const user = this.getUser();
        return user !== null && user.isAuthenticated;
    }

    getUserRole() {
        const user = this.getUser();
        return user ? user.role : null;
    }
}
