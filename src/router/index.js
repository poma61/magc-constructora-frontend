import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import UsuarioView from '@/views/UsuarioView.vue'
import authExpiration from '@/http/middleware/authExpiration'
import authenticate from '@/http/middleware/authenticate'
import NotFound from '@/views/NotFound.vue';
import InicioView from '@/views/InicioView.vue';
import HistorialDePagoClienteView from '@/views/HistorialDePagoClienteView.vue';
import ClienteView from '@/views/ClienteView.vue';
import DesarrolladoraView from '@/views/DesarrolladoraView.vue';

const routes = [
  //esta parte es cuando se introduce una url que no existe 
  {
    path: '/:pathMatch(.*)',
    component: NotFound,
    meta: {
      requireAuth: true,
    }
  },

  {
    path: '/',
    name: 'n-login',
    component: LoginView,
    meta: {
      requireAuth: false,
    }
  },
  {
    path: '/inicio',
    name: 'n-inicio',
    component: InicioView,
    meta: {
      requireAuth: true,
    }
  },

  {
    path: '/desarrolladora',
    name: 'n-desarrolladora',
    component: DesarrolladoraView,
    meta: {
      requireAuth: true,
    }
  },

  {
    path: '/cliente',
    name: 'n-cliente',
    component: ClienteView,
    meta: {
      requireAuth: true,
    }
  },

  {
    path: '/usuario',
    name: 'n-usuario',
    component: UsuarioView,
    meta: {
      requireAuth: true,
    }
  },

  {
    path: '/historial-de-pago-cliente',
    name: 'n-historial-de-pago-cliente',
    component: HistorialDePagoClienteView,
    meta: {
      requireAuth: true,
    }
  },


  {
    path: '/contrato-cliente',
    name: 'n-contrato-cliente',
    component: () => import(/* webpackChunkName: "cliente" */ '@/views/ContratoView.vue'),
    meta: {
      requireAuth: true,
    }
  },

]

const router = createRouter({
  //history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})


//agregar middleware para proteger mlas rutas
router.beforeEach((to, from, next) => {
  authExpiration();
  authenticate(to, from, next);
});

export default router
