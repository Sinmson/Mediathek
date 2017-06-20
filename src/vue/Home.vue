<template lang="html">
  <h1>H O M E</h1>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted() {
    this.$emit("deletePath", 1);
    this.$emit("changePath", 0 , "Startseite", "Home");
  },
  destroyed() {
    console.warn("Home got destroyed");
  }

}
</script>

<style lang="css">
</style>
