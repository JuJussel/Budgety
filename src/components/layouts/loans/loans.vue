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
                @click="newLoanOpen = true"
                :label="$t('addLoan')"
                class="p-button-sm"
            />
        </p>
        <DataTable :value="loans">
            <template #empty> {{ $t("noRecordsFound") }} </template>
            <Column field="name" :header="$t('name')"></Column>
            <Column field="owner" :header="$t('owner')"></Column>
            <Column field="account" :header="$t('payFrom')">
                <template #body="slotProps">
                    {{
                        $store.getters.viewData.accounts?.find(
                            (i) => i._id === slotProps.data.account
                        )?.name
                    }}
                </template>
            </Column>
            <Column field="balance" :header="$t('balance')">
                <template #body="slotProps">
                    {{
                        slotProps.data.balance.toLocaleString("ja-JP", {
                            style: "currency",
                            currency: "JPY",
                        })
                    }}
                </template>
            </Column>
            <Column field="payments" :header="$t('remainingPayments')">
                <template #body="slotProps">
                    {{ remainingPayments(slotProps.data.payments) }}
                </template>
            </Column>
        </DataTable>
    </div>
    <Dialog :header="$t('addLoan')" v-model:visible="newLoanOpen" :modal="true">
        <newLoan v-if="newLoanOpen" @close="newLoanOpen = false" />
    </Dialog>
</template>

<script>
import newLoan from "./loan_new.vue";

export default {
    components: {
        newLoan,
    },
    data() {
        return {
            newLoanOpen: false,
        };
    },
    methods: {
        remainingPayments(payments) {
            let today = new Date();
            return payments.filter((i) => new Date(i.date) > today).length;
        },
    },
    computed: {
        loans() {
            return this.$store.getters.viewData.loans || [];
        },
    },
};
</script>