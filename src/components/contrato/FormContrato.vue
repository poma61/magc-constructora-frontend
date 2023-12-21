<template>
    <main class="animate__animated animate__bounceInRight">
        <p class="text-warning text-subtitle-1">Los campos marcados con (*) son obligatorios.</p>
        <div class="as-flex">

            <v-card class="as-flex-item as-form-cliente-contrato" elevation="12">
                <v-card-title class="bg-cyan-darken-1 py-3">
                    <span class="text-h6">Datos del cliente</span>
                </v-card-title>

                <v-card-text class="pa-5">
                    <v-radio-group label="Generar contrato para:" inline v-model="selected_cliente" class="ma-0 pa-0">
                        <v-radio label="Registrar nuevo cliente" value="nuevo-cliente" color="primary"></v-radio>
                        <v-radio label="Cliente registrado" value="cliente-registrado" color="primary"></v-radio>
                    </v-radio-group>

                    <v-row v-if="selected_cliente == 'cliente-registrado'" class="animate__animated animate__bounceInRight">
                        <v-col cols="12">
                            <!-- buscar cliente -->
                            <div class="d-flex">
                                <v-text-field label="Buscar Cliente" prepend-inner-icon="mdi-magnify" color="cyan-darken-1"
                                    :loading="loading_search_cliente" @keyup.enter="searchCliente()" variant="solo-filled"
                                    placeholder="Introduzca el CI del cliente" clearable v-model="ci_cliente" />
                                <v-btn icon="mdi-magnify" color="primary" @click="searchCliente()" class="ma-1"></v-btn>
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="item_contrato.nombres" label="Nombre cliente (*)" readonly
                                color="cyan-darken-1" variant="solo-filled" />
                        </v-col>

                        <v-col cols="12">
                            <v-text-field v-model="item_contrato.apellido_paterno" label="Nombre cliente (*)" readonly
                                color="cyan-darken-1" variant="solo-filled" />
                        </v-col>

                        <v-col cols="12">
                            <v-text-field v-model="item_contrato.apellido_materno" label="Nombre cliente (*)" readonly
                                color="cyan-darken-1" variant="solo-filled" />
                        </v-col>
                        <v-col cols="12">
                            <p class="text-red">{{ showFieldsErrors('id_cliente') }}</p>
                        </v-col>

                    </v-row>

                    <div v-if="selected_cliente == 'nuevo-cliente'">
                        <v-select label="Clientes que firmaran el contrato:" v-model="number_of_clients" :items="['1', '2']"
                            color="primary" @update:model-value="viewNumberOfClients" />
                        <v-row v-for="(cliente, i)  in  items_cliente" :key="i"
                            class="animate__animated animate__bounceInRight">
                            <v-col cols="12">
                                <p class="text-subtitle-1 text-primary">Cliente {{ i + 1 }}</p>
                                <v-divider class="border-opacity-25 mb-3" color="primary"></v-divider>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="cliente.nombres" label="Nombres (*)" color="cyan-darken-1" clearable
                                    :error-messages="showFieldsErrors(`clients.${i}.nombres`)"
                                    variant="solo-filled" />
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-text-field v-model="cliente.apellido_paterno" label="Apellido paterno (*)"
                                    color="cyan-darken-1" clearable
                                    :error-messages="showFieldsErrors(`clients.${i}.apellido_paterno`)" variant="solo-filled" />
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-text-field v-model="cliente.apellido_materno" label="Apellido materno (*)"
                                    color="cyan-darken-1" clearable
                                    :error-messages="showFieldsErrors(`clients.${i}.apellido_materno`)"
                                    variant="solo-filled" />
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-text-field v-model="cliente.n_de_contacto"
                                    label="N° de contacto (N° de telefono/celular) (*)" color="cyan-darken-1" clearable
                                    :error-messages="showFieldsErrors(`clients.${i}.n_de_contacto`)" type="number"
                                    variant="solo-filled" />
                            </v-col>

                            <v-col cols="12">
                                <v-text-field v-model="cliente.correo_electronico" label="Correo electronico"
                                    color="cyan-darken-1" clearable
                                    :error-messages="showFieldsErrors(`clients.${i}.correo_electronico`)"
                                    variant="solo-filled" />
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-text-field v-model="cliente.ci" label="CI  (*)" color="cyan-darken-1" clearable
                                    :error-messages="showFieldsErrors(`clients.${i}.ci`)" variant="solo-filled" />
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-autocomplete v-model="cliente.ci_expedido" label="Expedido  (*)"
                                    :items="['SC', 'CH', 'CB', 'PT', 'BN', 'LP', 'PA', 'TJ', 'OR', 'SinExp']"
                                    color="cyan-darken-1" :error-messages="showFieldsErrors(`clients.${i}.ci_expedido`)"
                                    variant="solo-filled" />
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-textarea v-model="cliente.direccion" label="Direccion  (*)" color="cyan-darken-1"
                                    clearable :error-messages="showFieldsErrors(`clients.${i}.direccion`)"
                                    variant="solo-filled" rows="3" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-textarea v-model="cliente.descripcion" label="Descripcion" color="cyan-darken-1"
                                    clearable variant="solo-filled" rows="3" />
                            </v-col>

                        </v-row>

                    </div>
                </v-card-text>

            </v-card>

            <!-- card contrato -->
            <v-card class="as-flex-item" elevation="12">
                <v-card-title class="bg-cyan-darken-1 py-3">
                    <span class="text-h6">Datos del contrato</span>
                </v-card-title>

                <v-card-text class="pa-5">
                    <v-row>
                        <!-- segunda parte -->
                        <v-col cols="12" md="4">
                            <v-text-field v-model="item_detalle_contrato.n_de_lote" label="N° de lote  (*)"
                                color="cyan-darken-1" :error-messages="showFieldsErrors('detalle_contrato.n_de_lote')"
                                variant="solo-filled" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model="item_detalle_contrato.n_de_uv" label="N° de UV  (*)"
                                color="cyan-darken-1" :error-messages="showFieldsErrors('detalle_contrato.n_de_uv')"
                                variant="solo-filled" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model="item_detalle_contrato.zona" label="Zona  (*)" color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.zona')"
                                variant="solo-filled" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model="item_detalle_contrato.terreno_superficie"
                                label="Superficie de terreno (*)" color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.terreno_superficie')"
                                variant="solo-filled" suffix="(m²)" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model="item_detalle_contrato.numero_distrito" label="Numero de distrito (*)"
                                color="cyan-darken-1" :error-messages="showFieldsErrors('detalle_contrato.numero_distrito')"
                                variant="solo-filled" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model="item_detalle_contrato.numero_identificacion_terreno"
                                label="N° de identificación de terreno(*)" color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.numero_identificacion_terreno')"
                                variant="solo-filled" />
                        </v-col>

                        <v-divider class="border-opacity-25 mb-3"></v-divider>
                        <v-col cols="12" md="3">
                            <v-text-field v-model="item_detalle_contrato.norte_medida_terreno"
                                label="Norte medida terreno (*)" color="cyan-darken-1" type="number"
                                :error-messages="showFieldsErrors('detalle_contrato.norte_medida_terreno')"
                                variant="solo-filled" suffix="(m)" />
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field v-model="item_detalle_contrato.norte_colinda_lote" label="Norte colinda lote (*)"
                                color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.norte_colinda_lote')"
                                variant="solo-filled" />
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field v-model="item_detalle_contrato.sur_medida_terreno" type="number"
                                label="Sur medida terreno (*)" color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.sur_medida_terreno')"
                                variant="solo-filled" suffix="(m)" />
                        </v-col>

                        <v-col cols="12" md="3">
                            <v-text-field v-model="item_detalle_contrato.sur_colinda_lote" label="Sur colinda lote (*)"
                                color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.sur_colinda_lote')"
                                variant="solo-filled" />
                        </v-col>

                        <v-col cols="12" md="3">
                            <v-text-field v-model="item_detalle_contrato.este_medida_terreno" type="number"
                                label="Este medida terreno (*)" color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.este_medida_terreno')"
                                variant="solo-filled" suffix="(m)" />
                        </v-col>

                        <v-col cols="12" md="3">
                            <v-text-field v-model="item_detalle_contrato.este_colinda_lote" label="Este colinda lote (*)"
                                color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.este_colinda_lote')"
                                variant="solo-filled" />
                        </v-col>

                        <v-col cols="12" md="3">
                            <v-text-field v-model="item_detalle_contrato.oeste_medida_terreno" type="number"
                                label="Oeste medida terreno (*)" color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.oeste_medida_terreno')" suffix="(m)"
                                variant="solo-filled" />
                        </v-col>

                        <v-col cols="12" md="3">
                            <v-text-field v-model="item_detalle_contrato.oeste_colinda_lote" label="Oeste colinda lote (*)"
                                color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.oeste_colinda_lote')"
                                variant="solo-filled" />
                        </v-col>
                        <!-- segunda parte -->
                        <v-divider class="border-opacity-25 mb-3"></v-divider>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="item_detalle_contrato.construccion_descripcion"
                                label="Descripcion del inmueble, construccion (*)" color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.construccion_descripcion')"
                                variant="solo-filled" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="item_detalle_contrato.construccion_superficie_terreno"
                                label="Superficie del terreno, construccion (*)" color="cyan-darken-1" suffix="(m²)"
                                :error-messages="showFieldsErrors('detalle_contrato.construccion_superficie_terreno')"
                                variant="solo-filled" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="item_detalle_contrato.construccion_valor_total_numeral"
                                label="Valor total de la construccion (*)" color="cyan-darken-1" prefix="($)" type="number"
                                :error-messages="showFieldsErrors('detalle_contrato.construccion_valor_total_numeral')"
                                variant="solo-filled" />
                        </v-col>


                        <v-col cols="12" md="6">
                            <v-text-field v-model="item_detalle_contrato.construccion_cantidad_meses_de_entrega"
                                label="Cantidad de meses de entrega, construccion (*)" color="cyan-darken-1" type="number"
                                :error-messages="showFieldsErrors('detalle_contrato.construccion_cantidad_meses_de_entrega')"
                                variant="solo-filled" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="item_detalle_contrato.construccion_val_couta_inicial_numeral"
                                type="number" label="Couta inicial de la construccion (*)" color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.construccion_val_couta_inicial_numeral')"
                                variant="solo-filled" prefix="($)" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="item_detalle_contrato.construccion_val_couta_mensual_numeral"
                                label="Couta mensual de la construccion (*)" color="cyan-darken-1" type="number"
                                :error-messages="showFieldsErrors('detalle_contrato.construccion_val_couta_mensual_numeral')"
                                prefix="($)" variant="solo-filled" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="item_detalle_contrato.construccion_cantidad_couta_mensual"
                                label="Cantidad de meses, couta mensual, construccion (*)" color="cyan-darken-1"
                                type="number"
                                :error-messages="showFieldsErrors('detalle_contrato.construccion_cantidad_couta_mensual')"
                                variant="solo-filled" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="item_detalle_contrato.primera_val_couta_mensual_numeral" type="number"
                                label="Primera couta mensual (*)" color="cyan-darken-1" prefix="($)"
                                :error-messages="showFieldsErrors('detalle_contrato.primera_val_couta_mensual_numeral')"
                                variant="solo-filled" />
                        </v-col>


                        <v-col cols="12" md="6">
                            <v-text-field v-model="item_detalle_contrato.segunda_val_couta_mensual_numeral" type="number"
                                label="Segunda couta mensual (*)" color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.segunda_val_couta_mensual_numeral')"
                                variant="solo-filled" prefix="($)" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="item_detalle_contrato.tercera_val_couta_mensual_numeral" type="number"
                                label="Tercera couta mensual (*)" color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.tercera_val_couta_mensual_numeral')"
                                prefix="($)" variant="solo-filled" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="item_detalle_contrato.lugar_firma_contrato"
                                label="Lugar de la firma del contrato (*)" color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.lugar_firma_contrato')"
                                variant="solo-filled" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="item_detalle_contrato.fecha_firma_contrato"
                                label="Fecha de lafirma del contrato (*)" color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.fecha_firma_contrato')" type="date"
                                variant="solo-filled" />
                        </v-col>

                        <v-col cols="12">
                            <v-textarea v-model="item_contrato.descripcion" label="descripcion" color="cyan-darken-1"
                                :error-messages="showFieldsErrors('detalle_contrato.descripcion')" variant="solo-filled"
                                rows="2" />
                        </v-col>

                    </v-row>
                    <!-- form -->
                    <div>
                        <p class="text-subtitle-1  text-primary">Agregar datos adicionales del terreno</p>
                        <v-switch color="primary" v-model="siwth_other_info_terreno" hide-details
                            :label="siwth_other_info_terreno ? 'si' : 'no'" inset />
                    </div>

                    <!-- informaciona dicional del terreno -->
                    <v-row v-if="siwth_other_info_terreno" class="animate__animated animate__bounceInRight">
                        <v-col cols="12" md="4">
                            <v-text-field v-model="item_contrato.terreno_valor_total_numeral"
                                label="Valor total del terreno" type="number" prefix="($)" color="cyan-darken-1"
                                variant="solo-filled" clearable
                                :error-messages="showFieldsErrors('terreno_valor_total_numeral')" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model="item_contrato.terreno_val_couta_inicial_numeral" clearable
                                label="Couta inicial del terreno" type="number" prefix="($)" color="cyan-darken-1"
                                variant="solo-filled"
                                :error-messages="showFieldsErrors('terreno_val_couta_inicial_numeral')" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model="item_contrato.terreno_val_couta_mensual_numeral" clearable
                                label="Couta mensual del terreno" type="number" prefix="($)" color="cyan-darken-1"
                                variant="solo-filled"
                                :error-messages="showFieldsErrors('terreno_val_couta_mensual_numeral')" />
                        </v-col>
                    </v-row>

                </v-card-text>
            </v-card>

        </div>

        <v-btn class="my-5 float-end" color="primary" variant="elevated" @click="save()">
            <v-icon icon="mdi-content-save"></v-icon>&nbsp;Generar contrato
        </v-btn>

        <v-dialog v-model="dialog_pdf" persistent transition="dialog-bottom-transition" max-width="900px" max-height="90vh"
            scrollable>
            <v-card>
                <v-card-text>
                    <div class="content-pdf">
                        <embed :src="contrato_pdf_url" type="application/pdf" class="embed__pdf">
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="yellow-darken-3" @click="closePDF()" variant="elevated">
                        <v-icon icon="mdi-close-circle"></v-icon>&nbsp;Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-overlay v-model="loading_generate_pdf" class="d-flex align-center justify-center">
            <div class="text-center">
                <v-progress-circular color="yellow-darken-3" indeterminate size="100"></v-progress-circular>
                <p class="text-h6 text-white">Generando contrato...</p>
            </div>
        </v-overlay>

        <v-overlay v-model="loading_edit_form" class="d-flex align-center justify-center">
            <div class="text-center">
                <v-progress-circular color="yellow-darken-3" indeterminate size="100"></v-progress-circular>
                <p class="text-h6 text-white">Obteniendo datos del contrato...</p>
            </div>
        </v-overlay>

    </main>
