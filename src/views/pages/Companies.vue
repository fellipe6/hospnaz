<script setup>
import { CompanyService } from '@/service/CompanyService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(() => {
    CompanyService.getCompanies().then((data) => (companies.value = data));
});

const toast = useToast();
const dt = ref();
const companies = ref();
const companyDialog = ref(false);
const deleteCompanyDialog = ref(false);
const deleteCompaniesDialog = ref(false);
const company = ref({});
const selectedCompanies = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const statuses = ref([
    { label: 'Ativo', value: 'active' },
    { label: 'Inativo', value: 'inactive' }
]);

const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

function openNew() {
    company.value = {
        address: {}
    };
    submitted.value = false;
    companyDialog.value = true;
}

function hideDialog() {
    companyDialog.value = false;
    submitted.value = false;
}

function saveCompany() {
    submitted.value = true;

    if (company?.value.name?.trim() && company?.value.cnpj?.trim()) {
        if (company.value.id) {
            company.value.status = company.value.status.value ? company.value.status.value : company.value.status;
            companies.value[findIndexById(company.value.id)] = company.value;
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Empresa Atualizada', life: 3000 });
        } else {
            company.value.id = createId();
            company.value.status = company.value.status ? company.value.status.value : 'active';
            companies.value.push(company.value);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Empresa Cadastrada', life: 3000 });
        }

        companyDialog.value = false;
        company.value = {};
    }
}

function editCompany(comp) {
    company.value = { ...comp };
    companyDialog.value = true;
}

function confirmDeleteCompany(comp) {
    company.value = comp;
    deleteCompanyDialog.value = true;
}

