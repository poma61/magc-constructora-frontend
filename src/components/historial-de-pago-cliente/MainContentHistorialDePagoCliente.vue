<template>
    <div class="d-flex flex-wrap justify-end">
        <v-select label="Desarrolladoras" v-model="selected_desarrolladora" :items="list_desarrolladora"
            color="purple-darken-1" @update:model-value="loadDataTable" style="min-width: 300px;" class="ma-1" />

        <v-btn color="orange-darken-1" variant="elevated" class="ma-1" @click="loadDataTable">
            <v-icon icon="mdi-refresh" />&nbsp;Actualizar datos
        </v-btn>
    </div>

    <!-- iterator -->
    <v-card class="as-flex-item as-data-iterator animate__animated animate__fadeInBottomLeft">
        <v-overlay v-model="loading_data_iterator" contained class="d-flex align-center justify-center">
            <v-progress-circular color="orange-darken-1 " indeterminate size="64"></v-progress-circular>
        </v-overlay>

        <v-data-iterator :items="data" :items-per-page="12" :search="search_item" :sort-by="[{ key: 'id', order: 'desc' }]">

            <template v-slot:header="{ page, pageCount, prevPage, nextPage }">

                <div class="d-flex justify-space-between flex-wrap pa-2">
                    <v-text-field v-model="search_item" clearable density="comfortable" hide-details
                        placeholder="Buscar Registros" prepend-inner-icon="mdi-magnify" color="orange-darken-1 "
                        class="pa-2" style="min-width: 300px;" />

                    <div class="d-flex align-center">
                        <v-tooltip text="Anterior">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" :disabled="page === 1" icon="mdi-arrow-left" density="comfortable"
                                    variant="elevated" color="orange-darken-1 " @click="prevPage"></v-btn>
                            </template>
                        </v-tooltip>

                        <div class="mx-2 text-caption">
                            Pagina {{ page }} de {{ pageCount }}
                        </div>

                        <v-tooltip text="Siguiente">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" :disabled="page >= pageCount" icon="mdi-arrow-right"
                                    density="comfortable" variant="elevated" color="orange-darken-1 "
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
                            <v-col v-for="(item, index) in items" :key="index" cols="auto" md="3">
                                <v-card class="pa-3" color="cyan-darken-1" variant="tonal">
                                    <v-list-item class="">
                                        <template v-slot:title>
                                            <strong>
                                                {{ item.raw.nombres }} {{ item.raw.apellido_paterno }} {{
                                                    item.raw.apellido_materno }}
                                            </strong>
                                        </template>

                                        <template v-slot:subtitle>
                                            <strong class="text-subtitle-2 text-light-blue-darken-3">
                                                {{ item.raw.email }}
                                            </strong>
                                        </template>
                                    </v-list-item>

                                    <div class="d-flex justify-space-between px-4">
                                        <p class="text-subtitle-2 text-light-blue-darken-3">
                                            Pagos realizados: {{ item.raw.total_pagos }}
                                        </p>
                                        <v-tooltip text="Ver pagos realizados.">
                                            <template v-slot:activator="{ props }">
                                                <v-btn v-bind="props" color="light-blue-darken-3" variant="outlined">
                                                    <v-icon icon="mdi-account-credit-card" />
                                                </v-btn>
                                            </template>
                                        </v-tooltip>



                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </div>
            </template>

        </v-data-iterator>
        <div class="as-data-iterator-content d-flex justify-center align-center" v-if="data.length == 0">
            <h1 class="text-h6 text-red">No hay datos.</h1>
        </div>

    </v-card>
    <!-- iterator -->
</template>
    
<script>
import { defineComponent } from 'vue';
import HistorialDePagoCliente from '@/http/services/HistorialDePagoCliente';
import useToastify from '@/composables/useToastify';
import Desarrolladora from '@/http/services/Desarrolladora';
export default defineComponent({
    data() {
        const loading_data_iterator = false;
        const data = [];
        const search_item = "";
        const list_desarrolladora = [];
        const selected_desarrolladora = "";
        return {
            loading_data_iterator,
            data,
            search_item,
            list_desarrolladora,
            selected_desarrolladora,
        }
    },

    methods: {

        async listDesarrolladora() {
            const desarrolladora = new Desarrolladora();
            const response = await desarrolladora.index();
            if (response.status) {
                const all_desarrolladora = response.records;
                this.list_desarrolladora = all_desarrolladora.map(item => item.nombres);
                this.selected_desarrolladora = this.list_desarrolladora[0];
            } else {
                useToastify('danger', response.message);
            }
        },


        loadDataTable() {
            this.loading_data_iterator = true;
            setTimeout(async () => {
                const desarrolladora = new HistorialDePagoCliente(this.selected_desarrolladora);
                const respuesta = await desarrolladora.index();
                this.loading_data_iterator = false;
                if (respuesta.status) {
                    this.data = respuesta.records;
                } else {
                    useToastify('danger', respuesta.message);
                }
            }, 200)
        },//loadDataTable


    },//metodos

    async created() {
        await this.listDesarrolladora();
        this.loadDataTable();
    }

});

</script>


<style  scoped>
/* ========================================
data iterator 
el valor height de as-data-iterator es +130 o +100 sobre el valor height de as-data-iterator-content
ejemplo2: as-data-iterator-content =>height700px entonces as-data-iterator => height:100px+700px;
========================================== */
.as-data-iterator {
    height: 700px;
}

.as-data-iterator-content {
    overflow: hidden;
    overflow-y: auto;
    height: 600px;
    border-top: 1px solid #c2c2c2;
}
</style>
  