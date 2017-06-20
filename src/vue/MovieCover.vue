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

  #MovieCover {
    width: 185px;
    min-width: 185px;
    max-width: 185px;
    max-height: 278px;
    height: 278px;
    min-height: 278px;
    margin: 20px 10px 20px 10px;
    overflow: hidden;
    position: relative;
    align-items: flex-end;

    &:not(.loaded) {
      border: 1px solid $flat-orange-2;
      min-height: 278px;
    }

    &.loaded:hover {
      & .details {
        opacity: 1;
        bottom: 0px;
        height: 100px;
        padding: 10px;
      }
    }

    & .movie {

      & .details {
        position: absolute;
        text-align: left;
        // background: rgba(0, 0 , 0 , 0.85);
        background: rgba(230, 126, 34, 0.95);
        font-size: 12px;
        color: white;
        width: 100%;
        opacity: 0;
        bottom: 0;
        height: 0px;
        padding: 0;
        overflow: hidden;
        transition: all 0.4s ease-in-out;
        font-family: 'Open Sans', sans-serif;

        // text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
        // z-index: -1;

        & .title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          font-weight: bold;
          // border-bottom: 1px solid #121212;
          margin-bottom: auto;
        }

        & i.zmdi {
          padding-right: 2px;
          color: #121212;
        }
      }
    }
  }
</style>
