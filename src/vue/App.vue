<template>
  <div id="app">
    <div class="app flexbox column">
      <header class="flexbox cell">
          <router-link class="cell pointer noselect" to="/">
            <i class="cell pointer zmdi zmdi-home zmdi-hc-lg"></i>
          </router-link>


          <div class="path cell flexbox" v-for="path in paths" v-bind:key="path.title">
            <i class="cell zmdi zmdi-chevron-right zmdi-hc-lg"></i>
            <router-link tag="span" class="cell noselect pointer" :to="{ name: path.name }">{{path.title}}</router-link>
          </div>


          <div :class="{show: $route.name=='Movies' || $route.name=='TvSeries'}" id="sort" class="flexbox cell">
            <i title="Sortieren nach Titel"
            class="zmdi zmdi-sort-asc pointer"
            :class="{active: sort.by == 'title'}"
            @click="sort.by = 'title'"></i>

            <i title="Sortieren nach Erscheinungsdatum" class="zmdi zmdi-calendar-note pointer"
            :class="{active: sort.by == 'release_date'}"
            @click="sort.by = 'release_date'"></i>

            <i title="Sortieren nach Bewertung" class="zmdi zmdi-star-circle pointer"
            :class="{active: sort.by == 'vote_average'}"
            @click="sort.by = 'vote_average'"></i>

          </div>

          <div id="search" class="flexbox cell">
            <label class="flexbox cell">
              <i class="cell pointer zmdi zmdi-search" @click="showSearch = !showSearch"></i>
              <input v-model="searchText" :class="{show: showSearch}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Search..." type="search" class="cell">
            </label>
          </div>

      </header>

      <main class="flexbox cell">
        <sidemenu v-bind:username="User.username"></sidemenu>
        <div id="sidemenuPlaceholder"></div>
        <router-view class="router-view"
        @showPopularMovies="showPopularMovies" @pushDialog="pushDialog" @changeDialog="changeDialog" @deleteDialog="deleteDialog"  @changePath="changePath" @deletePath="deletePath"
        v-bind:User="User" v-bind:sort="sort" v-bind:searchText="searchText" v-bind:paths="paths">

        </router-view>
        <div id="dialogs" :class="{show : dialogs.length > 0}" :style="{height:  (dialogs.length * 28) + 20 + 'px'}" >
          <ul>
            <li class="dialog" :class="dialog.status"  v-for="dialog in dialogs">
              <i v-if="dialog.status=='running'"      class="zmdi zmdi-spinner zmdi-hc-lg"></i>
              <i v-else-if="dialog.status=='success'" class="zmdi pointer zmdi-check  zmdi-hc-lg"       @click="deleteDialog(dialog)"></i>
              <i v-else-if="dialog.status=='error'"   class="zmdi pointer zmdi-alert-circle zmdi-hc-lg" @click="deleteDialog(dialog)"></i>
              <span :title="dialog.message">{{dialog.message}}</span>
            </li>
          </ul>
        </div>
      </main>


    </div>
  </div>
</template>

<script>
import Sidemenu from './Sidemenu.vue';