function deleteCompany() {
    companies.value = companies.value.filter((val) => val.id !== company.value.id);
    deleteCompanyDialog.value = false;
    company.value = {};
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Empresa Excluída', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < companies.value.length; i++) {
        if (companies.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

function createId() {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function exportCSV() {
    dt.value.exportCSV();
}

function confirmDeleteSelected() {
    deleteCompaniesDialog.value = true;
}

function deleteSelectedCompanies() {
    companies.value = companies.value.filter((val) => !selectedCompanies.value.includes(val));
    deleteCompaniesDialog.value = false;
    selectedCompanies.value = null;
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Empresas Excluídas', life: 3000 });
}

function getStatusLabel(status) {
    switch (status) {
        case 'active':
            return 'success';
        case 'inactive':
            return 'danger';
        default:
            return null;
    }
}

function getStatusText(status) {
    switch (status) {
        case 'active':
            return 'Ativo';
        case 'inactive':
            return 'Inativo';
        default:
            return status;
    }
}

function applyCnpjMask(value) {
    if (!value) return '';
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
    return value;
}

function applyPhoneMask(value) {
    if (!value) return '';
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    return value;
}

function applyZipMask(value) {
    if (!value) return '';
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    return value;
}

// Implementação com JSONP por conta de CORS do ReceitaWS
function jsonp(url) {
    return new Promise((resolve, reject) => {
        const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(data);
        };

        const script = document.createElement('script');
        script.src = `${url}?callback=${callbackName}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            reject(new Error('Request failed'));
        };
        document.body.appendChild(script);
    });
}

async function fetchCompanyByCnpj() {
    const cnpj = company.value.cnpj?.replace(/\D/g, '');
    
    if (!cnpj || cnpj.length !== 14) {
        return;
    }

    try {
        toast.add({ severity: 'info', summary: 'Buscando', detail: 'Consultando Receita Federal...', life: 2000 });
        
        // Uso de JSONP para evitar CORS no endpoint gratuito
        const data = await jsonp(`https://receitaws.com.br/v1/cnpj/${cnpj}`);

        if (data.status === 'ERROR') {
             toast.add({ 
                severity: 'warn', 
                summary: 'Não encontrado', 
                detail: data.message || 'CNPJ não encontrado na base.', 
                life: 3000 
            });
            return;
        }

        // Popula os dados
        company.value = {
            ...company.value,
            name: data.nome,
            fantasyName: data.fantasia,
            email: data.email,
            phone: data.telefone,
            address: {
                ...company.value.address,
                street: data.logradouro,
                number: data.numero,
                complement: data.complemento,
                city: data.municipio,
                state: data.uf,
                zip: data.cep?.replace('.', '') || ''
            }
        };

        toast.add({ 
            severity: 'success', 
            summary: 'Sucesso', 
            detail: 'Dados da empresa carregados!', 
            life: 3000 
        });

    } catch (error) {
        console.error(error);
        toast.add({ 
            severity: 'error', 
            summary: 'Erro', 
            detail: 'Não foi possível buscar a empresa.', 
            life: 3000 
        });
    }
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Nova Empresa" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Excluir" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedCompanies || !selectedCompanies.length" />
                </template>

                <template #end>
                    <Button label="Exportar" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedCompanies"
                :value="companies"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} empresas"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Gerenciar Empresas</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="name" header="Razão Social" sortable style="min-width: 16rem"></Column>
                <Column field="fantasyName" header="Nome Fantasia" sortable style="min-width: 14rem"></Column>
                <Column field="cnpj" header="CNPJ" sortable style="min-width: 12rem"></Column>
                <Column field="phone" header="Telefone" sortable style="min-width: 12rem"></Column>
                <Column field="email" header="Email" sortable style="min-width: 14rem"></Column>
                <Column field="status" header="Status" sortable style="min-width: 10rem">
                    <template #body="slotProps">
                        <Tag :value="getStatusText(slotProps.data.status)" :severity="getStatusLabel(slotProps.data.status)" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCompany(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCompany(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="companyDialog" :style="{ width: '850px' }" header="Dados da Empresa" :modal="true">
            <div class="flex flex-col gap-6">
                
                <!-- CNPJ FIELD FIRST FOR AUTOCOMPLETE -->
                <div>
                    <label for="cnpj" class="block font-bold mb-3">CNPJ * (Busca Automática)</label>
                    <InputText 
                        id="cnpj" 
                        v-model="company.cnpj" 
                        @input="company.cnpj = applyCnpjMask($event.target.value)"
                        @blur="fetchCompanyByCnpj"
                        required="true" 
                        :invalid="submitted && !company.cnpj" 
                        placeholder="00.000.000/0000-00"
                        autofocus
                        fluid 
                    />
                    <small v-if="submitted && !company.cnpj" class="text-red-500">CNPJ é obrigatório.</small>
                    <small class="text-gray-500 block mt-1">Digite o CNPJ e pressione TAB para buscar os dados.</small>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="name" class="block font-bold mb-3">Razão Social *</label>
                        <InputText id="name" v-model.trim="company.name" required="true" :invalid="submitted && !company.name" fluid />
                        <small v-if="submitted && !company.name" class="text-red-500">Razão Social é obrigatória.</small>
                    </div>
                    <div class="col-span-6">
                        <label for="fantasyName" class="block font-bold mb-3">Nome Fantasia</label>
                        <InputText id="fantasyName" v-model.trim="company.fantasyName" fluid />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="phone" class="block font-bold mb-3">Telefone</label>
                        <InputText 
                            id="phone" 
                            v-model="company.phone"
                            @input="company.phone = applyPhoneMask($event.target.value)"
                            placeholder="(00) 0000-0000"
                            fluid 
                        />
                    </div>
                    <div class="col-span-6">
                        <label for="email" class="block font-bold mb-3">Email</label>
                        <InputText id="email" v-model="company.email" type="email" fluid />
                    </div>
                </div>

                <div>
                    <label for="status" class="block font-bold mb-3">Status</label>
                    <Select id="status" v-model="company.status" :options="statuses" optionLabel="label" placeholder="Selecione um Status" fluid></Select>
                </div>

                <div class="border-t pt-4">
                    <h5 class="mb-4">Endereço (Preenchido automaticamente)</h5>
                    
                    <div class="mb-4">
                        <label for="zip" class="block font-bold mb-3">CEP</label>
                        <InputText 
                            id="zip" 
                            v-model="company.address.zip"
                            @input="company.address.zip = applyZipMask($event.target.value)"
                            placeholder="00000-000"
                            fluid 
                        />
                    </div>

                    <div class="grid grid-cols-12 gap-4 mb-4">
                        <div class="col-span-8">
                            <label for="street" class="block font-bold mb-3">Logradouro</label>
                            <InputText id="street" v-model="company.address.street" fluid />
                        </div>
                        <div class="col-span-4">
                            <label for="number" class="block font-bold mb-3">Número</label>
                            <InputText id="number" v-model="company.address.number" fluid />
                        </div>
                    </div>

                    <div class="mb-4">
                        <label for="complement" class="block font-bold mb-3">Complemento</label>
                        <InputText id="complement" v-model="company.address.complement" fluid />
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-8">
                            <label for="city" class="block font-bold mb-3">Município</label>
                            <InputText id="city" v-model="company.address.city" fluid />
                        </div>
                        <div class="col-span-4">
                            <label for="state" class="block font-bold mb-3">UF</label>
                            <Select id="state" v-model="company.address.state" :options="brazilianStates" placeholder="UF" fluid></Select>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Salvar" icon="pi pi-check" @click="saveCompany" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteCompanyDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle text-3xl!" />
                <span v-if="company"
                    >Tem certeza que deseja excluir <b>{{ company.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" text @click="deleteCompanyDialog = false" />
                <Button label="Sim" icon="pi pi-check" @click="deleteCompany" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteCompaniesDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle text-3xl!" />
                <span v-if="company">Tem certeza que deseja excluir as empresas selecionadas?</span>
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" text @click="deleteCompaniesDialog = false" />
                <Button label="Sim" icon="pi pi-check" text @click="deleteSelectedCompanies" />
            </template>
        </Dialog>
    </div>
</template>
