<template lang="html">
  <li id="MovieCover" class="flexbox cell" :class="{loaded: MovieTitle}">
    <router-link :to="{ name: 'MovieDetails', params: {id: MovieId} }" class="flexbox cell movie pointer column" :class="{loaded: MovieRuntime || MovieTitle}">
      <img v-if="MovieRuntime || MovieTitle" :src="MoviePosterUrl" alt="Poster" class="poster cell noselect">

      <div class="details pointer flexbox column">
        <span class="cell title pointer" :title="MovieTitle">{{MovieTitle}}</span>
        <span class="cell release_date pointer"><i class="zmdi zmdi-calendar"></i> {{MovieReleaseDate}}</span>
        <span class="cell runtime pointer"><i class="zmdi zmdi-time"></i> {{MovieRuntime}} Minuten</span>
        <span class="cell vote_average pointer"><i class="zmdi zmdi-star-outline"></i> {{MovieVoteAverage}} ({{MovieVoteCount}})</span>
      </div>
    </router-link>
  </li>
</template>

<script>
import Tmdb from "../js/tmdb.js";

export default {
  name: "MovieCover",
  props: ["MovieTitle", "MoviePosterUrl", "MovieRuntime", "MovieReleaseDate", "MovieVoteAverage", "MovieVoteCount", "MovieId"],
  data() {
    return {
    }
  },
  methods: {

  },
  computed: {
  },
  mounted() {
    //console.log("Mounted", this);
  },
  destroyed() {
    console.warn("MovieCover got destroyed");
  }
}
</script>

<style lang="scss" scoped>
  @import "../scss/flat-colors";


</style>
