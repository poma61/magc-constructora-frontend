<template>
    <v-card class="animate__animated animate__bounceInRight ">
        <v-card-title class="bg-cyan-darken-1 py-3">
            <span class="text-h6">Datos del contrato</span>
        </v-card-title>

        <v-card-text class="pa-3">
            <!-- form -->
            <v-row>
                <v-col cols="12" md="6">
                    <!-- buscar cliente -->
                    <div class="d-flex">
                        <v-text-field label="Buscar Cliente" prepend-inner-icon="mdi-magnify" color="cyan-darken-1"
                            :loading="loading_search_cliente" @keyup.enter="searchCliente()" variant="outlined"
                            placeholder="Introduzca el CI del cliente" class="m-1" clearable v-model="ci_cliente" />
                        <v-btn icon="mdi-magnify" color="purple-darken-3" @click="searchCliente()" class="ma-1"></v-btn>
                    </div>

                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="nombreCompletoCliente" label="Nombre cliente" readonly class="m-1"
                        color="cyan-darken-1" :error-messages="showFieldsErrors('id_cliente')" variant="outlined" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field v-model="item_detalle_contrato.n_de_lote" label="N° de lote" class="m-1"
                        color="cyan-darken-1" :error-messages="showFieldsErrors('n_de_lote')" variant="outlined" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="item_detalle_contrato.n_de_uv" label="N° de UV" class="m-1" color="cyan-darken-1"
                        :error-messages="showFieldsErrors('n_de_uv')" variant="outlined" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="item_detalle_contrato.zona" label="Zona" class="m-1" color="cyan-darken-1"
                        :error-messages="showFieldsErrors('zona')" variant="outlined" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="item_detalle_contrato.superficie_terreno" label="Superficie de terreno"
                        class="m-1" color="cyan-darken-1" :error-messages="showFieldsErrors('superficie_terreno')"
                        variant="outlined" suffix="(m²)" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="item_detalle_contrato.numero_distrito" label="Numero de distrito" class="m-1"
                        color="cyan-darken-1" :error-messages="showFieldsErrors('numero_distrito')" variant="outlined" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="item_detalle_contrato.numero_identificacion_terreno"
                        label="Numero de identificación de terreno" class="m-1" color="cyan-darken-1"
                        :error-messages="showFieldsErrors('numero_identificacion_terreno')" variant="outlined" />
                </v-col>

                <v-divider class="border-opacity-25 mb-3"></v-divider>
                <v-col cols="12" md="3">
                    <v-text-field v-model="item_detalle_contrato.norte_medida_terreno" label="Norte medida terreno"
                        color="cyan-darken-1" :error-messages="showFieldsErrors('norte_medida_terreno')" variant="outlined"
                        suffix="(m)" />
                </v-col>
                <v-col cols="12" md="3">
                    <v-text-field v-model="item_detalle_contrato.norte_colinda_lote" label="Norte colinda lote"
                        color="cyan-darken-1" :error-messages="showFieldsErrors('norte_colinda_lote')" variant="outlined" />
                </v-col>
                <v-col cols="12" md="3">
                    <v-text-field v-model="item_detalle_contrato.sur_medida_terreno" label="Sur medida terreno"
                        color="cyan-darken-1" :error-messages="showFieldsErrors('sur_medida_terreno')" variant="outlined"
                        suffix="(m)" />
                </v-col>

                <v-col cols="12" md="3">
                    <v-text-field v-model="item_detalle_contrato.sur_colinda_lote" label="Sur colinda lote"
                        color="cyan-darken-1" :error-messages="showFieldsErrors('sur_colinda_lote')" variant="outlined" />
                </v-col>

                <v-col cols="12" md="3">
                    <v-text-field v-model="item_detalle_contrato.este_medida_terreno" label="Este medida terreno"
                        color="cyan-darken-1" :error-messages="showFieldsErrors('este_medida_terreno')" variant="outlined"
                        suffix="(m)" />
                </v-col>

                <v-col cols="12" md="3">
                    <v-text-field v-model="item_detalle_contrato.este_colinda_lote" label="Este colinda lote"
                        color="cyan-darken-1" :error-messages="showFieldsErrors('este_colinda_lote')" variant="outlined" />
                </v-col>

                <v-col cols="12" md="3">
                    <v-text-field v-model="item_detalle_contrato.oeste_medida_terreno" label="Oeste medida terreno"
                        color="cyan-darken-1" :error-messages="showFieldsErrors('oeste_medida_terreno')" suffix="(m)"
                        variant="outlined" />
                </v-col>

                <v-col cols="12" md="3">
                    <v-text-field v-model="item_detalle_contrato.oeste_colinda_lote" label="Oeste colinda lote"
                        color="cyan-darken-1" :error-messages="showFieldsErrors('oeste_colinda_lote')" variant="outlined" />
                </v-col>
                <v-divider class="border-opacity-25 mb-3"></v-divider>
                <v-col cols="12" md="4">
                    <v-text-field v-model="item_detalle_contrato.valor_construccion_numeral"
                        label="Valor de la construccion" color="cyan-darken-1" prefix="($)"
                        :error-messages="showFieldsErrors('valor_construccion_numeral')" variant="outlined" />
                </v-col>


                <v-col cols="12" md="4">
                    <v-text-field v-model="item_detalle_contrato.valor_couta_inicial_numeral" label="Valor de couta inicial"
                        color="cyan-darken-1" :error-messages="showFieldsErrors('valor_couta_inicial_numeral')"
                        variant="outlined" prefix="($)" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="item_detalle_contrato.valor_couta_mensual_numeral" label="Valor de couta mensual"
                        color="cyan-darken-1" :error-messages="showFieldsErrors('valor_couta_mensual_numeral')" prefix="($)"
                        variant="outlined" />
                </v-col>

                <v-col cols="12" md="4">

                    <v-text-field v-model="item_detalle_contrato.primera_val_couta_mensual_numeral"
                        label="Primera couta mensual" color="cyan-darken-1" prefix="($)"
                        :error-messages="showFieldsErrors('primera_val_couta_mensual_numeral')" variant="outlined" />
                </v-col>


                <v-col cols="12" md="4">
                    <v-text-field v-model="item_detalle_contrato.segunda_val_couta_mensual_numeral"
                        label="Segunda couta mensual" color="cyan-darken-1"
                        :error-messages="showFieldsErrors('segunda_val_couta_mensual_numeral')" variant="outlined"
                        prefix="($)" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="item_detalle_contrato.tercera_val_couta_mensual_numeral"
                        label="Tercera couta mensual" color="cyan-darken-1"
                        :error-messages="showFieldsErrors('tercera_val_couta_mensual_numeral')" prefix="($)"
                        variant="outlined" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="item_detalle_contrato.lugar_firma_contrato"
                        label="Lugar de la firma del contrato" color="cyan-darken-1"
                        :error-messages="showFieldsErrors('lugar_firma_contrato')" variant="outlined" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="item_detalle_contrato.fecha_firma_contrato" label="Fecha de lafirma del contrato"
                        color="cyan-darken-1" :error-messages="showFieldsErrors('fecha_firma_contrato')" type="date"
                        variant="outlined" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-textarea v-model="item_contrato.descripcion" label="descripcion" color="cyan-darken-1"
                        :error-messages="showFieldsErrors('descripcion')" variant="outlined" />
                </v-col>

            </v-row>
            <!-- form -->

        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="purple-darken-3" variant="elevated" @click="save()">
                <v-icon icon="mdi-content-save"></v-icon>&nbsp;Generar contrato
            </v-btn>
        </v-card-actions>

    </v-card>


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

    <v-dialog v-model="loading_generate_pdf" class="d-flex align-center justify-center">
        <div class="text-center">
            <v-progress-circular color="yellow-darken-3" indeterminate size="100"></v-progress-circular>
            <p class="text-h6 text-white">Generando contrato...</p>
        </div>
    </v-dialog>
