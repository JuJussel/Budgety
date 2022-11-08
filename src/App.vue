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
    },
};
</script>

<style>
body {
    margin: 0
}
</style>
