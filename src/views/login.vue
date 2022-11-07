<template>
    <div>Login</div>
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
