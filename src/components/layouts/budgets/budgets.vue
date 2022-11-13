<template>
    <div
        v-if="!$store.getters.viewData.budgets.data"
        style="display: flex; justify-items: center"
    >
        <ProgressSpinner />
    </div>

    <div v-else>
        <p>
            <Button
                @click="newBudgetOpen = true"
                :label="$t('addBudget')"
                class="p-button-sm"
            />
        </p>
        <DataTable :value="budgets">
            <template #empty> {{ $t("noRecordsFound") }} </template>
            <Column field="name" :header="$t('name')"></Column>
            <Column field="owner" :header="$t('owner')"></Column>
            <Column field="account" :header="$t('account')">
                <template #body="slotProps">
                    {{
                        $store.getters.viewData.accounts.data?.find(
                            (i) => i._id === slotProps.data.account
                        ).name
                    }}
                </template>
            </Column>
            <Column field="category" :header="$t('category')"></Column>
            <Column field="budget" :header="$t('budget')">
                <template #body="slotProps">
                    {{
                        slotProps.data.budget.toLocaleString("ja-JP", {
                            style: "currency",
                            currency: "JPY",
                        })
                    }}
                </template>
            </Column>
        </DataTable>
    </div>
    <Dialog :header="$t('addCard')" v-model:visible="newBudgetOpen" :modal="true">
        <newBudget v-if="newBudgetOpen" @close="newBudgetOpen = false" />
    </Dialog>
</template>

<script>
import newBudget from "./budget_new.vue";

export default {
    components: {
        newBudget,
    },
    data() {
        return {
            newBudgetOpen: false,
        };
    },
    computed: {
        budgets() {
            return this.$store.getters.viewData.budgets.data || [];
        },
    },
};
</script>