</template>


<script setup>
import Contrato from '@/http/services/Contrato';
import { computed, ref, defineProps, defineEmits, watch } from 'vue';
import app from "@/config/app.js";
import Cliente from '@/http/services/Cliente';
import useToastify from '@/composables/useToastify';
import { onMounted } from 'vue';

//props
const props = defineProps(['p_item_contrato', 'p_item_detalle_contrato', 'p_selected_desarrolladora']);
//emits
const emit = defineEmits(['toNewForm', 'toLocalUpdateDataTable']);
//data
const item_contrato = ref(props.p_item_contrato);
const item_detalle_contrato = item_contrato.value > 0 ? ref(props.p_item_detalle_contrato) : ref(new Contrato().getAttributes('detalle-contrato'));

const loading_generate_pdf = ref(false);
const contrato_pdf_url = ref("");
const dialog_pdf = ref(false);
const siwth_other_info_terreno = ref(false);
const selected_cliente = ref('nuevo-cliente');
const number_of_clients = ref('1');
const ci_cliente = ref(null);
const loading_search_cliente = ref(null);
const fields_errors = ref({});
const items_cliente = ref([]);
const loading_edit_form = ref(false);

const viewNumberOfClients = () => {
    items_cliente.value = Array.from({ length: number_of_clients.value }, () => new Cliente().getAttributes());
}

