import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
});

var defaultState = function () {
    return {
        user: null,
        activeView: "dashboard",
        viewData: {
            accounts: { data: null },
            loans: { data: null },
            cards: { data: null },
            cashflow: { data: null },
            categories: { data: null },
            budgets: { data: null },
        },
    };
};

export const store = createStore({
    plugins: [vuexLocal.plugin],
    state() {
        return defaultState();
    },

    getters: {
        activeView: (state) => state.activeView,
        user: (state) => state.user,
        viewData: (state) => state.viewData,
        owners: function (state) {
            let owners = [];
            state.viewData.accounts.data.forEach((e) => {
                e.owner && owners.indexOf(e.owner) === -1
                    ? owners.push(e.owner)
                    : null;
            });
            return owners;
        },
    },

    mutations: {
        CLEAR_STORE(state) {
            Object.assign(state, defaultState());
        },
        RESET_VIEW_DATA(state) {
            state.viewData = defaultState().viewData
        },
        SET_ACTIVE_VIEW(state, view) {
            state.activeView = view;
        },
        SET_VIEW_DATA(state, data) {
            Object.assign(state.viewData[data[0]], data[1]);
        },
        SET_USER(state, data) {
            state.user = data;
        },
        ADD_ITEM(state, data) {
            state.viewData[data[0]].data.push(data);
        },
    },
    actions: {},
});
