<template>

    <div class="animate__animated animate__backInDown d-flex flex-wrap">
        <v-select style="min-width: 300px;" label="Desarrolladoras" v-model="selected_desarrolladora"
            :items="list_desarrolladora" class="ma-1" color="yellow-darken-2" @update:model-value="changeDataTable" />

        <v-btn color="yellow-darken-2" variant="elevated" class="ma-1" @click="showDataTable">
            <v-icon icon="mdi-list-box-outline" />&nbsp;Tabla
        </v-btn>

        <v-btn color="yellow-darken-2" variant="elevated" class="ma-1" @click="changeDataTable">
            <v-icon icon="mdi-refresh" />
        </v-btn>

        <v-btn color="yellow-darken-2" variant="elevated" class="ma-1" @click="newForm">
            <v-icon icon="mdi-note-plus" />&nbsp;Nuevo personal
        </v-btn>

        <v-btn color="yellow-darken-2" variant="elevated" class="ma-1" @click="clearForm"
            :disabled="(index_item == -1 && component_visible.form) ? false : true">
            <v-icon icon="mdi-delete-sweep-outline" />
        </v-btn>
    </div>

    <v-card v-if="component_visible.table"  class="animate__animated animate__backInDown">
        <v-text-field v-model="buscar_data_table" append-inner-icon="mdi-magnify" clearable label="Buscar Registros..."
            color="yellow-darken-2" />
        <v-data-table :hover="true" :items="data" :headers="columns" :search="buscar_data_table"
            :loading="loading_data_table" :items-per-page-options="items_per_page_options" :show-current-page="true"
            :fixed-header="true" :height="600" :sort-by="[{ key: 'id', order: 'desc' }]">

            <template v-slot:loading>
                <v-skeleton-loader type="table-row@12"></v-skeleton-loader>
            </template>

            <template v-slot:item.actions="{ item }">
                <div style="width: 150px;">
                    <v-btn @click="editForm(item)" color="light-blue-lighten-1" class="ma-1" variant="elevated">
                        <span class="mdi mdi-pencil is-size-5"></span>
                    </v-btn>
                    <v-btn @click="openDeleteData(item)" color="red" class="ma-1" variant="elevated">
                        <span class="mdi mdi-delete is-size-5"></span>
                    </v-btn>
                </div>
            </template>

            <template v-slot:item.foto="{ item }">
                <v-avatar :image="app.BASE_URL + item.foto" size="64" class="ma-2" />
            </template>
            <template v-slot:item.correo_electronico="{ item }">
                <p class="text-warning" v-if="item.correo_electronico == null || item.correo_electronico == ''">
                    Sin correo electronico!
                </p>
                <p v-else>
                    {{ item.correo_electronico }}
                </p>
            </template>

        </v-data-table>
    </v-card>

    <FormPersonal :p_item_personal="item_personal" @toNewForm="newForm" :p_selected_desarrolladora="selected_desarrolladora"
        v-if="component_visible.form" @toLocalUpdateDataTable="localUpdateDataTable" />

    <v-dialog v-model="dialog_delete" persistent transition="dialog-bottom-transition" max-width="500px">
        <v-card class="px-5 py-5">
            <v-card-text class="text-center">
                <v-icon icon="mdi mdi-trash-can-outline" size="100" color="red"
                    class="animate__animated animate__infinite animate__bounce"></v-icon>

            </v-card-text>
            <p class="text-h6 text-center">
                ¿Esta seguro(a) de eliminar este registro?
            </p>

            <div class="d-flex justify-center">
                <v-btn color="red" variant="elevated" @click="closeDeleteItem" class="ma-1">
                    <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                </v-btn>
                <v-btn color="light-blue-lighten-1" variant="elevated" class="ma-1" @click="confirmDeleteData()">
                    <v-icon icon="mdi-check-bold"></v-icon>&nbsp;Aceptar
                </v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>
