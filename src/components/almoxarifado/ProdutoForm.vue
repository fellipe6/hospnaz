<script setup>
import { FornecedorService } from '@/service/almoxarifado/fornecedor.mock';
import { onMounted, ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['update:modelValue', 'save', 'cancel']);

const fornecedores = ref([]);
const categories = ref([
    { label: 'Medicamentos', value: 'Medicamentos' },
    { label: 'Material Hospitalar', value: 'Material Hospitalar' },
    { label: 'Equipamentos', value: 'Equipamentos' },
    { label: 'Higiene e Limpeza', value: 'Higiene e Limpeza' },
    { label: 'EPI', value: 'EPI' }
]);

const unidades = ref([
    { label: 'Caixa (cx)', value: 'cx' },
    { label: 'Unidade (un)', value: 'un' },
    { label: 'Pacote (pct)', value: 'pct' },
    { label: 'Frasco (fr)', value: 'fr' }
]);

const submitted = ref(false);

onMounted(() => {
    FornecedorService.getFornecedores().then(data => fornecedores.value = data);
});

function save() {
    submitted.value = true;
    if (props.modelValue.nome && props.modelValue.codigo) {
        emit('save', props.modelValue);
    }
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4">
                <label for="codigo" class="block font-bold mb-2">Código *</label>
                <InputText id="codigo" v-model.trim="modelValue.codigo" required="true" autofocus :invalid="submitted && !modelValue.codigo" fluid />
                <small v-if="submitted && !modelValue.codigo" class="text-red-500">Código é obrigatório.</small>
            </div>
            <div class="col-span-8">
                <label for="nome" class="block font-bold mb-2">Nome do Produto *</label>
                <InputText id="nome" v-model.trim="modelValue.nome" required="true" :invalid="submitted && !modelValue.nome" fluid />
                <small v-if="submitted && !modelValue.nome" class="text-red-500">Nome é obrigatório.</small>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-6">
                <label for="categoria" class="block font-bold mb-2">Categoria</label>
                <Select id="categoria" v-model="modelValue.categoria" :options="categories" optionLabel="label" optionValue="value" placeholder="Selecione" fluid />
            </div>
            <div class="col-span-6">
                <label for="unidade" class="block font-bold mb-2">Unidade</label>
                <Select id="unidade" v-model="modelValue.unidade" :options="unidades" optionLabel="label" optionValue="value" placeholder="Selecione" fluid />
            </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-6">
                <label for="estoqueMinimo" class="block font-bold mb-2">Estoque Mínimo</label>
                <InputNumber id="estoqueMinimo" v-model="modelValue.estoqueMinimo" integeronly min="0" fluid />
            </div>
            <div class="col-span-6">
                <label for="estoqueAtual" class="block font-bold mb-2">Estoque Inicial</label>
                <InputNumber id="estoqueAtual" v-model="modelValue.estoqueAtual" integeronly min="0" :disabled="!!modelValue.id" fluid />
                <small v-if="modelValue.id" class="text-gray-500">Para alterar, use Movimentações.</small>
            </div>
        </div>

        <div class="field">
            <label for="fornecedor" class="block font-bold mb-2">Fornecedor Principal</label>
            <Select id="fornecedor" v-model="modelValue.fornecedorId" :options="fornecedores" optionLabel="nome" optionValue="id" placeholder="Selecione um fornecedor" filter fluid />
        </div>
        
        <div class="flex justify-end gap-2 mt-4">
            <Button label="Cancelar" icon="pi pi-times" @click="$emit('cancel')" text />
            <Button label="Salvar" icon="pi pi-check" @click="save" />
        </div>
    </div>
</template>
