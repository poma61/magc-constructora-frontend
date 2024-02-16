<template>
    <div v-if="v_select_desarrolladora_enable">
        <v-select label="Desarrolladoras" v-model="selected_desarrolladora" :items="list_desarrolladora"
            color="purple-darken-1" @update:model-value="loadDataTable" />
    </div>
    <div class="my-6" v-else>
        <div class="d-flex">
            <p class="px-1 text-h6"> Desarrolladora: </p>
            <p class="px-1 text-h6 text-secondary">{{ selected_desarrolladora }}</p>
        </div>
        <v-divider class="border-opacity-25 my-2"></v-divider>
    </div>

    <div class="d-flex">
        <div class="d-flex flex-column">
            <v-tooltip text="Actualizar tablero">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="amber-darken-3" variant="elevated" class="ma-1" @click="loadDataTable()"
                        icon="mdi-table-refresh" />
                </template>
            </v-tooltip>
            <v-tooltip text="Nuevo cliente">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="amber-darken-3" variant="elevated" class="ma-1" @click="newForm"
                        icon="mdi-text-box-plus-outline" />
                </template>
            </v-tooltip>
        </div>

        <v-card class="my-2 flex-grow-1">
            <v-text-field v-model="search_data" append-inner-icon="mdi-magnify" clearable label="Buscar Registros..."
                color="amber-darken-3" />
            <!-- table  item-value="id" es para elegir la clave unica para cada fila de la tabla  -->
            <v-data-table :hover="true" :items="data" item-value="id" :headers="columns" :search="search_data"
                :loading="loading_data_table" :items-per-page-options="items_per_page_options" :show-current-page="true"
                :fixed-header="true" :height="600" :sort-by="[{ key: 'id', order: 'desc' }]">
                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@13"></v-skeleton-loader>
                </template>

                <template v-slot:item.actions="{ item }">
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn color="purple-darken-1" v-bind="props" class="ma-2">
                                <v-icon icon="mdi-dots-horizontal" />
                            </v-btn>
                        </template>
                        <v-list bg-color="purple-lighten-5">
                            <v-list-item @click="editForm(item)">
                                <v-list-item-title>
                                    <v-icon icon="mdi-pencil" color="purple-darken-1"></v-icon>&nbsp;Editar
                                </v-list-item-title>

                            </v-list-item>
                            <v-list-item @click="openDeleteData(item)">
                                <v-list-item-title>
                                    <v-icon icon="mdi-delete" color="red"></v-icon>&nbsp;Eliminar
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                </template>

                <template v-slot:item.correo_electronico="{ item }">
                    <p class="text-warning" v-if="item.correo_electronico == null || item.correo_electronico == ''">
                        Sin correo electronico!
                    </p>
                    <p v-else>
                        {{ item.correo_electronico }}
                    </p>
                </template>

                <template v-slot:item.descripcion="{ item }">
                    <p class="text-warning" v-if="item.descripcion == null || item.descripcion == ''">
                        Sin descripcion!
                    </p>
                    <p v-else>
                        {{ item.descripcion }}
                    </p>
                </template>

            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog_form" persistent max-width="900px" scrollable>
            <FormCliente :p_item_cliente="item_cliente" @toCloseForm="closeForm" @toUpdateDataTable="updateDataTable"
                :p_selected_desarrolladora="selected_desarrolladora" />
        </v-dialog>

    </div>
    <v-dialog v-model="dialog_delete" persistent max-width="500px">
        <v-card class="animate__animated animate__bounceInRight pa-5">
            <v-card-text class="text-center">
                <v-icon icon="mdi-trash-can-outline" size="100" color="red"
                    class="animate__animated animate__infinite animate__bounce"></v-icon>
                <p class="text-h6">
                    ¿Esta seguro(a) de eliminar este registro?
                </p>
            </v-card-text>
            <v-card-actions>
                <div class="d-flex justify-center" style="width: 100%;">
                    <v-btn color="red" variant="elevated" @click="closeDeleteData" class="ma-1">
                        <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                    </v-btn>
                    <v-btn color="purple-darken-1" variant="elevated" class="ma-1" @click="confirmDeleteData()">
                        <v-icon icon="mdi-check-circle"></v-icon>&nbsp;Si
                    </v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
