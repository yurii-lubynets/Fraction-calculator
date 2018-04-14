import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
      {
        name: 'WelcomePage',
        path: '/',
        component: resolve => require(['./components/WelcomePage.vue'], resolve)
      },
      {
        name: 'FractionCalculator',
        path: '/fraction',
        component: resolve => require(['./components/FractionCalculator.vue'], resolve)
      },
      {
        name: 'WebSocketComments',
        path: '/webserver',
        component: resolve => require(['./components/WebSocketComments.vue'], resolve)
      }
    ]
})

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router: router
})
