<template lang="html">
  <div id="movieDetails"  class="flexbox">
    <div class="backdrop_image"
    :style="{'background-image': `url(${this.tmdb.GetImageUrl(Movie.backdrop_path, 'original')})`}">
    </div>
    <div class="cell flexbox column">
      <img :src="tmdb.GetImageUrl(Movie.poster_path)" class="cell cover" alt="">
      <span class="cell fill"></span>
    </div>

    <div class="flexbox cell column">
      <h1 class="cell title">{{Movie.title}}</h1>
      <span class="cell release_date">{{tmdb.BeautifyDate(Movie.release_date)}}</span>

      <p class="description">{{Movie.overview}}</p>
    </div>

  </div>
</template>

<script>

import Tmdb from "../js/tmdb.js"

export default {
  name: "MovieDetails",
  data() {
    return {
      tmdb: {},
      Movie : {}
    }
  },
  mounted() {
    this.tmdb = new Tmdb();

    this.tmdb.GetMovieByIdPromise(this.$route.params.id).then(request => {
      console.log(request.data);
      this.Movie = request.data;
    })
  },
  computed: {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  @import "../scss/flat-colors";

#movieDetails {
  padding: 50px;
  max-height: 100%;
  overflow-x: hidden;
  width: 100%;
  color: $flat-gray-1;
  position: relative;
  z-index: 2;

  & * {
    z-index: 3;
  }
  & .backdrop_image {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
    width: 100%;
    height: 100%;

    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-clip: border-box;
    background-origin: border-box;

    -webkit-filter: blur(3px);
    -moz-filter:    blur(3px);
    -o-filter:      blur(3px);
    -ms-filter:     blur(3px);
    filter:         blur(3px);
  }



  & .cover {
    width: 200px;
    max-height: 300px;
  }

  & .title, & .description {
    color: $flat-gray-1;
  }
}

</style>
