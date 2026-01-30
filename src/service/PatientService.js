export const PatientService = {
    getPatientsData() {
        return [
            {
                id: '1',
                name: 'João Silva Santos',
                cpf: '123.456.789-00',
                dateOfBirth: '1985-03-15',
                phone: '(11) 98765-4321',
                email: 'joao.silva@email.com',
                address: {
                    street: 'Rua das Flores',
                    number: '123',
                    complement: 'Apto 45',
                    city: 'São Paulo',
                    state: 'SP',
                    zip: '01234-567'
                },
                status: 'active'
            },
            {
                id: '2',
                name: 'Maria Oliveira Costa',
                cpf: '234.567.890-11',
                dateOfBirth: '1990-07-22',
                phone: '(21) 99876-5432',
                email: 'maria.oliveira@email.com',
                address: {
                    street: 'Av. Paulista',
                    number: '1000',
                    complement: '',
                    city: 'São Paulo',
                    state: 'SP',
                    zip: '01310-100'
                },
                status: 'active'
            },
            {
                id: '3',
                name: 'Pedro Henrique Souza',
                cpf: '345.678.901-22',
                dateOfBirth: '1978-11-30',
                phone: '(11) 97654-3210',
                email: 'pedro.souza@email.com',
                address: {
                    street: 'Rua Augusta',
                    number: '500',
                    complement: 'Sala 12',
                    city: 'São Paulo',
                    state: 'SP',
                    zip: '01305-000'
                },
                status: 'active'
            },
            {
                id: '4',
                name: 'Ana Carolina Ferreira',
                cpf: '456.789.012-33',
                dateOfBirth: '1995-05-18',
                phone: '(31) 98765-1234',
                email: 'ana.ferreira@email.com',
                address: {
                    street: 'Rua da Bahia',
                    number: '789',
                    complement: '',
                    city: 'Belo Horizonte',
                    state: 'MG',
                    zip: '30160-011'
                },
                status: 'inactive'
            },
            {
                id: '5',
                name: 'Carlos Eduardo Lima',
                cpf: '567.890.123-44',
                dateOfBirth: '1982-09-25',
                phone: '(41) 99123-4567',
                email: 'carlos.lima@email.com',
                address: {
                    street: 'Av. Batel',
                    number: '1500',
                    complement: 'Bloco B',
                    city: 'Curitiba',
                    state: 'PR',
                    zip: '80420-090'
                },
                status: 'active'
            },
            {
                id: '6',
                name: 'Juliana Rodrigues Alves',
                cpf: '678.901.234-55',
                dateOfBirth: '1988-12-10',
                phone: '(51) 98234-5678',
                email: 'juliana.alves@email.com',
                address: {
                    street: 'Rua dos Andradas',
                    number: '234',
                    complement: 'Apto 101',
                    city: 'Porto Alegre',
                    state: 'RS',
                    zip: '90020-000'
                },
                status: 'active'
            },
            {
                id: '7',
                name: 'Roberto Carlos Mendes',
                cpf: '789.012.345-66',
                dateOfBirth: '1975-04-08',
                phone: '(85) 99345-6789',
                email: 'roberto.mendes@email.com',
                address: {
                    street: 'Av. Beira Mar',
                    number: '3000',
                    complement: '',
                    city: 'Fortaleza',
                    state: 'CE',
                    zip: '60165-121'
                },
                status: 'inactive'
            },
            {
                id: '8',
                name: 'Fernanda Beatriz Gomes',
                cpf: '890.123.456-77',
                dateOfBirth: '1992-08-14',
                phone: '(71) 98456-7890',
                email: 'fernanda.gomes@email.com',
                address: {
                    street: 'Rua Chile',
                    number: '567',
                    complement: 'Sala 8',
                    city: 'Salvador',
                    state: 'BA',
                    zip: '40020-000'
                },
                status: 'active'
            }
        ];
    },

    getPatients() {
        return Promise.resolve(this.getPatientsData());
    }
};
