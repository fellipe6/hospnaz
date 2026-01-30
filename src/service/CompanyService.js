export const CompanyService = {
    getCompaniesData() {
        return [
            {
                id: '1',
                name: 'Tech Solutions Ltda',
                fantasyName: 'TechSol',
                cnpj: '12.345.678/0001-90',
                phone: '(11) 3333-4444',
                email: 'contato@techsol.com.br',
                address: {
                    street: 'Av. Paulista',
                    number: '1000',
                    complement: 'Conj 101',
                    city: 'São Paulo',
                    state: 'SP',
                    zip: '01310-100'
                },
                status: 'active'
            },
            {
                id: '2',
                name: 'Comércio e Importação Silva',
                fantasyName: 'Silva Imports',
                cnpj: '98.765.432/0001-10',
                phone: '(21) 2222-3333',
                email: 'vendas@silvaimports.com',
                address: {
                    street: 'Rua do Ouvidor',
                    number: '50',
                    complement: 'Loja A',
                    city: 'Rio de Janeiro',
                    state: 'RJ',
                    zip: '20040-030'
                },
                status: 'active'
            },
            {
                id: '3',
                name: 'Indústria de Alimentos Bom Gosto S.A.',
                fantasyName: 'Bom Gosto',
                cnpj: '11.222.333/0001-44',
                phone: '(31) 3456-7890',
                email: 'sac@bomgosto.com.br',
                address: {
                    street: 'Av. Amazonas',
                    number: '2500',
                    complement: '',
                    city: 'Belo Horizonte',
                    state: 'MG',
                    zip: '30180-000'
                },
                status: 'inactive'
            }
        ];
    },

    getCompanies() {
        return Promise.resolve(this.getCompaniesData());
    }
};
