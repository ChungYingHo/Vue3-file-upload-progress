<script setup>
import VueFinder from './components/VueFinder.vue';
import Uppy from './components/Uppy.vue'
import Axios from './components/Axios.vue';
import Stream from './components/Stream.vue';
import { ref } from 'vue'

const tab = ref(null)
</script>

<template>
    <v-card style="min-width: 50vw;min-height: 75vh;width: fit-content;height: fit-content;">
      <v-tabs
        v-model="tab"
        color="deep-purple-accent-4"
        align-tabs="end"
      >
        <v-tab :value="1">ReadableStream</v-tab>
        <v-tab :value="2">Axios</v-tab>
        <v-tab :value="3">VueFinder</v-tab>
        <v-tab :value="4">Uppy</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item :value="1">
          <v-container fluid class="d-flex justify-center align-center">
            <Stream v-if="tab === 1"/>
          </v-container>
        </v-window-item>
        <v-window-item :value="2">
          <v-container fluid class="d-flex justify-center align-center">
            <Axios v-if="tab === 2"/>
          </v-container>
        </v-window-item>
        <v-window-item :value="3">
          <v-container fluid>
            <VueFinder v-if="tab === 3"/>
          </v-container>
        </v-window-item>
        <v-window-item :value="4">
          <v-container fluid class="d-flex justify-center align-center">
            <Uppy v-if="tab === 4"/>
          </v-container>
        </v-window-item>
      </v-window>
    </v-card>
</template>

