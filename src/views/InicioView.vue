<template>
    <MainApp>
        <h1 class="animate__animated animate__bounceInLeft text-h6 my-3 pa-1 bg-cyan-darken-1 as-box-shadow">
            <v-icon icon="mdi-view-dashboard"></v-icon>&nbsp;Inicio
        </h1>

        <v-card min-height="85vh" elevation="24">
            <v-card-text>
                <v-row justify="center">
                    <v-col cols="auto" md="auto">
                        <v-hover v-slot="{ isHovering, props }" close-delay="100">
                            <v-card :elevation="isHovering ? 24 : 2" :class="{ 'on-hover': isHovering }" height="350"
                                width="350" v-bind="props" class="ma-2">
                                <v-img :src="require('@/assets/images/img-1.jpg')" height="350" width="350" cover>
                                    <v-expand-transition>
                                        <div v-if="isHovering"
                                            class="d-flex flex-column justify-center transition-fast-in-fast-out v-card--reveal as-transparent-blank pa-5"
                                            style="height: 100%;">
                                            <p class="text-h6 text-white text-center">
                                                Sobre nosotros
                                            </p>
                                            <p class="text-white">
                                                Somos una empresa 100% boliviana dedicada a la construcción en general,
                                                tenemos
                                                10 años de experiencia al servicio de nuestros clientes, posicionándonos
                                                como
                                                empresa líder en el mercado gracias a la preferencia de nuestros clientes.
                                                Todos nuestros servicios están garantizados, recibirás la mejor atención y
                                                te
                                                ayudaremos a encontrar la solución más adecuada para tus necesidades.
                                                ¿Tienes alguna duda o requieres más información?, ponte en contacto con
                                                nosotros, con gusto te asesoraremos y resolveremos tus dudas.
                                            </p>

                                        </div>
                                    </v-expand-transition>
                                </v-img>
                            </v-card>
                        </v-hover>
                    </v-col>

                    <v-col cols="auto" md="auto">
                        <v-hover v-slot="{ isHovering, props }" close-delay="100">
                            <v-card :elevation="isHovering ? 24 : 2" :class="{ 'on-hover': isHovering }" height="350"
                                width="350" v-bind="props" class="ma-2">
                                <v-img :src="require('@/assets/images/img-2.jpeg')" height="350" width="350" cover>
                                    <v-expand-transition>
                                        <div v-if="isHovering"
                                            class="d-flex flex-column justify-center transition-fast-in-fast-out v-card--reveal as-transparent-blank pa-5 "
                                            style="height: 100%;">
                                            <p class="text-h6 text-white text-center">
                                                Misión
                                            </p>
                                            <p class="text-white">
                                                MAGC CONSTRUCTORA & CONSULTORA trabaja cada día para brindar el mejor
                                                servicio de construcción, con todas las herramientas necesarias para crear
                                                una obra segura, elegante, bonita y cómoda. Ganar clientes satisfechos que
                                                recomienden nuestros servicios en un futuro cercano.
                                            </p>
                                        </div>
                                    </v-expand-transition>
                                </v-img>
                            </v-card>
                        </v-hover>
                    </v-col>

                    <v-col cols="auto" md="auto">
                        <v-hover v-slot="{ isHovering, props }" close-delay="100">
                            <v-card :elevation="isHovering ? 24 : 2" :class="{ 'on-hover': isHovering }" height="350"
                                width="350" v-bind="props" class="ma-2">
                                <v-img :src="require('@/assets/images/img-3.jpeg')" height="350" width="350" cover>
                                    <v-expand-transition>
                                        <div v-if="isHovering"
                                            class="d-flex flex-column justify-center transition-fast-in-fast-out as-transparent-blank v-card--reveal  pa-5"
                                            style="height: 100%;">
                                            <p class="text-h6 text-white text-center">
                                                Visión
                                            </p>
                                            <p class="text-white">
                                                Ser destacada por la excelencia en lo que hacemos, por ser confiable para
                                                nuestros clientes y comprometida con nuestros colaboradores.
                                            </p>
                                        </div>
                                    </v-expand-transition>
                                </v-img>

                            </v-card>
                        </v-hover>
                    </v-col>

                    <v-col cols="auto" md="auto">
                        <v-hover v-slot="{ isHovering, props }" close-delay="100">
                            <v-card :elevation="isHovering ? 24 : 2" :class="{ 'on-hover': isHovering }" height="350"
                                width="350" v-bind="props" class="ma-2">
                                <v-img :src="require('@/assets/images/img-4.jpeg')" height="350" width="350" cover />
                            </v-card>
                        </v-hover>
                    </v-col>

                    <v-col cols="auto" md="auto">
                        <v-hover v-slot="{ isHovering, props }" close-delay="100">
                            <v-card :elevation="isHovering ? 24 : 2" :class="{ 'on-hover': isHovering }" height="350"
                                width="350" v-bind="props" class="ma-2">
                                <v-img :src="require('@/assets/images/img-4.jpeg')" height="350" width="350" cover />
                            </v-card>
                        </v-hover>
                    </v-col>

                    <v-col cols="auto" md="auto">
                        <v-hover v-slot="{ isHovering, props }" close-delay="100">
                            <v-card :elevation="isHovering ? 24 : 2" :class="{ 'on-hover': isHovering }" height="350"
                                width="350" v-bind="props" class="ma-2">
                                <v-img :src="require('@/assets/images/img-5.jpg')" height="350" width="350" cover />
                            </v-card>
                        </v-hover>
                    </v-col>

                    <v-col cols="auto" md="auto">
                        <v-hover v-slot="{ isHovering, props }" close-delay="100">
                            <v-card :elevation="isHovering ? 24 : 2" :class="{ 'on-hover': isHovering }" height="350"
                                width="350" v-bind="props" class="ma-2">
                                <v-img :src="require('@/assets/images/img-6.jpeg')" height="350" width="350" cover />
                            </v-card>
                        </v-hover>
                    </v-col>
                    <v-col cols="auto" md="auto">
                        <v-hover v-slot="{ isHovering, props }" close-delay="100">
                            <v-card :elevation="isHovering ? 24 : 2" :class="{ 'on-hover': isHovering }" height="350"
                                width="350" v-bind="props" class="ma-2">
                                <v-img :src="require('@/assets/images/img-7.jpeg')" height="350" width="350" cover />
                            </v-card>
                        </v-hover>
                    </v-col>

                    <v-col cols="auto" md="auto">
                        <v-hover v-slot="{ isHovering, props }" close-delay="100">
                            <v-card :elevation="isHovering ? 24 : 2" :class="{ 'on-hover': isHovering }" height="350"
                                width="350" v-bind="props" class="ma-2">
                                <v-img :src="require('@/assets/images/img-8.jpeg')" height="350" width="350" cover />
                            </v-card>
                        </v-hover>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';
</script>

<style  scoped>
.as-transparent-blank {
    background-color: rgba(0, 0, 0, 0.39);
}
</style>