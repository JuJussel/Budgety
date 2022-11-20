<template>
    <div>
        <div class="field">
            <label for="name"> {{ $t("name") }} </label>
            <InputText
                v-model="newLoan.data.name"
                id="name"
                aria-describedby="username2-help"
                style="width: 100%"
            />
        </div>
        <div class="field">
            <label> {{ $t("owner") }} </label>
            <Dropdown
                v-model="newLoan.data.owner"
                :options="$store.getters.owners"
            />
        </div>
        <div class="field">
            <label> {{ $t("payFrom") }} </label>
            <Dropdown
                v-model="newLoan.data.account"
                :options="accounts"
                optionLabel="name"
                optionValue="_id"
            />
        </div>
        <!-- <div class="field">
            <label for="balance"> {{ $t('balance') }} </label>
            <InputNumber
                v-model="newLoan.data.balance"
                inputId="balance"
                mode="currency"
                currency="JPY"
                locale="jp-JP"
            />
        </div> -->
        <div class="field">
            <label for="startDate"> {{ $t('startDate') }} </label>
            <Calendar inputId="startDate" v-model="newLoan.data.startDate" autocomplete="off" />
        </div>

        <div class="field">
            <label for="payments"> {{ $t('payments') }} </label>
            <Textarea inputId="payments" v-model="newLoan.data.payments" rows="5" cols="30" />
        </div>

        <p style="display: flex; justify-content: flex-end">
            <div
                v-if="newLoan.loading"
                style="display: flex; justify-items: center; align-items: center; margin-right: 10px"
            >
                <ProgressSpinner style="width: 30px; height: 30px" />
            </div>

            <Button
                @click="createNewLoan"
                :label="$t('addLoan')"
                class="p-button-sm"
                :disabled="
                    newLoan.data.name === '' ||
                    newLoan.data.owner === '' ||
                    newLoan.data.payments === '' ||
                    newLoan.data.startDate === '' ||
                    newLoan.data.account === '' ||
                    newLoan.data.balance === null
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
            newLoan: {
                open: false,
                loading: false,
                data: {
                    name: "",
                    owner: "",
                    balance: 0,
                    payments: "",
                    startDate: "",
                    account: "",
                    type: "loan",
                },
            },
        };
    },
    methods: {
        createNewLoan() {
            let payments = this.newLoan.data.payments.split("\n");
            console.log(payments);
            return;
            let paymentsArr = [];
            let startDate = new Date(this.newLoan.data.startDate);
            payments.forEach((el, index) => {
                let date = new Date(
                    startDate.setMonth(startDate.getMonth() + 1)
                );
                let item = { date: date, payment: el };
                paymentsArr.push(item);
            });
            this.newLoan.data.payments = paymentsArr;

            this.newLoan.loading = true;
            var newLoan = this.newLoan.data;
            let query = {
                collection: "entries",
                document: newLoan,
            };
            this.$dataService("insertOne", query).then((res) => {
                newLoan.id = res.insertedId;
                this.$store.commit("ADD_ENTRY", newLoan);
                this.$emit("close");
            });
        },
    },
    computed: {
        accounts() {
            return this.$store.getters.viewData.accounts?.filter(
                (i) => i.owner === this.newLoan.data.owner
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