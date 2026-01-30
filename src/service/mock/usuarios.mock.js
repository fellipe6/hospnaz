export const ROLE_ADMIN = 'ADMIN';
export const ROLE_MEDICO = 'MEDICO';
export const ROLE_ENFERMAGEM = 'ENFERMAGEM';
export const ROLE_FINANCEIRO = 'FINANCEIRO';

export const USUARIOS_MOCK = [
    {
        id: 1,
        nome: 'Administrador do Sistema',
        email: 'admin@hospnaz.com.br',
        senha: 'admin123',
        role: ROLE_ADMIN,
        status: 'Ativo'
    },
    {
        id: 2,
        nome: 'Dr. Ricardo Santos',
        email: 'medico@hospnaz.com.br',
        senha: 'medico123',
        role: ROLE_MEDICO,
        status: 'Ativo'
    },
    {
        id: 3,
        nome: 'Enf. Fernanda Lima',
        email: 'enfermaria@hospnaz.com.br',
        senha: 'enf123',
        role: ROLE_ENFERMAGEM,
        status: 'Ativo'
    },
    {
        id: 4,
        nome: 'Carlos Financeiro',
        email: 'financeiro@hospnaz.com.br',
        senha: 'fin123',
        role: ROLE_FINANCEIRO,
        status: 'Ativo'
    }
];
