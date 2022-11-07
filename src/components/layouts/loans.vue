<template>
    <p><Button label="Add Loan" class="p-button-sm" /></p>
    <DataTable :value="accounts">
        <template #empty> No records found </template>
        <Column field="name" header="Name"></Column>
        <Column field="type" header="Type"></Column>
        <Column field="owner" header="Owner"></Column>
        <Column field="balance" header="Balance"></Column>
    </DataTable>
</template>

<script>
export default {
    computed: {
        accounts() {
            return this.$store.getters.viewData?.loans || [];
        },
    },
};
</script>