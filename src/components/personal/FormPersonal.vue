<template>
    <v-card class="animate__animated animate__backInDown">
        <v-card-title class="bg-light-blue-darken-3 py-3">
            <span class="text-h6">Registrar personal | {{ props.p_selected_desarrolladora }}</span>
        </v-card-title>
        <v-card-text class="pa-5">
            <p class="text-warning text-subtitle-1">Los campos marcados con (*) son obligatorios.</p>
            <v-row>
                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.nombres" label="Nombres (*)" color="light-blue-darken-3" clearable
                        :error-messages="showFieldsErrors('nombres')"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.apellido_paterno" label="Apellido paterno (*)"
                        color="light-blue-darken-3" clearable
                        :error-messages="showFieldsErrors('apellido_paterno')"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.apellido_materno" label="Apellido materno (*)"
                        color="light-blue-darken-3" clearable
                        :error-messages="showFieldsErrors('apellido_materno')"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.cargo" label="Cargo (*)" color="light-blue-darken-3" clearable
                        :error-messages="showFieldsErrors('cargo')"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.ci" label="C.I. (*)" color="light-blue-darken-3" clearable
                        :error-messages="showFieldsErrors('ci')"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-autocomplete v-model="item_personal.ci_expedido" label="Expedido (*)"
                        :items="['SC', 'CH', 'CB', 'PT', 'BN', 'LP', 'PA', 'TJ', 'OR', 'SinExp']"
                        color="light-blue-darken-3" clearable
                        :error-messages="showFieldsErrors('ci_expedido')"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.n_de_contacto" label="N° de contacto" color="light-blue-darken-3"
                        :error-messages="showFieldsErrors('n_de_contacto')" type="number"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.correo_electronico" label="Correo electronico"
                        color="light-blue-darken-3" clearable :error-messages="showFieldsErrors('correo_electronico')"
                        type="email"></v-text-field>
                </v-col>

                <v-col cols="12">
                    <v-textarea v-model="item_personal.direccion" label="Dirección" color="light-blue-darken-3" clearable
                        :error-messages="showFieldsErrors('direccion')" rows="2"></v-textarea>
                </v-col>


                <v-col cols="12" sm="6">
                    <v-file-input accept="image/*" label="Foto (*)" color="light-blue-darken-3"
                        :error-messages="showFieldsErrors('foto')" v-model="is_file" @change="uploadImage"
                        :clearable="false">
                        <template v-slot:append>
                            <v-btn v-bind="props" icon="mdi-camera" color="success" @click="openCamera"></v-btn>
                        </template>
                    </v-file-input>

                </v-col>

                <v-col cols="12">
                    <div class="ma-1 image-content">
                        <v-img v-if="url_image != null" :width="280" :height="280"  :src="url_image">
                        </v-img>
                    </div>
                </v-col>

            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="light-blue-darken-3" variant="elevated" @click="save" :loading="loading_btn">
                <v-icon icon="mdi-content-save-outline"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>

    </v-card>

    <v-dialog v-model="dialog_camera" persistent max-width="600px" max-height="600px">
        <v-card>
            <v-card-title class="bg-light-blue-darken-3 py-3">
                <span class="text-h6">
                    <v-icon icon="mdi-camera"></v-icon> Camara web
                </span>
            </v-card-title>
            <v-card-text>
                <Camera ref="camera" :autoplay="false"></Camera>

                <v-select :items="devices_camera.name" label="Dispositivos de camara" color="light-blue-darken-3"
                    v-model="selected_device_camera.name" @update:model-value="changeDeviceCamera"
                    :error-messages="selected_device_camera.active ? '' : 'No hay dispositivos de camara.'" />
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="light-blue-darken-3" variant="elevated" @click="capturePhoto"
                    :disabled="!selected_device_camera.active ? true : false">
                    <v-icon icon="mdi-camera"></v-icon>&nbsp;Tomar foto
                </v-btn>
                <v-btn color="red" variant="elevated" @click="closeCamera">
                    <v-icon icon="mdi-close"></v-icon>&nbsp;Cerrar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import app from '@/config/app';
import { onMounted } from 'vue';
import { ref, defineProps, defineEmits, computed, nextTick, watch } from 'vue';
import Camera from "simple-vue-camera";
import useToastify from '@/composables/useToastify';
import Personal from '@/http/services/Personal';


const props = defineProps(['p_item_personal', 'p_selected_desarrolladora']);
const emit = defineEmits(['toLocalUpdateDataTable', 'toNewForm']);

