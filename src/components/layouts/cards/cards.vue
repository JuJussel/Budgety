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
                @click="newCardOpen = true"
                :label="$t('addCard')"
                class="p-button-sm"
            />
        </p>
        <DataTable :value="cards">
            <template #empty> {{ $t("noRecordsFound") }} </template>
            <Column field="name" :header="$t('name')"></Column>
            <Column field="owner" :header="$t('owner')"></Column>
            <Column field="account" :header="$t('payFrom')">
                <template #body="slotProps">
                    {{
                        $store.getters.viewData.accounts?.find(
                            (i) => i._id === slotProps.data.account
                        ).name
                    }}
                </template>
            </Column>
        </DataTable>
    </div>
    <Dialog :header="$t('addCard')" v-model:visible="newCardOpen" :modal="true">
        <newCard v-if="newCardOpen" @close="newCardOpen = false" />
    </Dialog>
</template>

<script>
import newCard from "./card_new.vue";

export default {
    components: {
        newCard,
    },
    data() {
        return {
            newCardOpen: false,
        };
    },
    computed: {
        cards() {
            return this.$store.getters.viewData.cards || [];
        },
    },
};
</script>