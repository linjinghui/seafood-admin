// import Vue from 'vue';
import Router from 'vue-router';

const Login = () => import('./login/index.vue');
const Index = () => import('./index/index.vue');
const Product = () => import('./product/index.vue');

Vue.use(Router);

export default new Router({
  mode: 'hash', // history, hash
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    }, 
    {
      path: '/home',
      name: 'index',
      component: Index,
      children: [
        {
          path: '/home/product',
          name: 'product',
          component: Product,
          children: []
        }
      ]
    }
  ]
});