<template lang="html">
  <div id="sidemenu" class="flexbox column" >
    <ul class="profile flexbox cell">
      <li class="flexbox cell column noselect">
        <div class="flexbox username">
          <span class="cell">{{username}}</span>
          <i @click="showProfilemenu = !showProfilemenu" v-bind:class="{active : showProfilemenu}" class="zmdi zmdi-triangle-down pointer cell"></i>
        </div>
        <ul v-bind:class="{show: showProfilemenu}" class="profilemenu cell flexbox column">
          <li class="cell">
            <i class="cell pointer zmdi zmdi-account-circle"></i>
            <span class="cell pointer noselect">Account</span>
          </li>
          <li class="cell">
            <i class="cell pointer zmdi zmdi-edit"></i>
            <span class="cell pointer noselect">Bearbeiten</span>
          </li>
          <li class="cell">
            <i class="cell pointer zmdi zmdi-power"></i>
            <span class="cell pointer noselect">Ausloggen</span>
          </li>
        </ul>
      </li>
    </ul>
    <nav class="sidemenu flexbox cell">
      <ul class="flexbox cell column">
        <li class="category cell flexbox column">
          <span class="noselect cell">Meine Mediathek</span>
          <ul class="cell felxbox column">
            <li class="cell flexbox " :class="{isActive : $route.name=='Movies'}">
              <i class="cell pointer zmdi zmdi-movie"></i>
              <router-link class="cell pointer noselect"  :to="{ name: 'Movies'}">Filme</router-link>
              <!-- <span class="cell pointer noselect">Filme</span> -->
            </li>
            <li class="cell flexbox " :class="{isActive : $route.name=='TvSeries'}">
              <i class="cell pointer zmdi zmdi-videocam"></i>
              <router-link class="cell pointer noselect"  :to="{ name: 'TvSeries'}">Tv Serien</router-link>
            </li>
            <li class="cell flexbox " :class="{isActive : $route.name=='Music'}">
              <i class="cell pointer zmdi zmdi-play-circle"></i>
              <router-link class="cell pointer noselect" :to="{ name: 'Music'}">Musik</router-link>
            </li>
          </ul>
        </li>
<!--
        <li class="category cell flexbox column">
          <span class="noselect cell">Beliebt</span>
          <ul class="cell felxbox column">
            <li class="cell flexbox ">
              <i class="cell pointer zmdi zmdi-movie"></i>
              <router-link class="cell pointer noselect" to="/Movies" @click="$emit('showPopularMovies')">Filme</router-link>
              <!-- <span class="cell pointer noselect">Filme</span>
            </li>
            <li class="cell flexbox ">
              <i class="cell pointer zmdi zmdi-videocam"></i>
              <router-link class="cell pointer noselect" to="/TvSeries">Tv Serien</router-link>
            </li>
            <li class="cell flexbox ">
              <i class="cell pointer zmdi zmdi-play-circle"></i>
              <router-link class="cell pointer noselect" to="/Music">Musik</router-link>
            </li>
          </ul>
        </li> -->

        <li class="cell flexbox">
          <i class="cell pointer zmdi zmdi-settings"></i>
          <span class="cell pointer noselect">Einstellungen</span>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'sidemenu',
  props: ['username'],
  data() {
    return {
      showProfilemenu: false,
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../scss/flat-colors";

  .profile {
    min-height: 40px;
    background-color: #121212;
    margin: 0;
    padding: 2px 20px;
    position: relative;
    color: $flat-orange-1;
    font-size: 18px;

    & .username {
      margin-top: 15px;
      align-items: center;
    }

    & i.zmdi-triangle-down {
      margin-left: 10px;
      font-size: 8px;
      transition: transform 0.5s ease-in-out;
    }
    & i.zmdi-triangle-down.active {
      transform: rotate(180deg);
    }

    & .profilemenu {
      height: 0;
      overflow: hidden;
      margin: 10px 10px;
      padding: 0;
      background: #121212;
      transition: height 0.5s ease-in-out;
      font-size: 16px;
      color: $flat-gray-1;

      & li {
        padding: 4px 0;
        margin: 2px 0;
      }
    }
    & .profilemenu.show {
      height: 150px;
    }
  }

  #sidemenu {
    // border-right: 1px solid #fff;
    background-color: #1A1A1A;
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    width: 200px;
    min-width: 200px;
    max-width: 200px;
    //padding-right: 10px;
    -webkit-box-shadow: 2px 0px 5px -1px #222;
    -moz-box-shadow: 2px 0px 5px -1px #222;
    box-shadow: 2px 0px 5px -1px #222;
    position:fixed;
    overflow: hidden;
    z-index: 99;

    @media screen and (max-width: 766px)
    {
      width: 0;
      min-width: 0;
      max-width: 0;
      overflow: hidden;
    }

    & > .sidemenu {
      padding: 15px 0;
      height: 100%;
      color: $flat-gray-1;
      & ul {
        padding: 0;
        padding-top: 10px;
        margin: 0;
        height: 100%;

        & li {
          padding: 2px 20px;
          width: 100%;

          &.isActive {
            color: $flat-gray-2;
          }
        }

        & li:not(.category) {
          // justify-content: space-between;
          align-items: center;
          padding: 2px 10px;

          &:hover {
            color: $flat-gray-2;
          }

          &:last-of-type {
            margin-top: auto;
          }
        }
        & li.category:not(:last-of-type) {
          margin-bottom: 25px;
        }
      }
    }
  }


</style>
