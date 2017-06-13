import '../scss/main.scss';
import Vue from 'vue';
import App from '../vue/App.vue';
import VueRouter from 'vue-router'
import Home from '../vue/Home.vue';
import Movies from '../vue/Movies.vue';
import MovieDetails from '../vue/MovieDetails.vue';
import TvSeries from '../vue/TvSeries.vue';
import Music from '../vue/Music.vue';


Vue.use(VueRouter);

const routes = [
  { path:"/" , component: Home},
  {
    path:"/Movies",
    component: Movies,
    props: true
  },
  {
    path:"/Movies/:id",
    name:"MovieDetails",
    component: MovieDetails,
    props: false
  },
  { path:"/TvSeries", component: TvSeries},
  { path:"/Music", component: Music}
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
