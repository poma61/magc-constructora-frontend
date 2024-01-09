import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import middleware from '@/http/middleware/middleware';
//add 
import LoginView from '@/views/LoginView.vue';
import UsuarioView from '@/views/UsuarioView.vue';
import authExpiration from '@/http/middleware/authExpiration';
import authenticate from '@/http/middleware/authenticate';
import checkRole from '@/http/middleware/checkRole';
import rendirect from '@/http/middleware/redirect';
import NotFound from '@/views/NotFound.vue';
import InicioView from '@/views/InicioView.vue';
import TransaccionPagoCoutaView from '@/views/TransaccionPagoCoutaView.vue';
import ClienteView from '@/views/ClienteView.vue';
import DesarrolladoraView from '@/views/DesarrolladoraView.vue';
import PersonalView from '@/views/PersonalView.vue';
import ProfileView from '@/views/ProfileView.vue';
import AccessDenied from '@/views/AccessDenied.vue';

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
      middleware(rendirect),
      middleware(authenticate),
      middleware(checkRole, ['administrador', 'usuario'])
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
      middleware(rendirect),
      middleware(authenticate),
      middleware(checkRole, ['administrador', 'usuario'])
    ],
  },

  {
    path: '/',
    name: 'n-login',
    component: LoginView,
    meta: {
      requireAuth: false,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(rendirect),
      middleware(authenticate),
      middleware(checkRole, ['administrador', 'usuario'])
    ],
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
      middleware(rendirect),
      middleware(authenticate),
      middleware(checkRole, ['administrador', 'usuario'])
    ],
  },

  {
    path: '/desarrolladora',
    name: 'n-desarrolladora',
    component: DesarrolladoraView,
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(rendirect),
      middleware(authenticate),
      middleware(checkRole, ['administrador'])
    ],
  },

  {
    path: '/cliente',
    name: 'n-cliente',
    component: ClienteView,
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(rendirect),
      middleware(authenticate),
      middleware(checkRole, ['administrador', 'usuario'])
    ],
  },

  {
    path: '/usuario',
    name: 'n-usuario',
    component: UsuarioView,
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(rendirect),
      middleware(authenticate),
      middleware(checkRole, ['administrador'])
    ],
  },

  {
    path: '/transaccion-pago-couta',
    name: 'n-transaccion-pago-couta',
    component: TransaccionPagoCoutaView,
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(rendirect),
      middleware(authenticate),
      middleware(checkRole, ['administrador'])
    ], 
  },

  {
    path: '/personal',
    name: 'n-personal',
    component: PersonalView,
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(rendirect),
      middleware(authenticate),
      middleware(checkRole, ['administrador'])
    ],
  },

  {
    path: '/contrato-cliente',
    name: 'n-contrato-cliente',
    component: () => import(/* webpackChunkName: "cliente" */ '@/views/ContratoView.vue'),
    meta: {
      requireAuth: true,
    },
    beforeEnter: [
      middleware(authExpiration),
      middleware(rendirect),
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
      middleware(rendirect),
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