export default {
  name: 'app',
  data () {
    return {
      User: {
        username : "Sinmson",
        Movies: [],
        TvSeries: [],
        movieIds: [300671,346646,150540,9799,9615,168259,584,13804,51497,82992,102899,261023,325125,346830,198184,356841,312221,201085,278927,255157,277546,267193,299687,262504,262500,353257,181009,291805,370964,228933,22803,205584,382651,49021,258489,267860,328111,257344,241257,254128,273481,1893,1894,1895,11,1891,1892,269149,321741,335462,190847,146578,287948,285783,310567,203801,296099,302666,136797],
        tvSeriesIds: [1399,1420, 61889, 62126, 40293, 63174, 37854, 46298, 46260, 31911, 36406, 31724, 46261, 45782, 42942, 61374, 46671, 61421, 70051, 38464, 37858, 65844, 65942, 65930, 61415, 60808, 46184, 57577, 69346, 45125, 62171, 60833, 63145, 61333, 60846, 45997, 42413, 62255, 63663, 61223, 1429]
      },
      dialogs: [
        /*{message: "Filme laden...", status: "running"},
        {message: "Filme geladen", status: "success"},
        {message: "Fehler beim Filme laden", status: "error"}*/
      ],
      paths: [],
      showSearch: false,
      searchText: "",
      sort: { by: "title", reverse: false },
    }
  },
  computed: {
  },
  mounted: function() {

  },
  components: {
    Sidemenu
  },
  methods: {
    changePath(index, title, name) {
      this.$set(this.paths, index, {title, name});
    },
    deletePath(index) {
      console.log(this.paths);
      this.paths.splice(index, 1);
      console.log(this.paths);
    },
    deleteDialog(dialog) {
      console.log("DELETE DIALOG", dialog);
      this.dialogs.splice(this.dialogs.indexOf(dialog), 1);
    },
    pushDialog(dialog) {
      console.log("PUSH DIALOG", dialog);
      this.dialogs.push(dialog);
    },
    changeDialog(oldDialog, newDialog) {
      let index = this.dialogs.findIndex((dialog) => {
        console.log("CHANGE DIALOG FROM TO", oldDialog, newDialog);
        return dialog.message === oldDialog.message
      });
      this.$set(this.dialogs, index, newDialog);
    },
    showPopularMovies(data) {
      console.log("showPopularMovies");
      this.movieIds = [300671,346646,150540];
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../scss/flat-colors";

  #app, .main {
    height: 100%;
    overflow: hidden;
  }

  #app .app {
    height: 100%;
    justify-content: flex-start;
    position: relative;
  }



  .router-view {
    position: relative;
  }

  #dialogs {
    position: absolute;
    bottom: -5px;
    left: 200px;
    right: 0;
    margin: 0 auto;
    min-height: 45px;
    height: auto;
    width: 275px;
    background: $flat-gray-1;
    border-radius: 7px;
    transition: min-height 0.3s ease-in-out, height 0.3s ease-in-out, max-height 0.3s ease-in-out;
    z-index: 99;


    @media screen and (max-width: 420px)
    {
      left: 0;
    }

    &:not(.show) {
      min-height: 0px;
      max-height: 0px;
    }

    & .dialog {
      padding: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 250px;
      cursor: default;

      &:first-of-type {
        margin-top: 10px;
      }
      &:last-of-type {
        margin-bottom: 10px;
      }
      & i {
        padding: 0;
        width: 17px;
      }
      &.running i {
        -webkit-animation: rotating 1.4s linear infinite;
        -moz-animation: rotating    1.4s linear infinite;
        -ms-animation: rotating     1.4s linear infinite;
        -o-animation: rotating      1.4s linear infinite;
        animation: rotating         1.4s linear infinite;
      }
      &.success i {
        color: $flat-green-1;
      }
      &.error i {
        color: $flat-red-1;
      }
      & span {
        margin-left: 5px;
      }
    }
  }


  header {
    background-color: #000;
    height: 60px;
    -webkit-box-shadow: 0px 2px 5px -1px #000;
    -moz-box-shadow: 0px 2px 5px -1px #000;
    box-shadow: 0px 2px 5px -1px #000;
    position: relative;
    z-index: 10;
    color: $flat-gray-1;
    font-size: 22px;
    align-items: center;
    padding: 2px 20px;
    align-items: center;
    // border-bottom: 1px solid #fff;

    & .path  {
      align-items: center;
      & i.zmdi{
        margin: 0 15px;
      }
    }

    & i.zmdi {
      padding-right: 10px;

    }

    & #sort {
      margin-left: auto;
      margin-right: 100px;

      &:not(.show) i {
        display: none;
      }

      & i.active {
        color: orange;
      }

    }

    & #search {
      & input {
        background: #000;
        border: 0px;
        border-bottom: 1px solid $flat-gray-1;
        font-family: 'Open Sans', sans-serif;
        color: $flat-gray-1;
        width: 200px;
        transition: width 0.3s ease-in-out;

        &:focus {
          outline: none;
          border: 0px;
          border-bottom: 1px solid $flat-orange-2;

        }

        &::selection, &::-moz-selection {
          background: #121212;
        }

        &:not(.show) {
          width: 0;
          padding: 0;
        }
      }
    }
  }

  #sidemenuPlaceholder {
    width: 200px;
    min-width: 200px;
    max-width: 200px;

    @media screen and (max-width: 766px)
    {
       width:     0px;
       min-width: 0px;
       max-width: 0px;

    }
  }

  main {
    height: 100%;
    min-height: 0;
  }

  footer {
    height: 100px;
    // border-top: 1px solid #fff;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }
</style>
