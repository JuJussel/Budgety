<template>
    <div>
        <div class="field">
            <label for="name"> {{ $t("name") }} </label>
            <InputText
                v-model="newBudget.data.name"
                id="name"
                aria-describedby="username2-help"
                style="width: 100%"
            />
        </div>
        <div class="field">
            <label> {{ $t("owner") }} </label>
            <Dropdown
                v-model="newBudget.data.owner"
                :options="$store.getters.owners"
            />
        </div>
        <div class="field">
            <label> {{ $t("account") }} </label>
            <Dropdown
                v-model="newBudget.data.account"
                :options="accounts"
                optionLabel="name"
                optionValue="_id"
            />
        </div>
        <div class="field">
            <label> {{ $t("category") }} </label>
            <Dropdown
                v-model="newBudget.data.category"
                :options="$store.getters.categories"
                :editable="true"
            />
        </div>

        <div class="field">
            <label for="budget"> {{ $t('budget') }} </label>
            <InputNumber
                v-model="newBudget.data.budget"
                inputId="budget"
                mode="currency"
                currency="JPY"
                locale="jp-JP"
            />
        </div>


        <p style="display: flex; justify-content: flex-end">
            <div
                v-if="newBudget.loading"
                style="display: flex; justify-items: center; align-items: center; margin-right: 10px"
            >
                <ProgressSpinner style="width: 30px; height: 30px" />
            </div>

            <Button
                @click="createnewBudget"
                :label="$t('addLoan')"
                class="p-button-sm"
                :disabled="
                    newBudget.data.name === '' ||
                    newBudget.data.owner === '' ||
                    newBudget.data.account === '' ||
                    newBudget.data.budget === null
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
            newBudget: {
                open: false,
                loading: false,
                data: {
                    name: "",
                    owner: "",
                    account: "",
                    category: "",
                    budget: ""
                },
            },
        };
    },
    methods: {
        createnewBudget() {
            this.newBudget.loading = true;
            var newBudget = this.newBudget.data;
            let query = {
                collection: "budgets",
                document: newBudget,
            };
            this.$dataService("insertOne", query).then((res) => {
                newBudget.id = res.insertedId;
                this.$store.commit("ADD_ITEM", ["budgets", newBudget]);
                this.$emit("close");
            });
        },
    },
    computed: {
        accounts() {
            return this.$store.getters.viewData.accounts.data?.filter(
                (i) => i.owner === this.newBudget.data.owner
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