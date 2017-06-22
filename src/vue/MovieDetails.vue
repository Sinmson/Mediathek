<template lang="html">
  <div id="MovieDetails"  class="flexbox cell column">
    <div
    v-cloak
    v-if="Movie"
    class="detailbox flexbox cell"
    :style="{'background-image': `url(${this.tmdb.GetImageUrl(Movie.backdrop_path, 'original')})`}"
    >

      <div class="flexbox cell details">
        <div class="flexbox column cell infos">
          <h1 class="cell title">{{Movie.title}}</h1>
          <div class="flexbox cell genres noselect">
            <span class="cell genre" v-for="genre in Movie.genres">{{genre.name}}</span>
          </div>
          <!-- <span class="cell release_date">{{tmdb.BeautifyDate(Movie.release_date)}}</span> -->

          <p class="cell description ">{{Movie.overview}}</p>


          <div class="flexbox cell smallInfos noselect">
            <span class="cell release_date "><i class="zmdi zmdi-calendar"></i> {{tmdb.BeautifyDate(Movie.release_date)}}</span>
            <span class="cell runtime "><i class="zmdi zmdi-time"></i> {{Movie.runtime}} Minuten</span>
            <span class="cell vote_average "><i class="zmdi zmdi-star-outline"></i> {{Movie.vote_average}} ({{Movie.vote_count}})</span>
          </div>
        </div>


        <img :src="tmdb.GetImageUrl(Movie.poster_path, 'w500')" class="cell cover" alt="">

      </div>
    </div>
    <div class="flexbox cell">
      <ul class="flexbox cell recommendations">

        <MovieCover v-for="recommendedMovie in Movie.recommendations"  v-bind:key="recommendedMovie.id"  class="cell"
          v-bind:MovieTitle = "recommendedMovie.title"
          v-bind:MoviePosterUrl = "tmdb.GetImageUrl(recommendedMovie.poster_path, 'w185')"
          v-bind:MovieRuntime = "recommendedMovie.runtime"
          v-bind:MovieReleaseDate = "tmdb.BeautifyDate(recommendedMovie.release_date)"
          v-bind:MovieVoteAverage = "recommendedMovie.vote_average"
          v-bind:MovieVoteCount= "recommendedMovie.vote_count"
          v-bind:MovieId="recommendedMovie.id"
        ></MovieCover>

        <!-- <div id="scrolNavigators" class="flexbox cell">
          <i class="zmdi zmdi-arrow-left zmdi-hc-5x arrow pointer" @click="moviesEl.scrollLeft -= 200"></i>
          <i class="zmdi zmdi-arrow-right zmdi-hc-5x arrow pointer" @click="moviesEl.scrollLeft += 200"></i>
        </div> -->
      </ul>
    </div>


  </div>
</template>

<script>

import Tmdb from "../js/tmdb.js";
import MovieCover from "./MovieCover.vue";

export default {
  name: "MovieDetails",
  components: {
    MovieCover
  },
  data() {
    return {
      tmdb: new Tmdb(),
      Movie : false,
      moviesEl: {}
    }
  },
  mounted() {
    this.loadMovieFromParameter();
  },
  computed: {

  },
  methods: {
    loadMovieFromParameter() {
      this.tmdb.GetMovieByIdPromise(this.$route.params.id).then(request => {
        this.Movie = request.data;
        this.tmdb.GetMovieRecommandationsPromise(this.Movie.id).then(request => {
          //console.log(this.Movie);
          this.Movie.recommendations = request.data.results;
          this.$emit("changePath", 0 , "Filme", "Movies");
          this.$emit("changePath", 1 , this.Movie.title, "MovieDetails");
          this.Movie.__ob__.dep.notify();
        });
      });
    }
  },
  watch: {
    $route: function(newVal) {
      //console.log("New Value", newVal);
      this.loadMovieFromParameter();
    }
  },
  destroyed() {
    console.warn("MovieDetails got destroyed");
  }
}
</script>

<style lang="scss" scoped>
</style>
