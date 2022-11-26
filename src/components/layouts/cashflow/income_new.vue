<template>
    <div>
        <div class="field">
            <label for="name"> {{ $t("name") }} </label>
            <InputText
                v-model="newIncome.data.name"
                id="name"
                aria-describedby="username2-help"
                style="width: 100%"
            />
        </div>
        <div class="field">
            <label> {{ $t("owner") }} </label>
            <Dropdown
                v-model="newIncome.data.owner"
                :options="$store.getters.owners"
            />
        </div>
        <div class="field">
            <label> {{ $t("account") }} </label>
            <Dropdown
                v-model="newIncome.data.account"
                :options="accounts"
                optionLabel="name"
                optionValue="_id"
            />
        </div>
        <div class="field">
            <label> {{ $t("category") }} </label>
            <Dropdown
                v-model="newIncome.data.category"
                :options="$store.getters.categories"
                :editable="true"
            />
        </div>

        <div class="field">
            <label for="amount"> {{ $t('amount') }} </label>
            <InputNumber
                v-model="newIncome.data.amount"
                inputId="amount"
                mode="currency"
                currency="JPY"
                locale="jp-JP"
            />
        </div>

        <div class="field">
            <label for="date"> {{ $t('date') }} </label>
            <Calendar inputId="date" v-model="newIncome.data.date" autocomplete="off" />
        </div>
        <div class="field">
            <label for="repeat"> {{ $t('monthly') }} </label>
            <InputSwitch inputId="repeat" v-model="newIncome.data.repeat" />
        </div>
        <div class="field" v-if="newIncome.data.repeat">
            <label for="endDate"> {{ $t('endDate') }} </label>
            <Calendar inputId="endDate" v-model="newIncome.data.endDate" autocomplete="off" />
        </div>




        <p style="display: flex; justify-content: flex-end">
            <div
                v-if="newIncome.loading"
                style="display: flex; justify-items: center; align-items: center; margin-right: 10px"
            >
                <ProgressSpinner style="width: 30px; height: 30px" />
            </div>

            <Button
                @click="createnewIncome"
                :label="$t('addIncome')"
                class="p-button-sm"
                :disabled="
                    newIncome.data.name === '' ||
                    newIncome.data.owner === '' ||
                    newIncome.data.account === '' ||
                    newIncome.data.date === '' ||
                    !newIncome.data.amount
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
            newIncome: {
                open: false,
                loading: false,
                data: {
                    name: "",
                    owner: "",
                    account: "",
                    category: "",
                    amount: 0,
                    date: "",
                    type: "income",
                    repeat: false,
                    endDate: null,
                },
            },
        };
    },
    methods: {
        createnewIncome() {
            this.newIncome.loading = true;
            var newIncome = this.newIncome.data;
            let query = {
                collection: "entries",
                document: newIncome,
            };
            this.$dataService("insertOne", query).then((res) => {
                newIncome.id = res.insertedId;
                this.$store.commit("ADD_ENTRY", newIncome);
                this.$emit("close");
            });
        },
    },
    computed: {
        accounts() {
            return this.$store.getters.viewData.accounts.filter(
                (i) => i.owner === this.newIncome.data.owner
            );
        },
    },
};
</script>
