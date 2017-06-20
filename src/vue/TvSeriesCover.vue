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
  @import "../scss/flat-colors";
  #TvSeriesCover {
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

    & .tvSeries {
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

          & .title, & .release_date {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          & i.zmdi {
            padding-right: 2px;
            color: #121212;
          }
        }
      }
    }

</style>
