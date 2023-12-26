<template>
    <v-card>
        <v-card-title class="animate__animated animate__bounceInRight bg-purple-darken-1 py-3">
            <span class="text-h6">Registrar personal | {{ props.p_current_sucursal }}</span>
        </v-card-title>
        <div class="pa-3">
            <v-row>
                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.nombres" label="Nombres" color="purple-darken-1" clearable
                        :error-messages="showFieldsErrors('nombres')"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.apellido_paterno" label="Apellido paterno" color="purple-darken-1"
                        clearable :error-messages="showFieldsErrors('apellido_paterno')"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.apellido_materno" label="Apeliido materno" color="purple-darken-1"
                        clearable :error-messages="showFieldsErrors('apellido_materno')"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.cargo" label="Cargo" color="purple-darken-1" clearable
                        :error-messages="showFieldsErrors('cargo')"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.ci" label="CI" color="purple-darken-1" clearable
                        :error-messages="showFieldsErrors('ci')"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-autocomplete v-model="item_personal.ci_expedido" label="Expedido" :items="['OR']"
                        color="purple-darken-1" clearable
                        :error-messages="showFieldsErrors('ci_expedido')"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.n_contacto" label="N° de contacto" color="purple-darken-1"
                        clearable :error-messages="showFieldsErrors('n_contacto')" type="number"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_personal.email" label="Correo electronico" color="purple-darken-1" clearable
                        :error-messages="showFieldsErrors('email')" type="email"></v-text-field>
                </v-col>

                <v-col cols="12">
                    <v-textarea v-model="item_personal.direccion" label="Direccion" color="purple-darken-1" clearable
                        :error-messages="showFieldsErrors('direccion')"></v-textarea>
                </v-col>


                <v-col cols="12" sm="6">
                    <v-file-input accept="image/*" label="Foto" color="purple-darken-1"
                        :error-messages="showFieldsErrors('foto')" @change="uploadImage">
                        <template v-slot:append>
                            <v-btn v-bind="props" icon="mdi-camera" color="success" @click="openCamera"></v-btn>
                        </template>
                    </v-file-input>

                </v-col>

                <v-col cols="12">
                    <div class="ma-1 image-content">
                        <v-img v-if="url_image != null" :width="280" :height="280" cover :src="url_image">
                            <template v-slot:placeholder>
                                <div class="d-flex align-center justify-center fill-height">
                                    <v-progress-circular color="purple-darken-1" :size="100"
                                        indeterminate></v-progress-circular>
                                </div>
                            </template>
                        </v-img>
                    </div>
                </v-col>

            </v-row>

        </div>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="purple-darken-1" variant="elevated" @click="onSave">
                <v-icon icon="mdi-content-save-outline"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>

    </v-card>

    <v-dialog v-model="dialog_camera" persistent max-width="600px" max-height="600px">
        <v-card>
            <v-card-title class="bg-purple-darken-1 py-3">
                <span class="text-h6">
                    <v-icon icon="mdi-camera"></v-icon> Camara web
                </span>
            </v-card-title>
            <v-container>
                <Camera ref="camera" :autoplay="false"></Camera>

                <v-select :items="devices_camera.name" label="Dispositivos de camara" color="purple-darken-1"
                    v-model="current_device_camera.name" @update:model-value="changeDeviceCamera"
                    :error-messages="current_device_camera.active ? '' : 'No hay dispositivos de camara.'" />

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="purple-darken-1" variant="elevated" @click="capturePhoto"
                        :disabled="!current_device_camera.active ? true : false">
                        <v-icon icon="mdi-camera"></v-icon>&nbsp;Tomar foto
                    </v-btn>
                    <v-btn color="red" variant="elevated" @click="closeCamera">
                        <v-icon icon="mdi-close"></v-icon>&nbsp;Cerrar
                    </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script setup>
import app from '@/config/app';
import { onMounted } from 'vue';
import { ref, defineProps, defineEmits, computed, nextTick, watch } from 'vue';
import Camera from "simple-vue-camera";
import useToastify from '@/composables/useToastify';

const props = defineProps(['p_item_personal', 'p_fields_errors', 'p_current_sucursal']);
const emit = defineEmits(['toSave'])

const devices_camera = ref({
    name: [],
    device: []
});
const current_device_camera = ref({ active: false, name: "" });
const dialog_camera = ref(false);
const item_personal = ref(props.p_item_personal);
const camera = ref(null);
const url_image = ref(null);
const onSave = () => {
    emit('toSave', Object.assign({}, item_personal.value));
};

//cuando  cambia props.p_item_personal  por los botones nuevo personal y por el boton de 'clear'
///entonces tambien debemos actualizar las variables
watch(() => props.p_item_personal, () => {
    item_personal.value = props.p_item_personal;
    url_image.value = null;
});

const showFieldsErrors = computed(() => {
    return function (field) {
        if (props.p_fields_errors[field]) {
            return props.p_fields_errors[field][0];
        }
        return "";
    }
});

const uploadImage = (event) => {
    const file = event.target.files[0];
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
        const blob = await camera.value.snapshot({ width: 800, height: 500 }, "image/jpeg", 0.5);
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
    current_device_camera.value = { active: false, name: "" };
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
        current_device_camera.value.name = devices_camera.value.name[0];
        current_device_camera.value.active = true;
        useToastify('info', 'Camara iniciada!')
    } else {
        useToastify('danger', 'No dispositvos de camara.')
    }

}
const changeDeviceCamera = () => {
    for (let i = 0; i < devices_camera.value.device.length; i++) {
        //compara la camara selecciona de v-select con las camaras almacenadas en  devices_camera
        if (current_device_camera.value.name == devices_camera.value.device[i].label) {
            camera.value.changeCamera(devices_camera.value.device[i].deviceId);
            useToastify('success', "Camara seleccionada " + devices_camera.value.device[i].label);
        } else {
            useToastify('danger', "No se puedo seleccionar ningun camara");
        }
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