<template lang="html">
  <div id="movies" class="movies flexbox">
    <ul class="flexbox cell wrap">
      <li class="cell movie pointer" :class="{loaded: movie.poster_path}"  v-for="movie in filteredMovies">
        <div class="flexbox column">
          <img v-if="movie.poster_path" :src="tmdb.GetImageUrl(movie.poster_path)" alt="Poster" class="poster cell">

          <div class="details pointer flexbox column">
            <span class="cell title pointer" :title="movie.title">{{movie.title}}</span>
            <span class="cell release_date pointer"><i class="zmdi zmdi-calendar"></i> {{tmdb.BeautifyDate(movie.release_date)}}</span>
            <span class="cell runtime pointer"><i class="zmdi zmdi-time"></i> {{movie.runtime}} Minuten</span>
            <span class="cell vote_average pointer"><i class="zmdi zmdi-star-outline"></i> {{movie.vote_average}} ({{movie.vote_count}})</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import Vue from "vue";
  import Tmdb from "../js/tmdb.js"

  export default {
  data() {
    return {
      tmdb: {}
    }
  },
  props: ["User", "movieIds" , "searchText", "sort"],
  mounted() {


    this.$on("searchFor", () => {
      console.log("searchFor");
    })
    //..Get movieIds
    let movieIds = JSON.parse(JSON.stringify(this.movieIds));

    this.tmdb = new Tmdb();

    for (var i = 0; i < movieIds.length; i++) {
      let movieId = movieIds[i];
      this.tmdb.Movies.push({id: movieId});
    }
    this.$emit("pushDialog", {message: 'Filme laden', status: "running"});
    let movieLoaderInterval = setInterval(() => {
      if(movieIds.length == 0)
      {
        this.$emit("changeDialog", {message: 'Filme laden', status: "running"}, {message: 'Filme geladen', status: "success"});
        clearInterval(movieLoaderInterval);
      }

      let moviePromises = [];
      let movieId = movieIds[0];
      if(movieId)
      {
        this.tmdb.GetMovieByIdPromise(movieId).
        then((request) => {
          let movie = request.data;

          let indOfMvObj = this.tmdb.Movies.findIndex(item => item.id === movieId);
          this.tmdb.Movies[indOfMvObj] = movie;
          movieIds.splice( movieIds.indexOf(movieId) , 1);
          this.tmdb.Movies.__ob__.dep.notify();
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
    }, 333);




  },

  methods: {

  },
  computed: {
    searchedMovies() {
      let filtMovies = [];
      if(this.tmdb.Movies)
      {
        filtMovies = this.tmdb.Movies;
        filtMovies = this.tmdb.Movies.filter((movie, index) => {
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
      if(this.tmdb.Movies)
      {
        var movies = this.tmdb.Movies;
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
  @import "../scss/flat-colors";

  #movies {
    margin: 20px;
    max-height: 100%;
    overflow: scroll;
    overflow-x: hidden;
    width: 100%;

    & > ul {
      // justify-content: center;
      width: 100%;
      align-items: baseline;
      //justify-content: space-between;
    }
  }

  .movie {
    width: 200px;
    max-height: 300px;
    margin: 20px 20px 20px 0;
    position: relative;

    &:not(.loaded) {
      border: 1px solid $flat-orange-2;
      min-height: 278px;
    }

    &.loaded {
      background: transparent;
    }

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

    &:hover {
      & .details {
        opacity: 1;
        bottom: 0px;
        height: 100px;
        padding: 10px;
        z-index: 9;
        //border-bottom: 5px solid $flat-orange-2;


      }
    }
  }

</style>
