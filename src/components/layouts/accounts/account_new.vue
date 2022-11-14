<template>
    <div>
        <div class="field">
            <label for="name"> {{ $t("name") }} </label>
            <InputText
                v-model="newAccount.data.name"
                id="name"
                aria-describedby="username2-help"
                style="width: 100%"
            />
        </div>

        <div class="field">
            <label> {{ $t("owner") }} </label>
            <Dropdown
                v-model="newAccount.data.owner"
                :options="$store.getters.owners"
                :editable="true"
            />
        </div>
        <div class="field">
            <label for="balance"> {{ $t('balance') }} </label>
            <InputNumber
                v-model="newAccount.data.balance"
                inputId="balance"
                mode="currency"
                currency="JPY"
                locale="jp-JP"
            />
        </div>
        <p style="display: flex; justify-content: flex-end">
            <div
                v-if="newAccount.loading"
                style="display: flex; justify-items: center; align-items: center; margin-right: 10px"
            >
                <ProgressSpinner style="width: 30px; height: 30px" />
            </div>

            <Button
                @click="createNewAccount"
                :label="$t('addAccount')"
                class="p-button-sm"
                :disabled="
                    newAccount.data.name === '' ||
                    newAccount.data.owner === '' ||
                    newAccount.data.balance === null
                "
            />
        </p>
    </div>
</template>

<script>
export default {
    emits: ["close"],
    data() {
        return {
            newAccount: {
                open: false,
                loading: false,
                data: {
                    name: "",
                    owner: "",
                    balance: 0,
                    type: "account",
                },
            },
        };
    },
    methods: {
        createNewAccount() {
            this.newAccount.loading = true;
            var newAccount = this.newAccount.data;
            newAccount.balance = [
                { date: new Date(), balance: newAccount.balance },
            ];
            let query = {
                collection: "entries",
                document: newAccount,
            };
            this.$dataService("insertOne", query).then((res) => {
                newAccount.id = res.insertedId;
                this.$store.commit("ADD_ENTRY", newAccount);
                this.$emit("close");
            });
        },
    },
};
</script>

<style scoped>
.field * {
    display: flex;
}
</style>