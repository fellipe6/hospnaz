<script setup>
import ProdutoForm from '@/components/almoxarifado/ProdutoForm.vue';
import ProdutoTable from '@/components/almoxarifado/ProdutoTable.vue';
import { ProdutoService } from '@/service/almoxarifado/produto.mock';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();

const products = ref([]);
const productDialog = ref(false);
const product = ref({});
const submitted = ref(false);
const loading = ref(true);

onMounted(() => {
    loadProducts();
});

const loadProducts = async () => {
    loading.value = true;
    products.value = await ProdutoService.getProdutosBaixoEstoque();
    loading.value = false;
};

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const editProduct = (prod) => {
    product.value = { ...prod };
    productDialog.value = true;
};

// Não permitimos deletar daqui, apenas editar/repor
const confirmDeleteProduct = () => {
    toast.add({ severity: 'warn', summary: 'Ação não permitida', detail: 'Vá para a tela de Produtos para excluir.', life: 3000 });
};

const saveProduct = async (prod) => {
    await ProdutoService.saveProduto(prod);
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto salvo', life: 3000 });
    productDialog.value = false;
    // Recarregar apenas os baixos
    loadProducts();
};
</script>

<template>
    <div class="card border-red-500 border-l-4">
        <div class="flex items-center justify-between mb-4">
            <h5 class="m-0 text-red-600">⚠️ Estoque Crítico/Baixo</h5>
            <Button label="Imprimir Relatório" icon="pi pi-print" severity="secondary" outlined />
        </div>
        <p class="mb-4">Lista de produtos que necessitam de reposição urgente.</p>

        <ProdutoTable 
            :products="products" 
            :loading="loading"
            @edit="editProduct"
            @delete="confirmDeleteProduct"
            class="w-full"
        />

        <Dialog v-model:visible="productDialog" :style="{ width: '550px' }" header="Detalhes do Produto" :modal="true" class="p-fluid">
            <ProdutoForm 
                v-model="product" 
                @save="saveProduct" 
                @cancel="hideDialog" 
            />
        </Dialog>
    </div>
</template>
