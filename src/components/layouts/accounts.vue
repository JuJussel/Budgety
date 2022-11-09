<template>
    <div
        v-if="!$store.getters.viewData.accounts.data"
        style="display: flex; justify-items: center"
    >
        <ProgressSpinner />
    </div>
    <div v-else>
        <p>
            <Button
                @click="newAccount.open = true"
                :label="$t('addAccount')"
                class="p-button-sm"
            />
        </p>
        <DataTable :value="accounts">
            <template #empty> {{ $t("noRecordsFound") }} </template>
            <Column field="name" header="Name"></Column>
            <Column field="owner" header="Owner"></Column>
            <Column field="balance" header="Balance"></Column>
        </DataTable>
    </div>

    <Dialog
        :header="$t('addAccount')"
        v-model:visible="newAccount.open"
        :modal="true"
    >
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
            <label for="name"> {{ $t("name") }} </label>
            <Dropdown
                v-model="newAccount.data.owner"
                optionLabel="name"
                :options="$store.getters.owners"
                :editable="true"
            />
        </div>
        <div class="field">
            <label for="balance">Balance</label>
            <InputNumber
                v-model="newAccount.data.balance"
                inputId="balance"
                mode="currency"
                currency="JPY"
                locale="jp-JP"
            />
        </div>
        <p style="display: flex; justify-content: flex-end">
            <Button
                @click="createNewAccount"
                :label="$t('addAccount')"
                class="p-button-sm"
                :disabled="
                    newAccount.data.name === '' ||
                    newAccount.data.owner === '' ||
                    newAccount.data.balance === ''
                "
            />
        </p>
    </Dialog>
</template>

<script>
export default {
    computed: {
        accounts() {
            return this.$store.getters.viewData?.accounts.data || [];
        },
    },
    data() {
        return {
            newAccount: {
                open: false,
                data: {
                    name: "",
                    owner: "",
                    balance: "",
                },
            },
        };
    },
    methods: {
        fetchData() {},
        createNewAccount() {
            let query = {
                dataSource: "Dev01",
                database: "budgety",
                collection: "accounts",
                filter: {},
            };
            this.$dataService("find", query).then((res) =>
                this.$store.commit("SET_VIEW_DATA", [
                    "accounts",
                    { data: res.documents },
                ])
            );
        },
    },
};
</script>

<style scoped>
.field * {
    display: flex;
}
</style>