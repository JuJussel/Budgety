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
            <Column field="type" header="Type"></Column>
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
            <InputText id="name" aria-describedby="username2-help" />
        </div>
        <div class="field">
            <label for="name"> {{ $t("name") }} </label>
            <InputText id="name" aria-describedby="username2-help" />
        </div>
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
                data: {},
            },
        };
    },
    methods: {
        fetchData() {},
    },
};
</script>

<style scoped>
.field * {
    display: block;
}
</style>