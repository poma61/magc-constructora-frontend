import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import middleware from '@/http/middleware/middleware';
//add 
import authExpiration from '@/http/middleware/authExpiration';
import authenticate from '@/http/middleware/authenticate';
import checkRole from '@/http/middleware/checkRole';
import redirectifauthenticated from '@/http/middleware/redirectIfAuthenticated';
import NotFound from '@/views/NotFound.vue';
import InicioView from '@/views/InicioView.vue';
import ProfileView from '@/views/ProfileView.vue';
import AccessDenied from '@/views/AccessDenied.vue';

/*
Para hacer que el sistema sea mas rapido debemos importar el componente de forma diferente,
se realiza esto en casos de que la vista tenga muchos componentes y/o el sistema tenga muchas vistas
asi de esta manera separamos en archivos diferentes y con eso mejoramos el renderizado del sistema.
*/
//component: () => import(/* webpackChunkName: "nombreArchivo" */ '@/views/TransaccionPagoCoutaView.vue'),
const routes = [
  //esta parte es cuando se introduce una url que no existe 
  {
    path: '/:pathMatch(.*)',
    component: NotFound,
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectifauthenticated),
      middleware(authenticate),
    ],
  },

  {
    path: '/access-denied',
    component: AccessDenied,
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectifauthenticated),
      middleware(authenticate),
    ],
  },

  {
    path: '/',
    name: 'n-login',
    component: () => import(/* webpackChunkName: "LoginView" */ '@/views/LoginView.vue'),
  },
  {
    path: '/inicio',
    name: 'n-inicio',
    component: InicioView,
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectifauthenticated),
      middleware(authenticate),
      middleware(checkRole, ['administrador', 'usuario'])
    ],
  },

  {
    path: '/desarrolladora',
    name: 'n-desarrolladora',
    component: () => import(/* webpackChunkName: "DesarrolladoraView" */ '@/views/DesarrolladoraView.vue'),
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectifauthenticated),
      middleware(authenticate),
      middleware(checkRole, ['administrador'])
    ],
  },

  {
    path: '/cliente',
    name: 'n-cliente',
    component: () => import(/* webpackChunkName: "ClienteView" */ '@/views/ClienteView.vue'),
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectifauthenticated),
      middleware(authenticate),
      middleware(checkRole, ['administrador', 'usuario'])
    ],
  },

  {
    path: '/usuario',
    name: 'n-usuario',
    component: () => import(/* webpackChunkName: "UsuarioView" */ '@/views/UsuarioView.vue'),
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectifauthenticated),
      middleware(authenticate),
      middleware(checkRole, ['administrador'])
    ],
  },

  {
    path: '/transaccion-pago-couta',
    name: 'n-transaccion-pago-couta',
    component: () => import(/* webpackChunkName: "TransaccionPagoCoutaView" */ '@/views/TransaccionPagoCoutaView.vue'),
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectifauthenticated),
      middleware(authenticate),
      middleware(checkRole, ['administrador'])
    ],
  },

  {
    path: '/personal',
    name: 'n-personal',
    component: () => import(/* webpackChunkName: "PersonalView" */ '@/views/PersonalView.vue'),
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectifauthenticated),
      middleware(authenticate),
      middleware(checkRole, ['administrador'])
    ],
  },

  {
    path: '/contrato-cliente',
    name: 'n-contrato-cliente',
    component: () => import(/* webpackChunkName: "ContratoView" */ '@/views/ContratoView.vue'),
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectifauthenticated),
      middleware(authenticate),
      middleware(checkRole, ['administrador', 'usuario'])
    ],
  },

  {
    path: '/perfil',
    name: 'n-perfil',
    component: ProfileView,
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(redirectifauthenticated),
      middleware(authenticate),
      middleware(checkRole, ['administrador', 'usuario'])
    ],
  },

]

const router = createRouter({
  //history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router