import FormCliente from '@/components/cliente/FormCliente.vue';
import Cliente from '@/http/services/Cliente';
import { onMounted } from 'vue';
import { ref } from 'vue';
import useToastify from '@/composables/useToastify';
import Desarrolladora from '@/http/services/Desarrolladora';
import useUserByDesarrolladora from '@/composables/useUserByDesarrolladora';

const index_data_item = ref(-1);
const dialog_delete = ref(false);
const dialog_form = ref(false);
const item_cliente = ref({});
const search_data = ref("");
const loading_data_table = ref(null);
const list_desarrolladora = ref([]);
const selected_desarrolladora = ref("");
const items_per_page_options = ref([
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
]);
const v_select_desarrolladora_enable = ref("");
const columns = ref([
    { title: 'Nombres', key: 'nombres', },
    { title: 'Apellido paterno', key: 'apellido_paterno' },
    { title: 'Apellido materno', key: 'apellido_materno' },
    { title: 'N° de contacto', key: 'n_de_contacto' },
    { title: 'Correo Electronico', key: 'correo_electronico' },
    { title: 'C.I.', key: 'ci_unido', value: (item) => { return ` ${item.ci} ${item.ci_expedido} ` } },
    { title: 'Direccion', key: 'direccion', },
    { title: 'Descripcion', key: 'descripcion', },
    { title: 'Acciones', key: 'actions', },
]);
const data = ref([]);
//methods

const listDesarrolladora = async () => {
    const desarrolladora = new Desarrolladora();
    const response = await desarrolladora.index();
    if (response.status) {
        const all_desarrolladora = response.records;
        list_desarrolladora.value = all_desarrolladora.map(item => item.nombres);
    } else {
        useToastify('danger', response.message);
    }
}

const loadDataTable = () => {
    const cliente = new Cliente(selected_desarrolladora.value);
    loading_data_table.value = 'amber-darken-3';
    setTimeout(async () => {
        const response = await cliente.index();
        loading_data_table.value = null;
        if (response.status) {
            data.value = response.records;
        } else {
            useToastify('danger', response.message);
        }
    }, 200);
}//loadDataTable

const clear = () => {
    item_cliente.value = {};
    index_data_item.value = -1;
}

const openDeleteData = (item) => {
    item_cliente.value = Object.assign({}, item);
    index_data_item.value = data.value.indexOf(item);
    dialog_delete.value = true;
}

const closeDeleteData = () => {
    clear();
    dialog_delete.value = false;
}
const closeForm = () => {
    clear();
    dialog_form.value = false;
}

const confirmDeleteData = async () => {
    const cliente = new Cliente(selected_desarrolladora.value, Object.assign({}, item_cliente.value));
    const response = await cliente.destroy();
    if (response.status) {
        data.value.splice(index_data_item.value, 1);
        useToastify('success', response.message);
    } else {
        useToastify('danger', response.message)
    }
    closeDeleteData();
}


const newForm = () => {
    const cliente = new Cliente();
    item_cliente.value = Object.assign({}, cliente.getAttributes());
    dialog_form.value = true;
}

const editForm = (item) => {
    item_cliente.value = Object.assign({}, item);
    index_data_item.value = data.value.indexOf(item);
    dialog_form.value = true;
}

const updateDataTable = (type, item) => {
    switch (type) {
        case 'new':
            data.value.push(Object.assign({}, item));
            break;
        case 'edit':
            Object.assign(data.value[index_data_item.value], item);
            break;

        default:
            useToastify('danger', 'No se puede reconocer la accion al registrar.');
            break;
    }
}

onMounted(async () => {
    //esta parte es para desabilitar el v-select de la desarrolladora segun el rol que tiene el usuario
    // y ademas se asigna la desarrolladora que le corresponde al usuario
    const response = await useUserByDesarrolladora();
    v_select_desarrolladora_enable.value = response.enable;
    selected_desarrolladora.value = response.desarrolladora;
    if (response.enable) {
        await listDesarrolladora();
    }
    loadDataTable();
});
</script>
