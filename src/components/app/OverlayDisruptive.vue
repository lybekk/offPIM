<template>
  <v-overlay
    :value="showOverlay"
    color="warning"
    :z-index="9000"
    :opacity="0.2"
  >
    <v-alert
      color="primary"
      dark
      :icon="false"
      border="left"
      elevation="2"
      prominent
    >
      <template v-slot:prepend>
        <v-avatar
          class="ma-3"
          size="125"
          tile
        >
          <v-progress-circular
            color="warning"
            indeterminate
            size="64"
          />
        </v-avatar>
      </template>
      <h3
        class="headline"
        v-text="title"
      />
      <div v-text="message" />
    </v-alert>
  </v-overlay>
</template>

<script>
export default {
    name: 'OverlayDisruptive',
    props: {
        showOverlay: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        message: {
            type: String,
            default: ''
        }
    }
}
</script>