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
                @click="newAccountOpen = true"
                :label="$t('addAccount')"
                class="p-button-sm"
            />
        </p>
        <DataTable :value="accounts" selectionMode="single">
            <template #empty> {{ $t("noRecordsFound") }} </template>
            <Column field="name" header="Name"></Column>
            <Column field="owner" header="Owner"></Column>
            <Column field="balance" header="Balance"></Column>
        </DataTable>
    </div>

    <Dialog
        :header="$t('addAccount')"
        v-model:visible="newAccountOpen"
        :modal="true"
    >
        <newAccount v-if="newAccountOpen" @close="newAccountOpen = false" />
    </Dialog>
</template>

<script>
import newAccount from "./account_new.vue";

export default {
    components: {
        newAccount,
    },
    computed: {
        accounts() {
            return this.$store.getters.viewData?.accounts.data || [];
        },
    },
    data() {
        return {
            newAccountOpen: false,
        };
    },
    methods: {},
};
</script>
