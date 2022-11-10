import config from "../config/config.json"

export default {
    install: (app) => {
        app.config.globalProperties.$dataService = function (
            action,
            body,
            auth
        ) {
            const instance = this;
            const email = instance.$store.getters.user?.email || auth.email;
            const password =
                instance.$store.getters.user?.password || auth.password;
            return new Promise(function (resolve, reject) {
                fetch(
                    config.dataUrl +
                    action,
                    {
                        method: "POST",
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods":
                                "GET,HEAD,POST,OPTIONS",
                            "Access-Control-Max-Age": "86400",
                            "Content-Type": "application/json",
                            email: email,
                            password: password,
                        },
                        body: JSON.stringify(body),
                    }
                )
                    .then((res) => {
                        res.json().then((result) => resolve(result));
                    })
                    .catch((res) => {
                        reject(res);
                    });
            });
        };
    },
};
