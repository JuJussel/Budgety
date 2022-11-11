<template>
    <div
        v-if="!$store.getters.viewData.loans.data"
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
            <template #empty> No records found </template>
            <Column field="name" header="Name"></Column>
            <Column field="owner" header="Owner"></Column>
            <Column field="balance" header="Balance"></Column>
            <Column field="balance" header="Remaining Payments"></Column>
            <Column field="balance" header="Remaining Balance"></Column>
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
    computed: {
        loans() {
            return this.$store.getters.viewData?.loans.data || [];
        },
    },
};
</script>