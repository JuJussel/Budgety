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
        :closable="!newAccount.loading"
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
                loading: false,
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
            newAccount.loading = true;
            let newAccount = this.newAccount.data;
            let query = {
                dataSource: "Dev01",
                database: "budgety",
                collection: "accounts",
                documents: newAccount,
            };
            this.$dataService("insertOne", query).then((res) => {
                newAccount.id = res.insertId;
                this.$store.commit("ADD_ITEM", ["accounts", { newAccount }]);
                newAccount.loading = true;
                newAccount.open = false;
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