<template>
    <div>
        <div class="field">
            <label for="name"> {{ $t("name") }} </label>
            <InputText
                v-model="newCard.data.name"
                id="name"
                aria-describedby="username2-help"
                style="width: 100%"
            />
        </div>
        <div class="field">
            <label> {{ $t("owner") }} </label>
            <Dropdown
                v-model="newCard.data.owner"
                :options="$store.getters.owners"
            />
        </div>
        <div class="field">
            <label> {{ $t("payFrom") }} </label>
            <Dropdown
                v-model="newCard.data.account"
                :options="accounts"
                optionLabel="name"
                optionValue="_id"
            />
        </div>

        <p style="display: flex; justify-content: flex-end">
            <div
                v-if="newCard.loading"
                style="display: flex; justify-items: center; align-items: center; margin-right: 10px"
            >
                <ProgressSpinner style="width: 30px; height: 30px" />
            </div>

            <Button
                @click="createNewCard"
                :label="$t('addLoan')"
                class="p-button-sm"
                :disabled="
                    newCard.data.name === '' ||
                    newCard.data.owner === '' ||
                    newCard.data.payments === '' ||
                    newCard.data.startDate === '' ||
                    newCard.data.account === '' ||
                    newCard.data.balance === null
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
            newCard: {
                open: false,
                loading: false,
                data: {
                    name: "",
                    owner: "",
                    account: "",
                },
            },
        };
    },
    methods: {
        createNewCard() {
            this.newCard.loading = true;
            var newCard = this.newCard.data;
            let query = {
                collection: "cards",
                document: newCard,
            };
            this.$dataService("insertOne", query).then((res) => {
                newCard.id = res.insertedId;
                this.$store.commit("ADD_ITEM", ["cards", newCard]);
                this.$emit("close");
            });
        },
    },
    computed: {
        accounts() {
            return this.$store.getters.viewData.accounts.data?.filter(
                (i) => i.owner === this.newCard.data.owner
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