<script setup>
import FormPersonal from '@/components/personal/FormPersonal.vue';
import Personal from '@/http/services/Personal';
import { onMounted } from 'vue';
import { ref } from 'vue';
import useToastify from '@/composables/useToastify';
import app from '@/config/app';
import Desarrolladora from '@/http/services/Desarrolladora';

const index_item = ref(-1);
const component_visible = ref({
    table: false,
    form: false,
});
const dialog_delete = ref(false);
const item_personal = ref({});
const fields_errors = ref({});
const list_desarrolladora = ref([]);
const selected_desarrolladora = ref("");
const buscar_data_table = ref("");
const loading_data_table = ref(null);
const items_per_page_options = ref([
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
    { value: 100, title: '100' },
]);
const columns = ref([
    { title: 'Nombres', key: 'nombres' },
    { title: 'Apellido paterno', key: 'apellido_paterno' },
    { title: 'Apellido materno', key: 'apellido_materno' },
    { title: 'Cargo', key: 'cargo' },
    { title: 'CI', key: 'ci' },
    { title: 'N° de contacto', key: 'n_de_contacto' },
    { title: 'Direccion', key: 'direccion' },
    { title: 'Correo electronico', key: 'correo_electronico' },
    { title: 'Foto', key: 'foto', align: 'center' },
    { title: 'Acciones', key: 'actions', align: 'center' },
]);
const data = ref([]);

const listDesarrolladora = async () => {
    const desarrolladora = new Desarrolladora();
    const response = await desarrolladora.index();
    if (response.status) {
        const sucursal_all = response.records;
        list_desarrolladora.value = sucursal_all.map(item => item.nombres);
        selected_desarrolladora.value = list_desarrolladora.value[0];
    } else {
        useToastify('danger', response.message);
    }
}

//methods
const changeDataTable = () => {
    const personal = new Personal(selected_desarrolladora.value);
    loading_data_table.value = 'yellow-darken-2';
    setTimeout(async () => {
        const response = await personal.index();
        loading_data_table.value = null;
        if (response.status) {
            data.value = response.records;
        } else {
            useToastify('danger', response.message);
        }
    }, 400);
}//changeDataTable
const clear = () => {
    item_personal.value = {};
    index_item.value = -1;
    fields_errors.value = {};
}
const showDataTable = () => {
    component_visible.value.table = true;
    component_visible.value.form = false;
}
const showForm = () => {
    component_visible.value.form = true;
    component_visible.value.table = false;
}
const openDeleteData = (item) => {
    item_personal.value = Object.assign({}, item);
    index_item.value = data.value.indexOf(item);
    dialog_delete.value = true;
}
const closeDeleteItem = () => {
    clear();
    dialog_delete.value = false;
}
const confirmDeleteData = async () => {
    const personal = new Personal(selected_desarrolladora.value, item_personal.value);
    const response = await personal.destroy();
    if (response.status) {
        data.value.splice(index_item.value, 1);
        useToastify('success', response.message);
    } else {
        useToastify('danger', response.message)
    }
    closeDeleteItem();
}
const newForm = () => {
    clear();
    const personal = new Personal();
    item_personal.value = Object.assign({}, personal.getAttributes());
    showForm();
}
const clearForm = () => {
    clear();
    const personal = new Personal();
    item_personal.value = Object.assign({}, personal.getAttributes());
}

const editForm = (item) => {
    clear();
    item_personal.value = Object.assign({}, item);
    index_item.value = data.value.indexOf(item);
    showForm();
}

const localUpdateDataTable = (type, item) => {
    switch (type) {
        case 'new':
            data.value.push(Object.assign({}, item));
            break;
        case 'edit':
            Object.assign(data.value[index_item.value], item);
            break;
        default:
            useToastify('danger', 'No se puede reconocer la accion al registrar.');
            break;
    }
}

onMounted(async () => {
    await listDesarrolladora();
    changeDataTable();
    showDataTable();
});
</script>