//computed
const showFieldsErrors = computed(() => {
    return function (property) {
        if (fields_errors.value[property]) {
            return fields_errors.value[property][0];
        }
        return "";
    }
});

//cuando  cambia props.p_item_contrato  por los botones nuevo contrato
///entonces tambien debemos actualizar las variables en este componente
watch(() => props.p_item_contrato, () => {
    item_contrato.value = props.p_item_contrato;
    clear();
});

const uploadDetalleContrato = () => {
    setTimeout(async () => {
        const detalle_contrato = new Contrato(props.p_selected_desarrolladora, item_contrato.value,);
        const response = await detalle_contrato.showDetalleContrato();
        loading_edit_form.value = false;
        if (response.status) {
            item_detalle_contrato.value = Object.assign({}, response.record);
        } else {
            useToastify('error', response.message);
        }
    }, 200)
}

const searchCliente = () => {
    loading_search_cliente.value = 'purple-darken-3';
    setTimeout(async () => {
        const cliente = new Cliente(props.p_selected_desarrolladora);
        const response = await cliente.searchCliente(ci_cliente.value);
        loading_search_cliente.value = null;
        if (response.status) {
            item_contrato.value.id_cliente = response.record.id;
            item_contrato.value.nombres = response.record.nombres;
            item_contrato.value.apellido_paterno = response.record.apellido_paterno;
            item_contrato.value.apellido_materno = response.record.apellido_materno;
            ci_cliente.value = "";
            useToastify('success', response.message);
        } else {
            useToastify('danger', response.message);
        }
    }, 400);

}

