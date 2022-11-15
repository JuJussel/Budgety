<template>
    <router-view></router-view>
</template>

<script>
export default {
    created() {
        if (this.$store.getters.user) {
            this.$router.push("/");
        } else {
            this.$router.push("/login");
        }
        this.$store.commit("RESET_VIEW_DATA");
    },
};
</script>

<style>
body {
    margin: 0;
}
.field * {
    display: flex;
}
</style>
