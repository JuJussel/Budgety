<template>
    <div class="cashflow-main">
        <DataTable :value="income">
            <template #empty> {{ $t("noRecordsFound") }} </template>
            <template #header>
                <div
                    style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    "
                >
                    <h3 class="m-0">{{ $t("income") }}</h3>
                    <Button
                        @click="newIncomeOpen = true"
                        :label="$t('addIncome')"
                        class="p-button-sm"
                        style="height: 42px"
                    />
                </div>
            </template>
            <Column field="name" :header="$t('name')"></Column>
            <Column field="owner" :header="$t('owner')"></Column>
            <Column field="account" :header="$t('account')">
                <template #body="slotProps">
                    {{
                        $store.getters.viewData.accounts?.find(
                            (i) => i._id === slotProps.data.account
                        ).name
                    }}
                </template>
            </Column>
            <Column field="category" :header="$t('category')"></Column>
            <Column field="amount" :header="$t('amount')">
                <template #body="slotProps">
                    {{
                        slotProps.data.amount.toLocaleString("ja-JP", {
                            style: "currency",
                            currency: "JPY",
                        })
                    }}
                </template>
            </Column>
            <Column field="date" :header="$t('date')">
                <template #body="slotProps">
                    {{ $formatDate(slotProps.data.date) }}
                </template>
            </Column>
        </DataTable>
        <DataTable :value="expenses">
            <template #empty> {{ $t("noRecordsFound") }} </template>
            <template #header>
                <div
                    style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    "
                >
                    <h3 class="m-0">{{ $t("expenses") }}</h3>
                    <Button
                        @click="newExpenseOpen = true"
                        :label="$t('addExpense')"
                        class="p-button-sm"
                        style="height: 42px"
                    />
                </div>
            </template>
            <Column field="name" :header="$t('name')"></Column>
            <Column field="owner" :header="$t('owner')"></Column>
            <Column field="account" :header="$t('account')">
                <template #body="slotProps">
                    {{
                        $store.getters.viewData.accounts?.find(
                            (i) => i._id === slotProps.data.account
                        ).name
                    }}
                </template>
            </Column>
            <Column field="category" :header="$t('category')"></Column>
            <Column field="amount" :header="$t('amount')">
                <template #body="slotProps">
                    {{
                        slotProps.data.amount.toLocaleString("ja-JP", {
                            style: "currency",
                            currency: "JPY",
                        })
                    }}
                </template>
            </Column>
            <Column field="date" :header="$t('date')">
                <template #body="slotProps">
                    {{ $formatDate(slotProps.data.date) }}
                </template>
            </Column>
        </DataTable>

        <Dialog
            :header="$t('addIncome')"
            v-model:visible="newIncomeOpen"
            :modal="true"
        >
            <newIncome v-if="newIncomeOpen" @close="newIncomeOpen = false" />
        </Dialog>
        <Dialog
            :header="$t('addExpense')"
            v-model:visible="newExpenseOpen"
            :modal="true"
        >
            <newExpense v-if="newExpenseOpen" @close="newExpenseOpen = false" />
        </Dialog>
    </div>
</template>

<script>
import newIncome from "./income_new.vue";
import newExpense from "./expense_new.vue";

export default {
    components: {
        newIncome,
        newExpense,
    },
    data() {
        return {
            newIncomeOpen: false,
            newExpenseOpen: false,
        };
    },
    computed: {
        income() {
            return this.$store.getters.viewData.income;
        },
        expenses() {
            return this.$store.getters.viewData.expenses;
        },
    },
};
</script>

<style scoped>
.cashflow-main {
    display: grid;
    grid-template-columns: 50% auto;
    grid-gap: 20px;
}
</style>