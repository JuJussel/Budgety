
<template>
    <div class="main">
        <div class="top-menu-bar">
            <Card>
                <template #content>
                    <h2 style="margin: 0">Budgety</h2>
                    <Avatar icon="pi pi-user" class="mr-2" shape="circle"
                /></template>
            </Card>
        </div>
        <div class="main-content">
            <div class="side-bar">
                <Card style="height: 100%">
                    <template #content>
                        <div
                            class="p-ripple"
                            v-ripple
                            v-for="(item, index) in menuItems"
                            :key="index"
                        >
                            <div
                                @click="
                                    $store.commit('SET_ACTIVE_VIEW', item.name)
                                "
                                class="menu-button"
                                v-bind:class="{
                                    active:
                                        $store.getters.activeView === item.name,
                                }"
                            >
                                {{ $t(item.name) }}
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
            <div class="content">
                <Card class="viewCard">
                    <template #header>
                        <h2 style="padding: 10px; margin-bottom: -30px">
                            {{ $t($store.getters.activeView) }}
                        </h2>
                    </template>
                    <template #content>
                        <component :is="$store.getters.activeView"></component>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
import Accounts from "../components/layouts/accounts";
import Loans from "../components/layouts/loans";

export default {
    components: {
        Accounts,
        Loans,
    },
    created() {
        if (this.$store.getters.user) {
            this.$router.push("/");
        } else {
            this.$router.push("/login");
        }
        this.prefetchData();
    },
    methods: {
        prefetchData() {
            let accounts = {
                collection: "accounts",
                filter: {},
            };
            this.$dataService("find", accounts).then((res) =>
                this.$store.commit("SET_VIEW_DATA", [
                    "accounts",
                    { data: res.documents },
                ])
            );
            let loans = {
                collection: "loans",
                filter: {},
            };
            this.$dataService("find", loans).then((res) =>
                this.$store.commit("SET_VIEW_DATA", [
                    "loans",
                    { data: res.documents },
                ])
            );
        },
    },
    data() {
        return {
            menuItems: [
                { name: "dashboard", icon: null },
                { name: "accounts", icon: null },
                { name: "loans", icon: null },
                { name: "cards", icon: null },
                { name: "cashflow", icon: null },
                { name: "categories", icon: null },
                { name: "budgets", icon: null },
                { name: "graphs", icon: null },
            ],
        };
    },
};
</script>

<style>
.top-menu-bar > div > div > .p-card-content {
    padding: 10px;
    display: flex;
    justify-content: space-between;
}
.top-menu-bar > div > .p-card-body {
    padding: 0;
}
</style>

<style scoped>
.main {
    display: grid;
    height: 100%;
    width: 100%;
    position: absolute;
    grid-template-rows: 60px calc(100% - 60px);
    background: #eff3f8;
    margin: -8px;
}

.top-menu-bar {
    padding: 10px;
}

.main-content {
    display: grid;
    grid-template-columns: 200px auto;
}

.side-bar {
    padding: 10px;
}

.menu-button {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 15px;
    cursor: pointer;
    transition: all ease 0.2s;
}
.menu-button:hover {
    background: #eff3f8;
}

.menu-button.active {
    color: var(--primary-color);
    font-weight: bold;
}

.content {
    padding: 10px;
    height: 100%;
    display: grid;
}
.viewCard .p-card-content {
    height: 100%;
    display: grid;
    grid-template-rows: 70px auto;
}
</style>
