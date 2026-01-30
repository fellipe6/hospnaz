<script setup>
import { ProdutoService } from '@/service/almoxarifado/produto.mock';
import { onMounted, ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({
            tipo: 'SAIDA',
            quantidade: 1,
            data: new Date()
        })
    }
});

const emit = defineEmits(['update:modelValue', 'save', 'cancel']);

const produtos = ref([]);
const tipos = ref([
    { label: 'Entrada', value: 'ENTRADA' },
    { label: 'Saída', value: 'SAIDA' }
]);

const submitted = ref(false);

onMounted(() => {
    ProdutoService.getProdutos().then(data => produtos.value = data);
});

function save() {
    submitted.value = true;
    if (props.modelValue.produtoId && props.modelValue.quantidade > 0 && props.modelValue.responsavel) {
        emit('save', props.modelValue);
    }
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
                <label for="produto" class="block font-bold mb-2">Produto *</label>
                <Select id="produto" v-model="modelValue.produtoId" :options="produtos" optionLabel="nome" optionValue="id" placeholder="Selecione um produto" filter :invalid="submitted && !modelValue.produtoId" fluid>
                    <template #option="slotProps">
                        <div class="flex justify-between w-full">
                            <span>{{ slotProps.option.nome }}</span>
                            <span class="text-gray-500 text-sm">Estoque: {{ slotProps.option.estoqueAtual }}</span>
                        </div>
                    </template>
                </Select>
                <small v-if="submitted && !modelValue.produtoId" class="text-red-500">Produto é obrigatório.</small>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-6">
                <label for="tipo" class="block font-bold mb-2">Tipo de Movimentação *</label>
                <SelectButton v-model="modelValue.tipo" :options="tipos" optionLabel="label" optionValue="value" :invalid="submitted && !modelValue.tipo" />
            </div>
            <div class="col-span-6">
                <label for="quantidade" class="block font-bold mb-2">Quantidade *</label>
                <InputNumber id="quantidade" v-model="modelValue.quantidade" showButtons buttonLayout="horizontal" :min="1" :step="1" fluid :invalid="submitted && !modelValue.quantidade">
                    <template #incrementbuttonicon>
                        <span class="pi pi-plus" />
                    </template>
                    <template #decrementbuttonicon>
                        <span class="pi pi-minus" />
                    </template>
                </InputNumber>
                <small v-if="submitted && !modelValue.quantidade" class="text-red-500">Quantidade deve ser maior que 0.</small>
            </div>
        </div>

        <div class="field">
            <label for="responsavel" class="block font-bold mb-2">Responsável *</label>
            <InputText id="responsavel" v-model="modelValue.responsavel" placeholder="Quem retirou/recebeu?" fluid :invalid="submitted && !modelValue.responsavel" />
            <small v-if="submitted && !modelValue.responsavel" class="text-red-500">Responsável é obrigatório.</small>
        </div>

        <div class="field">
            <label for="observacao" class="block font-bold mb-2">Observação</label>
            <Textarea id="observacao" v-model="modelValue.observacao" rows="3" fluid />
        </div>
        
        <div class="flex justify-end gap-2 mt-4">
            <Button label="Cancelar" icon="pi pi-times" @click="$emit('cancel')" text />
            <Button label="Registrar Movimentação" icon="pi pi-check" @click="save" />
        </div>
    </div>
</template>
