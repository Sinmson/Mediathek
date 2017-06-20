import '../scss/main.scss';
import Vue from 'vue';
import App from '../vue/App.vue';
import VueRouter from 'vue-router'
import Home from '../vue/Home.vue';
import Movies from '../vue/Movies.vue';
import MovieDetails from '../vue/MovieDetails.vue';
import TvSeries from '../vue/TvSeries.vue';
import TvSeriesDetails from '../vue/TvSeriesDetails.vue';
import Music from '../vue/Music.vue';


Vue.use(VueRouter);

const routes = [
  { name:"Home",              path:"/",             component: Home,              props: true },
  { name:"Movies",            path:"/Movies",       component: Movies,            props: true },
  { name:"MovieDetails",      path:"/Movies/:id",   component: MovieDetails,      props: true },
  { name:"TvSeries",          path:"/TvSeries",     component: TvSeries,          props: true },
  { name:"TvSeriesDetails",   path:"/TvSeries/:id", component: TvSeriesDetails,   props: true },
  { name:"Music",             path:"/Music",        component: Music,             props: true }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
