import Axios from "axios";

class Tmdb {
  constructor() {
    this.ApiUrl = "https://api.themoviedb.org";
    this.ApiKey = "c1752cedf34c1c8093620aa1929c6e7c"
    this.ImageBaseUrl = "";
    this.Movies = [];

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

  GetMovieByIdPromise(movieId, language = "de")
  {
    let retAxios = Axios.get("/3/movie/" + movieId, {
        params: {
          api_key: this.ApiKey,
          language
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
