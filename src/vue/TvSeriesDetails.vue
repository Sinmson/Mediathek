<template lang="html">
  <div class="" id="TvSeriesDetails" class="flexbox column cell">
    <div
    v-cloak
    v-if="TvSeries"
    class="detailbox flexbox"
    :style="{'background-image': `url(${this.tmdb.GetImageUrl(TvSeries.backdrop_path, 'original')})`}"
    >

      <div class="flexbox cell details">
        <div class="flexbox column cell infos">
          <img :src="tmdb.GetImageUrl(TvSeries.poster_path, 'w500')" class="tabletCover" alt=""/>
          <h1 class="cell title">{{TvSeries.name}}</h1>
          <div class="flexbox cell genres noselect">
            <span class="cell genre" v-for="genre in TvSeries.genres">{{genre.name}}</span>
          </div>
          <!-- <span class="cell release_date">{{tmdb.BeautifyDate(TvSeries.release_date)}}</span> -->

          <p class="cell description ">
            {{TvSeries.overview}}
          </p>


          <div class="flexbox cell smallInfos noselect">
            <span class="cell release_date "><i class="zmdi zmdi-calendar"></i> {{tmdb.BeautifyDate(TvSeries.first_air_date)}}</span>
            <span class="cell runtime "><i class="zmdi zmdi-time"></i> {{TvSeries.number_of_episodes}} Episoden</span>
            <span class="cell runtime " v-if="TvSeries.number_of_seasons > 1"><i class="zmdi zmdi-time"></i> {{TvSeries.number_of_seasons}} Staffeln</span>
            <span class="cell vote_average "><i class="zmdi zmdi-star-outline"></i> {{TvSeries.vote_average}} ({{TvSeries.vote_count}})</span>
          </div>
        </div>
        <img :src="tmdb.GetImageUrl(TvSeries.poster_path, 'w500')" class="cover" alt=""/>

      </div>
    </div>
    <div class="flexbox cell">
      <ul class="flexbox cell recommendations">
        <TvSeriesCover v-for="recommendedTvSeries in TvSeries.recommendations"  v-bind:key="recommendedTvSeries.id"  class="cell"
          v-bind:TvSeries = "recommendedTvSeries"
        ></TvSeriesCover>
      </ul>
    </div>
  </div>
</template>

<script>
import Tmdb from "../js/tmdb.js";
import TvSeriesCover from "./TvSeriesCover.vue";


export default {
  name: "TvSeriesDetails",
  data() {
    return {
      tmdb: new Tmdb(),
      TvSeries: false
    }
  },
  mounted() {
      this.loadTvSeriesFromParameter();
  },
  destroyed() {

  },
  methods: {
    loadTvSeriesFromParameter() {
      this.tmdb.GetTvSeriesRequestPromise(this.$route.params.id)
      .then(request => {
        this.TvSeries = request.data;

        this.tmdb.GetTvSeriesRecommandationsRequestPromise(this.TvSeries.id)
        .then(request => {

          this.TvSeries.recommendations = request.data.results;

          var promieses = this.TvSeries.recommendations.map((recommendation) => {
            return this.tmdb.GetTvSeriesRequestPromise(recommendation.id, "en")
          });

          Promise.all(promieses)
          .then(requests => {
            for (let request of requests)
            {
              var index = this.TvSeries.recommendations.findIndex(item => item.id == request.data.id);
              this.$set(this.TvSeries.recommendations, index, request.data);
              this.TvSeries.__ob__.dep.notify();
            }

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

          this.$emit("changePath", 0 , "Tv Serien", "TvSeries");
          this.$emit("changePath", 1 , this.TvSeries.name, "TvSeriesDetails");
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

        if(!this.TvSeries.overview)
        {
          this.tmdb.GetTvSeriesRequestPromise(this.TvSeries.id, "en")
          .then((request) => {
            let tvSeries = request.data;
            this.TvSeries.overview = tvSeries.overview;
            this.TvSeries.name = tvSeries.name + " (" + tvSeries.original_name + ")";
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
  watch: {
    $route: function(newRoute) {
      this.loadTvSeriesFromParameter();
    }
  },
  components: {
    TvSeriesCover
  }

}
</script>

<style lang="scss" scoped>

</style>
