<template>
    <div class="login-body">
        <div style="width: 400px">
            <Card>
                <template #content>
                    <div class="login-card">
                        <h1 class="login-heading">
                            <span>Butgety Login</span>
                            <ProgressSpinner
                                v-if="loading"
                                style="width: 30px; height: 30px"
                            />
                        </h1>
                        <InputText
                            :disabled="loading"
                            type="text"
                            v-model="email"
                            style="margin-top: 10px"
                        />
                        <InputText
                            v-on:keyup.enter="checkAuth"
                            :disabled="loading"
                            type="password"
                            v-model="password"
                            style="margin-top: 10px"
                        />
                        <Button
                            :disabled="loading"
                            label="Submit"
                            @click="checkAuth"
                            style="margin-top: 10px"
                        />

                        <Message
                            v-if="error"
                            severity="error"
                            :closable="false"
                            style="margin-top: 10px"
                        >
                            {{ error }}
                        </Message>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script>
export default {
    created() {
        if (this.$store.getters.user) {
            this.$router.push("/");
        } else {
            this.$router.push("/login");
        }
    },
    data() {
        return {
            email: "jujussel@gmail.com",
            password: "",
            error: null,
            loading: false,
        };
    },
    methods: {
        async checkAuth() {
            this.loading = true;
            this.error = null;
            let body = {
                collection: "accounts",
                limit: 1,
                filter: {},
            };
            let res = await this.$dataService("find", body, {
                email: this.email,
                password: this.password,
            });
            if (res.error) {
                this.error = res.error_code;
                this.loading = false;
            } else {
                this.$store.commit("SET_USER", {
                    email: this.email,
                    password: this.password,
                });
                this.$router.push("/");
            }
        },
    },
};
</script>

<style scoped>
.login-heading {
    margin: 0px;
    display: flex;
    align-items: center;
}
.login-card {
    display: flex;
    flex-direction: column;
}
.login-body {
    height: 100%;
    position: absolute;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-ground);
}
</style>