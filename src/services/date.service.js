import lang from "../locales/en.json";

export default {
    install: (app) => {
        app.config.globalProperties.$formatDate = function (date) {
            const instance = this;
            let year = new Date(date).getFullYear();
            let month = new Date(date).getMonth();
            let day = new Date(date).getDate();

            return (
                year +
                this.$t("yearAppend") +
                month +
                this.$t("monthAppend") +
                day +
                this.$t("dayAppend")
            );
        };
    },
};