const devices_camera = ref({
    name: [],
    device: []
});
const selected_device_camera = ref({ active: false, name: "" });
const dialog_camera = ref(false);
const item_personal = ref(props.p_item_personal);
const camera = ref(null);
const url_image = ref(null);
const loading_btn = ref(false);
const is_file = ref([]);
const fields_errors = ref({});

//cuando  cambia props.p_item_personal  por los botones nuevo personal y por el boton de 'clear'
///entonces tambien debemos actualizar las variables
watch(() => props.p_item_personal, () => {
    item_personal.value = props.p_item_personal;
    clear();
});

const showFieldsErrors = computed(() => {
    return function (field) {
        if (fields_errors.value[field]) {
            return fields_errors.value[field][0];
        }
        return "";
    }
});

const uploadImage = () => {
    const file = is_file.value[0];
    if (file) {
        item_personal.value.foto = file;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            url_image.value = e.target.result;
        };
    }

}
const showImage = () => {
    if (item_personal.value.foto != null) {
        url_image.value = app.BASE_URL + item_personal.value.foto;
    }
}

const openCamera = async () => {
    dialog_camera.value = true;
    // Esperar al próximo ciclo de renderización
    await nextTick();
    camera.value.start();
    listDeviceCamera();
};

const capturePhoto = async () => {
    if (camera.value != null) {
        const blob = await camera.value.snapshot({ width: 500, height: 700 }, "image/jpeg", 0.5);
        if (blob) {
            url_image.value = blob;
            url_image.value = URL.createObjectURL(blob);
            const file = new File([blob], "fotografia", { type: blob.type });
            item_personal.value.foto = file;
        }
    }
    closeCamera();
};


const closeCamera = () => {
    if (camera.value != null) {
        camera.value.stop();
    }
    devices_camera.value.name = [];
    devices_camera.value.device = [];
    selected_device_camera.value = { active: false, name: "" };
    dialog_camera.value = false;
}
const listDeviceCamera = async () => {
    const devices = await camera.value.devices(["videoinput"]);
    for (let i = 0; i < devices.length; i++) {
        devices_camera.value.name.push(devices[i].label);
        devices_camera.value.device.push(devices[i]);
    }
    //verificamos si se encontraron camaras
    if (devices.length > 0) {
        selected_device_camera.value.name = devices_camera.value.name[0];
        selected_device_camera.value.active = true;
    } else {
        useToastify('danger', 'No hay dispositvos de camara.')
    }

}
const changeDeviceCamera = async () => {
    for (let i = 0; i < devices_camera.value.device.length; i++) {
        //compara la camara selecciona de v-select con las camaras almacenadas en  devices_camera
        if (selected_device_camera.value.name == devices_camera.value.device[i].label) {
            //esperamos que se active la camara seleccionada
            await camera.value.changeCamera(devices_camera.value.device[i].deviceId);
            //si se selecciona una camara salimos del ciclo for
            break;
        }
    }

}

const save = () => {
    loading_btn.value = true;
    setTimeout(async () => {
        const personal = new Personal(props.p_selected_desarrolladora, Object.assign({}, item_personal.value));
        if (personal.getAttributes().id > 0) {
            //cuando es update
            const response = await personal.update();
            loading_btn.value = false;
            if (response.status) {
                useToastify('success', response.message);
                emit('toLocalUpdateDataTable', 'edit', response.record)
                clear();
            } else {
                if (response.message_errors != undefined) {
                    fields_errors.value = response.message_errors;
                }
                useToastify('danger', response.message);
            }

        } else {
            //cuando es create
            const response = await personal.store();
            loading_btn.value = false;
            if (response.status) {
                useToastify('success', response.message);
                emit('toLocalUpdateDataTable', 'new', response.record);
                clear();
                emit('toNewForm');
            } else {
                if (response.message_errors != undefined) {
                    fields_errors.value = response.message_errors;
                }
                useToastify('danger', response.message);
            }
        }
    }, 200);

}

const clear = () => {
    fields_errors.value = {};
    is_file.value = [];
    if (item_personal.value.id == 0) {
        //solo cuando es nuevo registro reseteamos la url_image
        url_image.value = null;
    }
}


onMounted(() => {
    showImage();
})

</script> 


<style scoped>
.image-content {
    width: 280px;
    height: 280px;
    border: 1px dashed #000;
}
</style>