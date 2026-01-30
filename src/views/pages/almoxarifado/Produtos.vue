<script setup>
import ProdutoForm from '@/components/almoxarifado/ProdutoForm.vue';
import ProdutoTable from '@/components/almoxarifado/ProdutoTable.vue';
import { ProdutoService } from '@/service/almoxarifado/produto.mock';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();

const products = ref([]);
const productDialog = ref(false);
const deleteDialog = ref(false);
const product = ref({});
const submitted = ref(false);
const loading = ref(true);

onMounted(() => {
    loadProducts();
});

const loadProducts = async () => {
    loading.value = true;
    products.value = await ProdutoService.getProdutos();
    loading.value = false;
};

const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const editProduct = (prod) => {
    product.value = { ...prod };
    productDialog.value = true;
};

const confirmDeleteProduct = (prod) => {
    product.value = prod;
    deleteDialog.value = true;
};

const deleteProduct = async () => {
    await ProdutoService.deleteProduto(product.value.id);
    products.value = products.value.filter(val => val.id !== product.value.id);
    deleteDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto excluído', life: 3000 });
};

const saveProduct = async (prod) => {
    await ProdutoService.saveProduto(prod);
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto salvo', life: 3000 });
    productDialog.value = false;
    loadProducts();
};
</script>

<template>
    <div class="card">
        <Toolbar class="mb-4">
            <template #start>
                <Button label="Novo Produto" icon="pi pi-plus" class="mr-2" @click="openNew" />
            </template>
        </Toolbar>

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

        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle mr-3 text-4xl" />
                <span v-if="product">Tem certeza que deseja excluir <b>{{ product.nome }}</b>?</span>
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" text @click="deleteDialog = false" />
                <Button label="Sim" icon="pi pi-check" severity="danger" @click="deleteProduct" />
            </template>
        </Dialog>
    </div>
</template>
