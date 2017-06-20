<template lang="html">
  <div class="">
    <h1>M U S I C</h1>
    <ul>
      <router-link tag="li" :to="{ name: 'Home'}">Get Me To Home</router-link>
      <router-link tag="li" :to="{ name: 'Music'}">Get Me To Music</router-link>
      <router-link tag="li" :to="{ name: 'Movies'}">Get Me To Movies</router-link>
      <router-link tag="li" :to="{ name: 'TvSeries'}">Get Me To TvSeries</router-link>
    </ul>

  </div>

</template>

<script>
export default {
  data() {
    return {

    }
  },
  mounted() {
    this.$emit("changePath", 0 , "Musik", "Music");
  },
  destroyed() {
    console.warn("Music got destroyed");
  }
}
</script>

<style lang="css">
</style>
