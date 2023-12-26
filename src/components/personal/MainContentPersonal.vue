<template>
    <div class="d-flex flex-wrap">
       <v-select style="min-width: 300px;" label="Sucursales" v-model="current_sucursal" :items="list_sucursal"
           class="ma-1" color="amber-darken-3" @update:model-value="toData" />

       <v-btn color="amber-darken-3" variant="elevated" class="ma-1" @click="showDataTable">
           <v-icon icon="mdi-list-box-outline" />&nbsp;Tabla
       </v-btn>

       <v-btn color="amber-darken-3" variant="elevated" class="ma-1" @click="toData">
           <v-icon icon="mdi-refresh" />
       </v-btn>

       <v-btn color="amber-darken-3" variant="elevated" class="ma-1" @click="newForm">
           <v-icon icon="mdi-note-plus" />&nbsp;Nuevo personal
       </v-btn>

       <v-btn color="amber-darken-3" variant="elevated" class="ma-1" @click="clearForm"
           :disabled="(index_data_item == -1 && component_visible.form) ? false : true">
           <v-icon icon="mdi-delete-sweep-outline" />
       </v-btn>

   </div>

   <v-card v-if="component_visible.table">
       <v-text-field v-model="buscar_data_table" append-inner-icon="mdi-magnify" clearable label="Buscar Registros..."
           color="amber-darken-3" />
       <v-data-table :hover="true" :items="data" :headers="columns" :search="buscar_data_table"
           :loading="loading_data_table" :items-per-page-options="items_per_page_options" :show-current-page="true"
           :fixed-header="true" :height="600" :sort-by="[{ key: 'id', order: 'desc' }]">

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
       </v-data-table>
   </v-card>

   <FormPersonal :p_item_personal="item_personal" :p_fields_errors="fields_errors" @toSave="save"
       :p_current_sucursal="current_sucursal" v-if="component_visible.form" />

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
               <v-btn color="red" variant="elevated" @click="closeDeleteData" class="ma-1">
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
import Sucursal from '@/http/services/Sucursal';
import { onMounted } from 'vue';
import { ref } from 'vue';
import useToastify from '@/composables/useToastify';
import app from '@/config/app';

const index_data_item = ref(-1);
const component_visible = ref({
table: false,
form: false,
});
const dialog_delete = ref(false);
const item_personal = ref({});
const fields_errors = ref({});
const list_sucursal = ref([]);
const current_sucursal = ref("");
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
{ title: 'N° de contacto', key: 'n_contacto' },
{ title: 'Direccion', key: 'direccion' },
{ title: 'Correo electronico', key: 'email' },
{ title: 'Foto', key: 'foto', align: 'center' },
{ title: 'Acciones', key: 'actions', align: 'center' },
]);
const data = ref([]);

const listSucursal = async () => {
const sucursal = new Sucursal();
const response = await sucursal.index();
if (response.status) {
   const sucursal_all = response.records;
   list_sucursal.value = sucursal_all.map(item => item.nombres);
   current_sucursal.value = list_sucursal.value[0];
} else {
   useToastify('danger', response.message);
}
}

//methods
const toData = () => {
const personal = new Personal(current_sucursal.value);
loading_data_table.value = 'amber-darken-3';
setTimeout(async () => {
   const response = await personal.index();
   loading_data_table.value = null;
   if (response.status) {
       data.value = response.records;
       useToastify('success', response.message);
   } else {
       useToastify('danger', response.message);
   }
}, 800);
}//toData

const clear = () => {
item_personal.value = {};
index_data_item.value = -1;
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
index_data_item.value = data.value.indexOf(item);
dialog_delete.value = true;
}

const closeDeleteData = () => {
clear();
dialog_delete.value = false;
}

const confirmDeleteData = async () => {
const personal = new Personal(current_sucursal.value, item_personal.value);
const response = await personal.destroy();
if (response.status) {
   data.value.splice(index_data_item.value, 1);
   useToastify('success', response.message);
} else {
   useToastify('danger', response.message)
}
closeDeleteData();
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
index_data_item.value = data.value.indexOf(item);
showForm();
}


const save = async (item) => {
const personal = new Personal(current_sucursal.value, Object.assign({}, item));
if (personal.getAttributes().id > 0) {
   //cuando es update
   const response = await personal.update();
   if (response.status) {
       Object.assign(data.value[index_data_item.value], response.record);
       useToastify('success', response.message);
   } else {
       if (response.message_errors != undefined) {
           fields_errors.value = Object.assign({}, response.message_errors);
       }
       useToastify('danger', response.message);
   }

} else {
   //cuando es create
   const response = await personal.store();
   if (response.status) {
       data.value.push(Object.assign({}, response.record));
       useToastify('success', response.message);
       newForm();
   } else {
       if (response.message_errors != undefined) {
           fields_errors.value = Object.assign({}, response.message_errors);
       }
       useToastify('danger', response.message);
   }
}

}

onMounted(async () => {
await listSucursal();
toData();
showDataTable();
});
</script>
