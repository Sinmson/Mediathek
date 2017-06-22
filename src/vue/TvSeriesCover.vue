<template lang="html">
  <li id="TvSeriesCover" class="flexbox cell" :class="{loaded: TvSeries.name}">
    <router-link :to="{ name: 'TvSeriesDetails', params: {id: TvSeries.id} }"
    class="flexbox cell tvSeries pointer column"
    >
      <img v-if="TvSeries.poster_path && TvSeries.name" :src="tmdb.GetImageUrl(TvSeries.poster_path, 'w185')" alt="Poster" class="poster cell noselect">

      <div v-if="TvSeries.name" class="details pointer flexbox column">
        <span class="cell title pointer" :title="TvSeries.name">{{TvSeries.name}}</span>
        <span class="cell release_date pointer" :title="TvSeries.status"><i class="zmdi zmdi-calendar"></i> {{tmdb.BeautifyDate(TvSeries.first_air_date)}} ({{TvSeries.status}})</span>
        <span v-if="TvSeries.number_of_episodes > 1 && TvSeries.number_of_seasons < 2" class="cell runtime pointer"><i class="zmdi zmdi-time"></i> {{TvSeries.number_of_episodes}} Episoden</span>
        <span v-else-if="TvSeries.number_of_episodes > 1 && TvSeries.number_of_seasons >= 2" class="cell runtime pointer"><i class="zmdi zmdi-time"></i> {{TvSeries.number_of_episodes}} Episoden  - {{TvSeries.number_of_seasons}} Staffeln</span>
        <span class="cell vote_average pointer"><i class="zmdi zmdi-star-outline"></i> {{TvSeries.vote_average}} ({{TvSeries.vote_count}})</span>
      </div>
    </router-link>
  </li>
</template>

<script>
  import Tmdb from "../js/tmdb.js";

  export default {
  name: "TvSeriesCover",
  props: ["TvSeries"],
  data() {
    return {
      tmdb: new Tmdb()
    }
  },
  mounted() {

  },
  destroyed() {

  }
}
</script>

<style lang="scss">
</style>
