<script setup>
const request = "https://httpbin.org/post"
</script>

<template>
    <vue-finder id='my_vuefinder' :request="request"></vue-finder>
</template>