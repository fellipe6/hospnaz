
export const FornecedorService = {
    getFornecedoresData() {
        return [
            { id: 1, nome: 'Hospitalar Med Ltda', cnpj: '12.345.678/0001-90', telefone: '(11) 3333-4444', email: 'contato@hospitalarmed.com.br' },
            { id: 2, nome: 'FarmaDistri S.A.', cnpj: '98.765.432/0001-10', telefone: '(21) 2222-5555', email: 'vendas@farmadistri.com.br' },
            { id: 3, nome: 'Equipamentos Brasil', cnpj: '45.678.901/0001-23', telefone: '(31) 4444-6666', email: 'comercial@equipbr.com.br' },
            { id: 4, nome: 'Descartáveis & Cia', cnpj: '56.789.012/0001-34', telefone: '(41) 5555-7777', email: 'sac@descartaveiscia.com.br' }
        ];
    },

    getFornecedores() {
        return Promise.resolve(this.getFornecedoresData());
    },

    getFornecedorById(id) {
        const fornecedor = this.getFornecedoresData().find(f => f.id === id);
        return Promise.resolve(fornecedor);
    }
};
