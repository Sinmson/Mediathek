<template lang="html">
  <ul id="TvSeries" class="flexbox cell wrap">
      <TvSeriesCover class="cell"
        v-for="tvSeries in filteredTvSeries"
        v-bind:key="tvSeries.id"
        v-bind:TvSeries="tvSeries"
      ></TvSeriesCover>
  </ul>
</template>

<script>
  import Vue from "vue";
  import Tmdb from "../js/tmdb.js";
  import TvSeriesCover from "./TvSeriesCover.vue";
  export default {
  name: "TvSeries",
  props: ["User", "sort"],
  data() {
    return {
      tmdb: new Tmdb(),
      loadedAllTvSeries: false,
      tvSeriesLoaderInterval: 0
    }
  },
  mounted() {
    this.$emit("deletePath", 1);
    this.$emit("changePath", 0 , "Tv Serien", "TvSeries");

    let remainingTvSeriesIds = this.getRemainingTvSeriesIds();
    console.log("remainingTvSeriesIds", remainingTvSeriesIds);

    if(remainingTvSeriesIds.length > 0)
    {
      this.loadedAllTvSeries = false;
      this.$emit("pushDialog", {message: "Tv Serien laden...", status: "running"});
      for(var tvSeriesId of remainingTvSeriesIds)
      {
        let indOfTvSerObj = this.User.TvSeries.findIndex(item => item.id === tvSeriesId);
        if(indOfTvSerObj == -1)
        {
          this.User.TvSeries.push({id: +tvSeriesId});
        }
      }

      this.tvSeriesLoaderInterval = setInterval(this.loadTvSeries, 333);
    }
    else
    {
        this.loadedAllTvSeries = true;
    }
  },
  destroyed() {
    console.warn("TvSeries got destroyed");
    if(!this.loadedAllTvSeries)
    {
      clearInterval(this.tvSeriesLoaderInterval);
      this.$emit("changeDialog",  {message: "Tv Serien laden...", status: "running"},
                                  {message: "Tv Serien  laden abgebrochen", status: "error"});
    }
    this.loadedAllTvSeries = false;
  },
  computed: {
    searchedTvSeries() {
      let tvSeries = this.User.TvSeries;

      return tvSeries;
    },


    filteredTvSeries() {

      if(this.User.TvSeries)
      {
        let tvSeries = this.User.TvSeries;

        if(this.searchText && this.searchText.length > 0)
        {
          tvSeries = this.searchedTvSeries;
        }

        if(tvSeries.length > 0)
        {
          tvSeries.sort((a,b) => {
            if(a.hasOwnProperty("name") && !b.hasOwnProperty("name"))
            {
              return -1;
            }
            else if (!a.hasOwnProperty("name") && b.hasOwnProperty("name"))
            {
              return 1;
            }
            else if(!a.hasOwnProperty("name") && !b.hasOwnProperty("name"))
            {
              return 0;
            }

            if(this.sort.by == "title" && a.name && b.name)
            {
              // console.log("COMPARE " , a.name , " WITH " , b.name);
              let nameA = a.name.toLowerCase();
              let nameB = b.name.toLowerCase();

              if(nameA > nameB)
              {
                return 1;
              }
              else if(nameA < nameB)
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
            else if(this.sort.by == "release_date" && a.first_air_date && b.first_air_date)
            {
              return new Date(b.first_air_date) - new Date(a.first_air_date);
            }
            else
            {
              return 0;
            }
          }

        );
        }

        return tvSeries;
      }
      else
      {
        return [];
      }
    }
  },
  methods: {
    loadTvSeries() {
      let remainingTvSeriesIds = this.getRemainingTvSeriesIds();
      if(this.loadedAllTvSeries == true)
      {
        this.$emit("changeDialog",  {message: "Tv Serien laden...", status: "running"},
                                    {message: "Tv Serien geladen", status: "success"});
        clearInterval(this.tvSeriesLoaderInterval);
      }

      if(remainingTvSeriesIds.length > 0)
      {
        this.loadedAllTvSeries = false;

        this.tmdb.GetTvSeriesRequestPromise(remainingTvSeriesIds[0])
        .then((request) => {
          let tvSeries = request.data;

          if(tvSeries.name == tvSeries.original_name)
          {
            console.log("Same name", tvSeries.name);
            this.tmdb.GetTvSeriesRequestPromise(remainingTvSeriesIds[0], "en")
            .then((request) => {
              let tvSeriesEn = request.data;
              console.log("tvSeriesEn", tvSeriesEn);

              let indOfEnTvSerObj = this.User.TvSeries.findIndex(item => item.id == tvSeries.id);
              this.$set(this.User.TvSeries, indOfEnTvSerObj, tvSeriesEn);
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
          else
          {
            let indOfTvSerObj = this.User.TvSeries.findIndex(item => item.id == tvSeries.id);
            this.$set(this.User.TvSeries, indOfTvSerObj, tvSeries);
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
      else
      {
        this.loadedAllTvSeries = true;
      }
    },
    getRemainingTvSeriesIds() {
      let tvSeriesIdsCopy = JSON.parse(JSON.stringify(this.User.tvSeriesIds));
      let tvSeriresIdsFromTvSeries = this.User.TvSeries.filter((tvSeries) => {
        if(tvSeries.name)
        {
          return true;
        }
        else
        {
          return false;
        }
      });
      tvSeriresIdsFromTvSeries = tvSeriresIdsFromTvSeries.map((tvSeries) => {
        return +tvSeries.id;
      });

      let tvSeriesIds = this.getArrayDifference(tvSeriesIdsCopy, tvSeriresIdsFromTvSeries);

      tvSeriesIds = tvSeriesIds.map((tvSeriesId) => {
        return +tvSeriesId;
      });

      return tvSeriesIds;
    },
    getArrayDifference(a1, a2)
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
    }
  },
  components: {
    TvSeriesCover
  }
}
</script>

<style lang="scss" scroped>
  #TvSeries {
    max-height: 100%;
    overflow: auto;
    justify-content: flex-start;
    align-items: flex-end;
  }
</style>
