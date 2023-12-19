<template>
    <div class="as-flex">

        <!-- iterator -->
        <v-card class="as-flex-item as-data-iterator animate__animated animate__fadeInBottomLeft">
            <v-overlay v-model="loading_data_iterator" contained class="d-flex align-center justify-center">
                <v-progress-circular color="green-accent-4 " indeterminate size="64"></v-progress-circular>
            </v-overlay>

            <v-data-iterator :items="data" :items-per-page="6" :search="search_item"
                :sort-by="[{ key: 'id', order: 'desc' }]">

                <template v-slot:header="{ page, pageCount, prevPage, nextPage }">

                    <div class="d-flex justify-space-between flex-wrap pa-2">
                        <v-text-field v-model="search_item" clearable density="comfortable" hide-details
                            placeholder="Buscar Registros" prepend-inner-icon="mdi-magnify" color="green-accent-4 "
                            class="pa-2" style="min-width: 300px;" />

                        <div class="d-flex align-center">
                            <v-tooltip text="Anterior">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" :disabled="page === 1" icon="mdi-arrow-left" density="comfortable"
                                        variant="elevated" color="green-accent-4 " @click="prevPage"></v-btn>
                                </template>
                            </v-tooltip>

                            <div class="mx-2 text-caption">
                                Pagina {{ page }} de {{ pageCount }}
                            </div>

                            <v-tooltip text="Siguiente">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" :disabled="page >= pageCount" icon="mdi-arrow-right"
                                        density="comfortable" variant="elevated" color="green-accent-4 "
                                        @click="nextPage"></v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                    </div>

                </template>

                <template v-slot:default="{ items }">
                    <div>
                        <v-container class="as-data-iterator-content" fluid>
                            <v-row justify="center">
                                <v-col v-for="(item, index) in items" :key="index" cols="auto" md="4">

                                    <v-card class="pa-3" variant="tonal" min-height="400px">
                                        <!-- sdf -->
                                        <v-sheet>
                                            <v-img :src="app.BASE_URL + item.raw.logo" height="150" />
                                            <div class="d-flex flex-column">
                                                <h2 class="text-h6">{{ item.raw.nombres }}</h2>
                                                <v-divider></v-divider>
                                                <p class="my-1 text-medium-emphasis">{{ item.raw.direccion }}</p>
                                                <v-divider></v-divider>
                                                <p class="my-1 text-medium-emphasis">{{ item.raw.descripcion }}</p>
                                                <v-divider></v-divider>
                                                <p class="my-1 text-medium-emphasis"
                                                    v-if="item.raw.correo_electronico == null || item.raw.correo_electronico == ''">
                                                    Sin correo electronico
                                                </p>
                                                <p class="my-1 text-medium-emphasis" v-else>
                                                    {{ item.raw.correo_electronico }}
                                                </p>
                                            </div>
                                        </v-sheet>

                                        <!-- dfgdfs -->
                                        <div class="d-flex justify-end px-4 flex-wrap">
                                            <div>
                                                <v-tooltip text="Editar registro.">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn v-bind="props" size="small" icon="mdi-pencil" color="success"
                                                            variant="elevated" class="ma-1" @click="editForm(item.raw)" />
                                                    </template>
                                                </v-tooltip>

                                                <v-tooltip text="Eliminar registro.">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn v-bind="props" size="small" icon="mdi-delete" color="red"
                                                            variant="elevated" class="ma-1"
                                                            @click="openDeleteItem(item.raw)" />
                                                    </template>
                                                </v-tooltip>
                                            </div>

                                        </div>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-container>
                    </div>
                </template>

            </v-data-iterator>
            <div class="as-data-iterator-content d-flex justify-center align-center" v-if="data.length == 0"
              >
                <h1 class="text-h6 text-red">No hay datos.</h1>
            </div>
            <div class="float-end">
                <v-btn color="green-accent-4 " variant="elevated" class="ma-1" @click="initDataIterator">
                    <v-icon icon="mdi-refresh" />&nbsp;Actualizar tablero
                </v-btn>
            </div>
        </v-card>
        <!-- iterator -->

        <FormDesarrolladora class="as-flex-item animate__animated animate__fadeInBottomRight"
            :p_item_desarrolladora="item_desarrolladora" @toLocalUpdateDataTable="localUpdateDataTable"
            @toNewForm="newForm" />

        <v-dialog v-model="dialog_delete" persistent transition="dialog-bottom-transition" max-width="500px">
            <v-card class="px-5 py-5">
                <v-card-text class="text-center">
                    <v-icon icon="mdi-trash-can-outline" size="100" color="red"
                        class="animate__animated animate__infinite animate__bounce"></v-icon>
                    <p class="text-h6">
                        ¿Esta seguro(a) de eliminar el registro seleccionado?
                    </p>

                </v-card-text>
                <v-card-actions>
                    <div class="d-flex justify-center" style="width: 100%;">
                        <v-btn color="red" variant="elevated" @click="closeDeleteItem" class="ma-1">
                            <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                        </v-btn>
                        <v-btn color="purple-darken-1" variant="elevated" class="ma-1" @click="confirmDeleteItem">
                            <v-icon icon="mdi-check-circle"></v-icon>&nbsp;Si
                        </v-btn>
                    </div>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>
    
