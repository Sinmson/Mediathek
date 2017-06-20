<template lang="html">
  <div class="" id="TvSeriesDetails" class="flexbox column cell">
    <div
    v-cloak
    v-if="TvSeries"
    class="tvSeriesDetails flexbox cell"
    :style="{'background-image': `url(${this.tmdb.GetImageUrl(TvSeries.backdrop_path, 'original')})`}"
    >

      <div class="flexbox cell details">
        <div class="flexbox column cell infos">
          <h1 class="cell title">{{TvSeries.name}}</h1>
          <div class="flexbox cell genres noselect">
            <span class="cell genre" v-for="genre in TvSeries.genres">{{genre.name}}</span>
          </div>
          <!-- <span class="cell release_date">{{tmdb.BeautifyDate(TvSeries.release_date)}}</span> -->

          <p class="cell description ">{{TvSeries.overview}}</p>


          <div class="flexbox cell smallInfos noselect">
            <span class="cell release_date "><i class="zmdi zmdi-calendar"></i> {{tmdb.BeautifyDate(TvSeries.first_air_date)}}</span>
            <span class="cell runtime "><i class="zmdi zmdi-time"></i> {{TvSeries.number_of_episodes}} Episoden</span>
            <span class="cell runtime " v-if="TvSeries.number_of_seasons > 1"><i class="zmdi zmdi-time"></i> {{TvSeries.number_of_seasons}} Staffeln</span>
            <span class="cell vote_average "><i class="zmdi zmdi-star-outline"></i> {{TvSeries.vote_average}} ({{TvSeries.vote_count}})</span>
          </div>
        </div>


        <img :src="tmdb.GetImageUrl(TvSeries.poster_path, 'w500')" class="cell cover" alt="">

      </div>
    </div>
    <div class="flexbox cell">
      <ul class="flexbox cell tvSeries">

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
  @import "../scss/flat-colors";
  #TvSeriesDetails {
    //padding: 50px;
    max-height: 100%;
    overflow-x: hidden;
    width: 100%;
    color: $flat-gray-1;
    position: relative;

    & ul.tvSeries {
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



    & > .tvSeriesDetails {
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
