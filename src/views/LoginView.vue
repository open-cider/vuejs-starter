<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { signInWithOpenCider } from "../lib/opencider";
import { setToken } from "../lib/session";

const router = useRouter();
const route = useRoute();
const pending = ref(false);
const error = ref<string | null>(null);

const message = computed(
  () => error.value ?? (route.query.reason === "expired" ? "Your session ended. Sign in again to continue." : null)
);

async function signIn() {
  pending.value = true;
  error.value = null;
  try {
    const token = await signInWithOpenCider();
    setToken(token);
    await router.replace("/dashboard");
  } catch (err) {
    console.error("[opencider] sign-in failed:", err);
    error.value = "Sign-in didn't complete. Close any open sign-in window and try again.";
    pending.value = false;
  }
}
</script>

<template>
  <main class="center">
    <section class="panel">
      <h1>Sign in</h1>
      <p class="muted">Passwordless single sign-on, powered by Open Cider.</p>

      <p v-if="message" role="alert" class="notice">{{ message }}</p>

      <button type="button" class="button" :disabled="pending" @click="signIn">
        {{ pending ? "Waiting for Open Cider…" : "Continue with Open Cider" }}
      </button>
    </section>
  </main>
</template>
