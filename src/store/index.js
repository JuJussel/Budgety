import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
});

var defaultState = function () {
    return {
        user: null,
        activeView: "dashboard",
        entries: null,
        viewData: {
            accounts: [],
            loans: [],
            cards: [],
            income: [],
            expenses: [],
            budgets: [],
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
        viewData: function (state) {
            return {
                accounts: state.entries.filter(i => i.type === 'account') || [],
                loans: state.entries.filter(i => i.type === 'loan') || [],
                cards: state.entries.filter(i => i.type === 'card') || [],
                expenses: state.entries.filter(i => i.type === 'expense') || [],
                income: state.entries.filter(i => i.type === 'income') || [],
                budgets: state.entries.filter(i => i.type === 'budget') || []
            }
        },
        entries: (state) => state.entries,
        owners: function (state) {
            let owners = [];
            state.entries?.forEach((e) => {
                e.owner && owners.indexOf(e.owner) === -1
                    ? owners.push(e.owner)
                    : null;
            });
            return owners;
        },
        categories: function (state, getters) {
            let categories = [];
            getters.viewData.budgets?.forEach((i) => {
                let index = categories.indexOf(i.category);
                if (index < 0) categories.push(i.category);
            });
            getters.viewData.income?.forEach((i) => {
                let index = categories.indexOf(i.category);
                if (index < 0) categories.push(i.category);
            });
            getters.viewData.expenses?.forEach((i) => {
                let index = categories.indexOf(i.category);
                if (index < 0) categories.push(i.category);
            });

            return categories;
        },
    },

    mutations: {
        SET_ENTRIES(state, data) {
            state.entries = data
        },
        ADD_ENTRY(state, data) {
            state.entries.push(data)
        },
        UPDATE_ENTRIY(state) {

        },
        CLEAR_STORE(state) {
            Object.assign(state, defaultState());
        },
        RESET_VIEW_DATA(state) {
            state.viewData = defaultState().viewData;
        },
        SET_ACTIVE_VIEW(state, view) {
            state.activeView = view;
        },
        SET_USER(state, data) {
            state.user = data;
        },
    },
    actions: {},
});