const closePDF = () => {
    dialog_pdf.value = false;
    //para evitar que el contenido se distorcione cuando no haya archivo
    // al cerrar el dialog
    setTimeout(() => {
        contrato_pdf_url.value = "";
    }, 400)
};

const newForm = () => {
    emit('toNewForm');
    clear();
}
const openPDF = (path_pdf) => {
    dialog_pdf.value = true;
    contrato_pdf_url.value = `${app.BASE_URL}${path_pdf}`;
}

const save = () => {

    loading_generate_pdf.value = true;
    setTimeout(async () => {
        const clients = items_cliente.value.map(cliente => new Cliente(props.p_selected_desarrolladora, cliente));
        const contrato = new Contrato();
        contrato.setCliente(clients);
        contrato.setDesarrolladora(props.p_selected_desarrolladora);
        contrato.setAttributes('contrato', item_contrato.value);
        contrato.setAttributes('detalle-contrato', item_detalle_contrato.value);
        if (contrato.getAttributes('contrato').id > 0) {
            //para editar registro
            const response = await contrato.update();
            loading_generate_pdf.value = false;
            if (response.status) {
                useToastify('success', response.message);
                emit('toLocalUpdateDataTable', 'edit', response.record);
                openPDF(response.record.archivo_pdf);


            } else {
                if (response.message_errors != undefined) {
                    fields_errors.value = Object.assign({}, response.message_errors);
                }
                useToastify('danger', response.message);
            }
        } else {
            //para nuevo registro
            const response = await contrato.store();
            loading_generate_pdf.value = false;
            if (response.status) {
                useToastify('success', response.message);
                openPDF(response.record.archivo_pdf);
                emit('toLocalUpdateDataTable', 'new', response.record);
                newForm();
            } else {
                if (response.message_errors != undefined) {
                    fields_errors.value = Object.assign({}, response.message_errors);
                }
                useToastify('danger', response.message);
            }
            console.log(response);
        }

    }, 200)
}

const clear = () => {
    fields_errors.value = {};

}


onMounted(() => {
    viewNumberOfClients();
    //cuando es edicion de datos cargamos detalle contrato desde el backend
    if (item_contrato.value.id > 0) {
        uploadDetalleContrato();
    }
})
</script>

<style scoped>
.as-flex {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    gap: 15px;
}

.as-flex .as-flex-item {
    flex-grow: 1;
    width: 600px;
}

.as-flex .as-form-cliente-contrato {
    flex-grow: 0;
    height: fit-content;
}

@media only screen and (max-width: 1450px) {
    .as-flex .as-flex-item {
        flex-grow: 1;
        width: 100%;
    }

    .as-flex .as-form-cliente-contrato {
        flex-grow: 1;
        width: 100%;
    }
}</style>