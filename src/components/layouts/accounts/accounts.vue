<template>
    <div
        v-if="!$store.getters.entries"
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
            <Column field="name" :header="$t('name')"></Column>
            <Column field="type" :header="$t('type')"></Column>
            <Column field="owner" :header="$t('owner')"></Column>
            <Column field="balance" :header="$t('balance')">
                <template #body="slotProps">
                    {{ getBalance(slotProps.data.balance) }}
                </template>
            </Column>
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
            return this.$store.getters.viewData?.accounts || [];
        },
    },
    data() {
        return {
            newAccountOpen: false,
        };
    },
    methods: {
        getBalance(balances) {
            let balance = balances.at(-1);
            return balance.balance.toLocaleString("ja-JP", {
                style: "currency",
                currency: "JPY",
            });
        },
    },
};
</script>