<script setup>
import { ref, onMounted } from 'vue';
import Desarrolladora from '@/http/services/Desarrolladora';
import useToastify from '@/composables/useToastify';
import FormDesarrolladora from '@/components/desarrolladora/FormDesarrolladora.vue';
import app from '@/config/app';

const loading_data_iterator = ref(false);
const data = ref([]);
const item_desarrolladora = ref({});
const index_item = ref(-1);
const search_item = ref("");
const dialog_delete = ref(false);


const initDataIterator = () => {
    loading_data_iterator.value = true;
    setTimeout(async () => {
        const desarrolladora = new Desarrolladora();
        const respuesta = await desarrolladora.index();
        loading_data_iterator.value = false;
        if (respuesta.status) {
            data.value = respuesta.records;
            search_item.value = "";
        } else {
            useToastify('danger', respuesta.message);
        }
    }, 200)
}//initDataIterator

const clear = () => {
    item_desarrolladora.value = {};
    index_item.value = -1;
}

const openDeleteItem = (item) => {
    index_item.value = data.value.indexOf(item);
    //solo pasamos el id porque si nos se muestra en el formulario los datos
    item_desarrolladora.value = Object.assign({ id: item.id });
    dialog_delete.value = true;
}

const closeDeleteItem = () => {
    dialog_delete.value = false;
    clear();
}

const confirmDeleteItem = async () => {
    const cliente = new Desarrolladora(Object.assign({}, item_desarrolladora.value));
    const response = await cliente.destroy();
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
    const desarrolladora = new Desarrolladora();
    item_desarrolladora.value = Object.assign({}, desarrolladora.getAttributes());
}

const editForm = (item) => {
    item_desarrolladora.value = Object.assign({}, item);
    index_item.value = data.value.indexOf(item);
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
    newForm();
}


onMounted(() => {
    newForm();
    initDataIterator();
})

</script>
  

<style  scoped>
.as-flex {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    gap: 10px;
}

.as-flex .as-flex-item {
    flex-grow: 1;
    width: 600px;
}

/* ========================================
data iterator 
el valor height de as-data-iterator es +130 o +100 sobre el valor height de as-data-iterator-content
ejemplo: as-data-iterator-content =>height700px entonces as-data-iterator => height:130px+700px;
ejemplo2: as-data-iterator-content =>height700px entonces as-data-iterator => height:100px+700px;
========================================== */
.as-data-iterator {
    height: 830px;
}

.as-data-iterator-content {
    overflow: hidden;
    overflow-y: auto;
    height: 700px;
    border-top: 1px solid #c2c2c2;
    border-bottom: 1px solid #c2c2c2;
}

@media only screen and (max-width:500px) {
    .as-data-iterator {
        height: 860px;
    }
}
</style>