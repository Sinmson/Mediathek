<template lang="html">
  <ul id="Movies" class="flexbox wrap">
      <MovieCover v-for="movie in filteredMovies" v-bind:key="movie.id" class="cell"
        v-bind:MovieTitle = "movie.title"
        v-bind:MoviePosterUrl = "tmdb.GetImageUrl(movie.poster_path, 'w185')"
        v-bind:MovieRuntime = "movie.runtime"
        v-bind:MovieReleaseDate = "tmdb.BeautifyDate(movie.release_date)"
        v-bind:MovieVoteAverage = "movie.vote_average"
        v-bind:MovieVoteCount= "movie.vote_count"
        v-bind:MovieId="movie.id"
      ></MovieCover>
  </ul>
</template>

<script>
  import Vue from "vue";
  import Tmdb from "../js/tmdb.js";
  import MovieCover from "./MovieCover.vue";

  export default {
  data() {
    return {
      tmdb: new Tmdb(),
      loadedAllMovies: false,
      movieLoaderInterval: 0
    }
  },
  components: {
    MovieCover
  },
  props: ["User", "searchText", "sort"],
  mounted() {

    this.$emit("deletePath", 1);
    this.$emit("changePath", 0 , "Filme", "Movies");

    if(this.getRemainingMovieIds().length == 0)
    {
      this.loadedAllMovies = true;
    }
    else
    {
      this.loadedAllMovies = false;
      this.startLoadingMovies();
    }




  },
  destroyed() {
    if(!this.loadedAllMovies)
    {
      clearInterval(this.movieLoaderInterval);

      this.$emit("changeDialog",  {message: 'Filme laden',                status: "running"},
                                  {message: 'Filme laden abgebrochen',  status: "error"});

    }
    this.loadedAllMovies = false;
    console.warn("Movies got destroyed");
  },
  methods: {
    arr_diff(a1, a2)
    {

        var a = [], diff = [];

        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }

        for (var i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }

        for (var k in a) {
            diff.push(k);
        }

        return diff;
    },

    startLoadingMovies()
    {
      let movieIds = this.getRemainingMovieIds();
      this.fillUserMoviesWithPlaceholders(movieIds);

      this.$emit("pushDialog", {message: 'Filme laden...', status: "running"});

      this.movieLoaderInterval = setInterval(this.moviesLoader, 333);
    },

    fillUserMoviesWithPlaceholders(movieIds)
    {
      for (var i = 0; i < movieIds.length; i++)
      {
        let movieId = +movieIds[i];
        let indOfMvObj = this.User.Movies.findIndex(item => item.id === movieId);
        if(indOfMvObj == -1)
        {
          this.User.Movies.push({id: movieId});
        }
      }
    },

    getRemainingMovieIds()
    {
      let movieIdsCopy = JSON.parse(JSON.stringify(this.User.movieIds));
      let movieIdsFromMovies = this.User.Movies.filter((movie) => {
        if(movie.title)
        {
          return true;
        }
        else
        {
          return false;
        }
      });

      movieIdsFromMovies = movieIdsFromMovies.map((movie) => {
        return +movie.id;
      })

      let movieIds = this.arr_diff(movieIdsCopy, movieIdsFromMovies);
      movieIds = movieIds.map((id) => {
        return +id;
      })

      return movieIds;
    },

    moviesLoader()
    {
      let movieIds = this.getRemainingMovieIds();

      if(movieIds.length > 0)
      {
        let movieId = movieIds[0];
        if(movieId)
        {
          this.setMovieById(movieId);
        }
      }
      else
      {
        this.loadedAllMovies = true;
        this.$emit("changeDialog",  {message: 'Filme laden',    status: "running"},
                                    {message: 'Filme geladen',  status: "success"});

        clearInterval(this.movieLoaderInterval);
      }
    },

    setMovieById(movieId) {
      this.tmdb.GetMovieByIdPromise(movieId).
      then((request) => {
        let movie = request.data;

        let indOfMvObj = this.User.Movies.findIndex(item => item.id === movieId);
        this.User.Movies[indOfMvObj] = movie;
        this.User.Movies.__ob__.dep.notify();
      })
      .catch( (error) => {
        if (error.response)
        {
           // The request was made and the server responded with a status code
           // that falls out of the range of 2xx
           console.log(error.response.data);
           console.log(error.response.status);
           console.log(error.response.headers);
         }
         else if (error.request)
         {
           // The request was made but no response was received
           // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
           // http.ClientRequest in node.js
           console.log(error.request);
         }
         else
         {
           // Something happened in setting up the request that triggered an Error
           console.log('Error', error.message);
         }
       });
    }
  },
  computed: {
    searchedMovies() {
      let filtMovies = [];
      if(this.User.Movies)
      {
        filtMovies = this.User.Movies;
        filtMovies = this.User.Movies.filter((movie, index) => {
          if(this.searchText && movie.title)
          {
            let textToSearchArr = this.searchText.toLowerCase().split(/[ ]+/);

            let correctnessCounter = 0;
            for(let i = 0; i < textToSearchArr.length; i++)
            {
              let textToSearch = textToSearchArr[i];
              let iOfSearchText = movie.title.toLowerCase().indexOf(textToSearch);

              if(iOfSearchText >= 0)
              {
                correctnessCounter++;
              }
            }
            if(correctnessCounter == textToSearchArr.length)
            {
              return true;
            }
            else
            {
              return false;
            }
          }
          else
          {
            return true;
          }
        });
      }

      return filtMovies;
    },
    filteredMovies() {
      if(this.User.Movies)
      {
        var movies = this.User.Movies;
        // console.log(this.searchText, this.searchText.length);
        if(this.searchText && this.searchText.length > 0)
        {
          movies = this.searchedMovies;
        }

        if(movies.length > 0)
        {
          movies.sort((a,b) => {
            if(a.hasOwnProperty("title") && !b.hasOwnProperty("title"))
            {
              return -1;
            }
            else if (!a.hasOwnProperty("title") && b.hasOwnProperty("title"))
            {
              return 1;
            }
            else if(!a.hasOwnProperty("title") && !b.hasOwnProperty("title"))
            {
              return 0;
            }

            if(this.sort.by == "title" && a.title && b.title)
            {
              // console.log("COMPARE " , a.title , " WITH " , b.title);
              let titleA = a.title.toLowerCase();
              let titleB = b.title.toLowerCase();

              if(titleA > titleB)
              {
                return 1;
              }
              else if(titleA < titleB)
              {
                return -1;
              }
              else
              {
                return 0;
              }
            }
            else if(this.sort.by == "vote_average" && a.vote_average && b.vote_average)
            {
              return b.vote_average - a.vote_average;
            }
            else if(this.sort.by == "release_date" && a.release_date && b.release_date)
            {
              return new Date(b.release_date) - new Date(a.release_date);
            }
            else
            {
              return 0;
            }
          }

        );
        }

        return movies;
      }
      else
      {
        return [];
      }
    }

  }
}
</script>

<style lang="scss">
</style>
