<template>
    <div>
        <div class="field">
            <label for="name"> {{ $t("name") }} </label>
            <InputText
                v-model="newExpense.data.name"
                id="name"
                aria-describedby="username2-help"
                style="width: 100%"
            />
        </div>
        <div class="field">
            <label> {{ $t("owner") }} </label>
            <Dropdown
                v-model="newExpense.data.owner"
                :options="$store.getters.owners"
            />
        </div>
        <div class="field">
            <label> {{ $t("account") }} </label>
            <Dropdown
                v-model="newExpense.data.account"
                :options="accounts"
                optionLabel="name"
                optionValue="_id"
            />
        </div>
        <div class="field">
            <label> {{ $t("category") }} </label>
            <Dropdown
                v-model="newExpense.data.category"
                :options="$store.getters.categories"
                :editable="true"
            />
        </div>

        <div class="field">
            <label for="amount"> {{ $t('amount') }} </label>
            <InputNumber
                v-model="newExpense.data.amount"
                inputId="amount"
                mode="currency"
                currency="JPY"
                locale="jp-JP"
            />
        </div>

        <div class="field">
            <label for="date"> {{ $t('date') }} </label>
            <Calendar inputId="date" v-model="newExpense.data.date" autocomplete="off" />
        </div>
        <div class="field">
            <label for="repeat"> {{ $t('monthly') }} </label>
            <InputSwitch inputId="repeat" v-model="newExpense.data.repeat" />
        </div>
        <div class="field" v-if="newExpense.data.repeat">
            <label for="endDate"> {{ $t('endDate') }} </label>
            <Calendar inputId="endDate" v-model="newExpense.data.endDate" autocomplete="off" />
        </div>




        <p style="display: flex; justify-content: flex-end">
            <div
                v-if="newExpense.loading"
                style="display: flex; justify-items: center; align-items: center; margin-right: 10px"
            >
                <ProgressSpinner style="width: 30px; height: 30px" />
            </div>

            <Button
                @click="createnewExpense"
                :label="$t('addExpense')"
                class="p-button-sm"
                :disabled="
                    newExpense.data.name === '' ||
                    newExpense.data.owner === '' ||
                    newExpense.data.account === '' ||
                    newExpense.data.date === '' ||
                    !newExpense.data.amount
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
            newExpense: {
                open: false,
                loading: false,
                data: {
                    name: "",
                    owner: "",
                    account: "",
                    category: "",
                    amount: 0,
                    date: "",
                    type: "expense",
                    repeat: false,
                    endDate: ""
                },
            },
        };
    },
    methods: {
        createnewExpense() {
            this.newExpense.loading = true;
            var newExpense = this.newExpense.data;
            let query = {
                collection: "cashflow",
                document: newExpense,
            };
            this.$dataService("insertOne", query).then((res) => {
                newExpense.id = res.insertedId;
                this.$store.commit("ADD_ITEM", ["cashflow", newExpense]);
                this.$emit("close");
            });
        },
    },
    computed: {
        accounts() {
            return this.$store.getters.viewData.accounts.data?.filter(
                (i) => i.owner === this.newExpense.data.owner
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