import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { store } from './store'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Ripple from 'primevue/ripple';
import Avatar from 'primevue/avatar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Row from 'primevue/row';

import Home from './views/home.vue';
import Login from './views/login.vue';


import 'primevue/resources/themes/lara-light-purple/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App);
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', name: 'Home', component: Home },
        { path: '/login', name: 'Login', component: Login }
    ]
})

app.use(PrimeVue, { ripple: true });
app.use(store);
app.use(router)

app.component('Card', Card);
app.component('Button', Button);
app.component('Avatar', Avatar);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Row', Row);

app.directive('ripple', Ripple);

app.mount('#app');