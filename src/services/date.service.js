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
        app.config.globalProperties.$monthDiff = function (d1, d2) {
            // Old date first
            var months;
            months = (d2.getFullYear() - d1.getFullYear()) * 12;
            months -= d1.getMonth();
            months += d2.getMonth();
            return months <= 0 ? 0 : months;
        }
    },
};
