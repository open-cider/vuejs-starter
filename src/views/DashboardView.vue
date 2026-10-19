<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import ProfileCard from "../components/ProfileCard.vue";
import { getClient } from "../lib/opencider";
import { clearToken, getToken } from "../lib/session";

const router = useRouter();
const profile = ref<unknown>(null);
const loading = ref(true);

function signOut() {
  clearToken();
  router.replace("/login");
}

onMounted(async () => {
  const token = getToken();
  if (!token) {
    router.replace("/login");
    return;
  }

  try {
    const client = await getClient(token);
    profile.value = await client.document.get();
    loading.value = false;
  } catch (err) {
    console.error("[opencider] could not resume session:", err);
    clearToken();
    router.replace({ path: "/login", query: { reason: "expired" } });
  }
});
</script>

<template>
  <main class="shell">
    <header class="bar">
      <strong>Open Cider Starter</strong>
      <button type="button" class="button ghost" @click="signOut">Sign out</button>
    </header>

    <h1>Dashboard</h1>
    <p v-if="loading" class="muted">Loading profile…</p>
    <ProfileCard v-else :profile="profile" />
  </main>
</template>
