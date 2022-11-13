import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { store } from "./store";
import App from "./App.vue";
import DataService from "./services/data.service";
import FormatDate from "./services/date.service";
import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

import PrimeVue from "primevue/config";
import Card from "primevue/card";
import Button from "primevue/button";
import Ripple from "primevue/ripple";
import Avatar from "primevue/avatar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Row from "primevue/row";
import InputText from "primevue/inputtext";
import ProgressSpinner from "primevue/progressspinner";
import Message from "primevue/message";
import Dialog from "primevue/dialog";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import Calendar from "primevue/calendar";
import InputSwitch from "primevue/inputswitch";
import Chart from "primevue/chart";

import Home from "./views/home.vue";
import Login from "./views/login.vue";

import "primevue/resources/themes/lara-light-purple/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

const app = createApp(App);
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/", name: "Home", component: Home },
        { path: "/login", name: "Login", component: Login },
    ],
});

const i18n = createI18n({
    legacy: true,
    globalInjection: true,
    locale: "en",
    fallbackLocale: "en",
    availableLocales: ["en", "jp"],
    messages: messages,
});

app.use(i18n);
app.use(PrimeVue, { ripple: true });
app.use(store);
app.use(router);
app.use(DataService);
app.use(FormatDate);

app.component("Card", Card);
app.component("Button", Button);
app.component("Avatar", Avatar);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("Row", Row);
app.component("InputText", InputText);
app.component("ProgressSpinner", ProgressSpinner);
app.component("Message", Message);
app.component("Dialog", Dialog);
app.component("InputNumber", InputNumber);
app.component("Dropdown", Dropdown);
app.component("Textarea", Textarea);
app.component("Calendar", Calendar);
app.component("InputSwitch", InputSwitch);
app.component("Chart", Chart);

app.directive("ripple", Ripple);

app.mount("#app");
