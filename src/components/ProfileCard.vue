<script setup lang="ts">
import { computed } from "vue";
import { buildProfileView } from "../lib/profile";

const props = defineProps<{ profile: unknown }>();
const view = computed(() => buildProfileView(props.profile));
</script>

<template>
  <p v-if="!view" class="muted">No profile details were returned for this account yet.</p>

  <article v-else class="profile">
    <div class="profile-head">
      <img
        v-if="view.avatarSrc"
        class="avatar"
        :src="view.avatarSrc"
        :alt="`${view.title ?? 'Your'} avatar`"
        width="96"
        height="96"
        referrerpolicy="no-referrer"
      />
      <div v-else class="avatar avatar-fallback" aria-hidden="true">{{ view.initials }}</div>

      <div>
        <h2 class="profile-name">{{ view.title ?? "Your profile" }}</h2>
        <p v-if="view.username" class="muted profile-username">@{{ view.username }}</p>
      </div>
    </div>

    <dl v-if="view.fields.length > 0" class="fields">
      <div v-for="field in view.fields" :key="field.key">
        <dt>{{ field.label }}</dt>
        <dd>{{ field.value }}</dd>
      </div>
    </dl>
  </article>
</template>