</template>


<script setup>
import Contrato from '@/http/services/Contrato';
import { computed, ref, defineProps, defineEmits, watch } from 'vue';
import app from "@/config/app.js";
import Cliente from '@/http/services/Cliente';
import useToastify from '@/composables/useToastify';

//props
const props = defineProps(['p_item_contrato', 'p_item_detalle_contrato',]);
//emits
const emit = defineEmits(['toNewForm', 'toLocalUpdateDataTable']);
//data
const item_contrato = ref(props.p_item_contrato);
const item_detalle_contrato = ref(props.p_item_detalle_contrato);
const loading_generate_pdf = ref(false);
const contrato_pdf_url = ref("");
const dialog_pdf = ref(false);

//emits events
const isNewForm = () => {
    emit('toNewForm');
}
//data
const loading_search_cliente = ref(null);
const fields_errors = ref({});
const ci_cliente = ref("");

//computed
const showFieldsErrors = computed(() => {
    return function (property) {
        if (fields_errors.value[property]) {
            return fields_errors.value[property][0];
        }
        return "";
    }
});
const nombreCompletoCliente = computed(() => {
    if (item_contrato.value.nombres != undefined) {
        return `${item_contrato.value.nombres} ${item_contrato.value.apellido_paterno} ${item_contrato.value.apellido_materno}`;
    }
    return "";
});

//cuando  cambia props.p_item_contrato  por los botones nuevo contrato
///entonces tambien debemos actualizar las variables en este componente
watch(() => props.p_item_contrato, () => {
    item_contrato.value = props.p_item_contrato;
});

watch(() => props.p_item_detalle_contrato, () => {
    item_detalle_contrato.value = props.p_item_detalle_contrato;
});

const searchCliente = () => {
    loading_search_cliente.value = 'purple-darken-3';
    setTimeout(async () => {
        const cliente = new Cliente();
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
    }, 200);

}

const closePDF = () => {
    dialog_pdf.value = false;
    //para evitar que el contenido se distorcione cuando no haya archivo
    // al cerrar el dialog
    setTimeout(() => {
        contrato_pdf_url.value = "";
    }, 400)
};

const openPDF = (path_pdf) => {
    dialog_pdf.value = true;
    contrato_pdf_url.value = `${app.BASE_URL}${path_pdf}`;
}

const save = () => {
    loading_generate_pdf.value = true;
    setTimeout(async () => {
        const contrato = new Contrato(item_contrato.value, item_detalle_contrato.value);
        if (contrato.getAttributes('contrato').id > 0) {
            //para editar registro
            const response = await contrato.update();
            loading_generate_pdf.value = false;
            if (response.status) {
                useToastify('success', response.message);
                emit('toLocalUpdateDataTable', 'edit',response.record);
                openPDF(response.record.archivo_pdf);
                clearMessageField();
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
                isNewForm();
                clearMessageField();
                emit('toLocalUpdateDataTable', 'new',response.record);
            } else {
                if (response.message_errors != undefined) {
                    fields_errors.value = Object.assign({}, response.message_errors);
                }
                useToastify('danger', response.message);
            }
        }

    }, 200)
}

const clearMessageField = () => {
    fields_errors.value = {};
}

</script>

