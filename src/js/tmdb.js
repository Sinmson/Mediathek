import Axios from "axios";

class Tmdb {
  constructor() {
    //console.log("Loaded TMDB");
    this.ApiUrl = "https://api.themoviedb.org";
    this.ApiKey = "c1752cedf34c1c8093620aa1929c6e7c"
    this.ImageBaseUrl = "http://image.tmdb.org/t/p/";

    Axios.defaults.baseURL = "https://api.themoviedb.org";

    this.DetermineImageBaseUrl().then(() => {
      console.log("Loaded ImageBaseUrl", this.ImageBaseUrl);
    });
  }

  DetermineImageBaseUrl()
  {
    return new Promise((resolve, reject) => {
      Axios.get("/3/configuration", {
        params: {
          api_key: this.ApiKey
        }
      })
      .then(response => {
        this.ImageBaseUrl = response.data.images.base_url;
        resolve();
      })
      .catch(error => {
        // console.log(error);
        reject(error);
      });
    });

  }

  GetMovieByIdPromise(movieId,language = "de")
  {
    let retAxios = Axios.get("/3/movie/" + movieId, {
        params: {
          api_key: this.ApiKey,
          language
        }
      });

    return retAxios;
  }

  GetMovieRecommandationsPromise(movieId, page = 1, language = "de")
  {
    let retAxios = Axios.get("/3/movie/" + movieId + "/recommendations", {
        params: {
          api_key: this.ApiKey,
          language,
          page
        }
      });

    return retAxios;
  }


  GetTvSeriesRequestPromise(tvSeriesId,language = "de")
  {
    let retAxios = Axios.get("/3/tv/" + tvSeriesId, {
        params: {
          api_key: this.ApiKey,
          language
        }
      });

    return retAxios;
  }

  GetTvSeriesRecommandationsRequestPromise(tvSeriesId, page = 1, language = "de")
  {
    let retAxios = Axios.get("/3/tv/" + tvSeriesId + "/recommendations", {
        params: {
          api_key: this.ApiKey,
          language,
          page
        }
      });

    return retAxios;
  }




  BeautifyDate(date) {
    let release_date = new Date(date);
    let months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    let month = release_date.getMonth();
    let year = release_date.getFullYear();
    return months[month] + " " + year;
  }


  GetImageUrl(path , size = "w185")
  {
    return this.ImageBaseUrl + size + path;
  }

}

export { Tmdb as default }
