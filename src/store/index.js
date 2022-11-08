import { createStore } from "vuex";

var defaultState = function () {
    return {
        user: null,
        activeView: "Dashboard",
        viewData: null,
    };
};

export const store = createStore({
    state() {
        return defaultState();
    },

    getters: {
        activeView: (state) => state.activeView,
        user: (state) => state.user,
        viewData: (state) => state.viewData,
    },

    mutations: {
        CLEAR_STORE(state) {
            Object.assign(state, defaultState());
        },
        SET_ACTIVE_VIEW(state, view) {
            state.activeView = view;
        },
        SET_VIEW_DATA(state, data) {
            state.viewData = data;
        },
        SET_USER(state, data) {
            state.user = data;
        },
    },
    actions: {},
});
