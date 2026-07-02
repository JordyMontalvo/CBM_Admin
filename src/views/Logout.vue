<template></template>

<script>
import api from "@/api";

export default {
  async created() {
    const account = JSON.parse(localStorage.getItem("session"));

    try {
      await api.auth.ADMIN_LOGOUT();
    } catch (e) {}

    localStorage.removeItem("session");
    localStorage.removeItem("sessionToken");

    if (account?.type == "admin") this.$router.push("/login");
    if (account?.type == "office") this.$router.push("/sucursal");
    if (!account) this.$router.push("/login");
  },
};
</script>
