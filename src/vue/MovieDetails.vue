<template lang="html">
  <div id="movieDetails"  class="flexbox cell column">
    <div
    v-cloak
    v-if="Movie"
    class="movieDetails flexbox cell"
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
      <ul class="flexbox cell movies">

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
  @import "../scss/flat-colors";


  #movieDetails {
    //padding: 50px;
    max-height: 100%;
    overflow-x: hidden;
    width: 100%;
    color: $flat-gray-1;
    position: relative;

    & ul.movies {
      align-items: flex-end;
      overflow: auto;
      margin: 0 10px 5px 10px;
      height: 350px;
      min-height: 350px;
      max-height: 350px;

      & #scrolNavigators {
        position: absolute;
        width: 100%;
        height: 100%;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;

        & > .arrow {
          color: $flat-gray-1;
          text-shadow: 0px 0px 15px black;
        }
      }
    }

    & > div {
      width: 100%;
      position: relative;
    }



    & > .movieDetails {
      background-position:  top center;
      background-repeat: no-repeat;
      background-size: cover;
      background-clip: border-box;
      background-origin: border-box;
      background-blend-mode: multiply;
      background-color: rgba(0, 0, 0, 0.3);

      width: 100%;
      padding: 20px;
      height: calc(100% - 360px);
      font-family: 'Open Sans', sans-serif;

      & .cover {
        width: auto;
        height: 100%;
        margin-left: 30px;

        background-color: rgba(0, 0, 0, 0.2);
        border: 2px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0px 0px 12px 3px rgba(0, 0, 0, 0.3);
      }

      & .details {
        padding: 30px;
        // background-color: rgba(0, 0, 0, 0.2);
        background-color: rgba(0, 0, 0, 0.4);
        border: 2px solid rgba(0, 0, 0, 0.1);
        // box-shadow: 0px 0px 12px 3px rgba(0, 0, 0, 0.3);
        box-shadow:  0px 0px 12px 3px rgba(230, 126, 34, 0.5);
        justify-content: space-between;
        transition: all 0.2s ease-in-out;


        // &:hover {
        //   background-color: rgba(0, 0, 0, 0.4);
        // }

        & .genres {
          font-size: 14px;
          line-height: 16px;
          height: auto;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid $flat-gray-1;

          & > span.genre {
            &:not(:last-of-type)::after {
              content: ',';
              margin-right: 5px;
            }
          }
        }

        & > .infos {
          width: 100%;

          & .title, & .description {
            padding-top: 0;
            margin-top: 0;
            color: $flat-gray-1;
            text-overflow: ellipsis;
          }

          & .title {
            margin-bottom: 5px;
          }

          & .description {
            max-width: 100%;
            height: 100%;
            overflow: auto;
          }

          & .smallInfos {
            justify-content: space-between;
          }
        }
      }
    }


  }

</style>
