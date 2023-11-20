const API_KEY = "e5cf39b959e12b923e88d332dc6c853a";
let youtubePlayer;



  function displayMovies(response) {
    const movieListDiv = document.querySelector(".movie-list");
  
    const movies = response.results || [];
  
    movies.forEach((movie) => {
      const movieDiv = document.createElement("div");
      const buttonDiv = document.createElement("div");
  
      movieDiv.classList.add("movie");
  
      const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  
      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = movie.title;
      movieDiv.appendChild(image);
  
      const title = document.createElement("h3");
      title.textContent = movie.title;
      movieDiv.appendChild(title);
  
      const releaseDate = document.createElement("p");
      releaseDate.textContent = `Udgivelse: ${movie.release_date}`;
      movieDiv.appendChild(releaseDate);
  
      const readMore = document.createElement("button");
      readMore.textContent = "Læs mere";
      buttonDiv.appendChild(readMore);
  
      movieDiv.appendChild(buttonDiv);
      movieListDiv.appendChild(movieDiv);
  
      image.addEventListener("click", function () {
        displayModal(movie.id);
      });
  
      readMore.addEventListener("click", function () {
        displayModal(movie.id);
      });
    });
  }
  
async function fetchMovieSuggestions(query) {
  const suggestionList = document.getElementById("suggestions");
  const API_URL = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=da&page=1&api_key=${API_KEY}`;
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    

    const movies = data.results || [];
    const first5Movies = movies.slice(0, 5);

    suggestionList.innerHTML = "";

    if (first5Movies.length > 0) {
      first5Movies.forEach((movie) => {

        if(movie.poster_path === null){
          return;
        }



        const movieId = movie.id;
        const listItem = document.createElement("li");
        listItem.classList.add("movie-item");
        const posterImg = document.createElement("img");
        posterImg.style.width = "150px";
posterImg.style.height = "225px";
        posterImg.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
        posterImg.alt = `${movie.title} Poster`;
        const movieDetails = document.createElement("div");
        movieDetails.classList.add("movie-details");
        const titlePara = document.createElement("p");
        titlePara.textContent = movie.title;
        titlePara.style = "color: black";
        movieDetails.appendChild(titlePara);
        movieDetails.appendChild(posterImg);
        listItem.appendChild(movieDetails);

        listItem.addEventListener("click", () => {
                displayModal(movieId)
        });

        suggestionList.appendChild(listItem);
      });
    } else {
      suggestionList.innerHTML = "<li>Ingen resultater fundet..</li>";
    }
  } catch (error) {
    console.log(error);
  }
}


function displayModal(movieId) {
  const modal = document.getElementById("myModal");
  const modalTitle = document.getElementById("modal-title");
  const closeModal = document.getElementById("modal-close");
  const favorit = document.getElementById("favorit");
  const set = document.getElementById("set");
  const movieOverview = document.getElementById("movieOverview");
  const similarMovies = document.getElementById("similarMovies")

  modal.classList.add("active")
  
  fetch(`/movie/${movieId}`)
    .then((response) => response.json())
    .then((data) => {
        modalTitle.innerHTML = data.title;


initYouTubePlayer(movieId)
      
        favorit.onclick = () => saveMovie(data.id, data.title);
        set.onclick = () => seenMovie(data.id, data.title);

        const movieOverviewText = document.getElementById("movieOverviewText")
        movieOverviewText.textContent = data.overview || "Information ikke tilgængelig";

        const movieDetails = document.createElement("div")
        movieDetails.classList.add("movieDetails")
        const rating = document.getElementById("rating")
        rating.textContent = displayRating(data.vote_average)
        movieOverview.appendChild(movieDetails)



        const similarResults = data.similar.results
        const similarInfoDiv = document.getElementById("similarDiv")


        if(similarResults.length === 0){
          similarInfoDiv.textContent = "Information ikke tilgængelig"
        } else {
        for(let i = 0; i < 7; i++){
          const item = similarResults[i]
          if(item.poster_path === null){
           continue;
          }
          const similarElement = document.createElement("div")
          similarElement.classList.add("similar")
          const similarMovieName = document.createElement("h4")
          similarMovieName.textContent = item.title
          similarMovieName.classList.add("similar-name")
          const similarMovieImage = document.createElement("img")
          similarMovieImage.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
          similarElement.appendChild(similarMovieName)
          similarElement.appendChild(similarMovieImage)
          similarInfoDiv.appendChild(similarElement)
        }
      }
        similarMovies.appendChild(similarInfoDiv)    


        const actorDiv = document.getElementById("actorDiv")
        

        data.credits.cast.forEach((actor) => {
          if (actor.profile_path === null) {
            return;
          }

          const actorElement = document.createElement("div");
          actorElement.classList.add("actor");
          const actorName = document.createElement("h4");
          actorName.textContent = actor.name;
          actorName.classList.add("actor-name");

          const actorImage = document.createElement("img");
          actorImage.src = `https://image.tmdb.org/t/p/w500${actor.profile_path}`;
          actorElement.appendChild(actorName);
          actorElement.appendChild(actorImage);
          actorDiv.appendChild(actorElement);
        });

        closeModal.addEventListener("click", () => {

          modal.classList.remove("active")
          similarInfoDiv.innerHTML = ""
          actorDiv.innerHTML = ""
          youtubePlayer.destroy();
        });
      })

      
  };


  async function initYouTubePlayer(movieId) {

    if (youtubePlayer) {
      youtubePlayer.destroy();
    }
  
    const response = await fetch(`/trailer/${movieId}`);
  
    if (response.ok) {
      const data = await response.json();
      const trailer = data.results.find((item) => item.name.toLowerCase().includes("trailer"));
  
      if (trailer) {
        youtubePlayer = new YT.Player("player", {
          height: "315",
          width: "560",
          videoId: trailer.key,
        });
      } else {
        console.log("Trailer not found in the data");
      }
    } else {
      console.log("An error occurred");
    }
  }
  

function displayRating(data){
 let stars = ""
 if(data == 0){
  stars = "Bedømmelse ikke tilgængelig"
 } else {
 for(let i = 0; i < data; i++){
  stars += "⭐"
 }
}

 return stars
}

  async function saveMovie(movieId, movieName){
    const response = await fetch(`/movie/save/${movieId}`, {
      method: 'POST'
    })
  
    if(response.ok){
      toastr.success(`${movieName}: Gemt til din Favorit-liste`,)
      return await response.json()
    }
    else if(!response.ok){
    const data = await response.json()
    toastr.error(data.message, `${movieName}`)
    }
  }
  
  async function seenMovie(movieId, movieName){
    const response = await fetch(`/movie/seen/${movieId}`, {
      method: 'POST'
    })
  
    if(response.ok){
      toastr.success(`${movieName}: Gemt til din Set-liste`,)
      return await response.json()
    } else if(!response.ok){
      const data = await response.json()
      toastr.error(data.message, `${movieName}`)
    }
  }

function deleteMovie(movieId, movieName) {
  const movieItem = document.getElementById(`movieItem-${movieId}`);
  fetch(`/movie/delete/${movieId}`, {
    method: 'DELETE'
  })
    .then(response => {
    if(response.status === 200) {
      movieItem.remove()
      toastr.success(`${movieName}: er nu slettet fra din Favorit-liste`)
    } else {
      toastr.error("Der opstod en fejl")
    }
  })

}

function deleteSeenMovie(movieId, movieName){
const movieItem = document.getElementById(`movieItem-${movieId}`);
fetch(`/moive/seen/delete/${movieId}`, {
  method: 'DELETE'
})
.then(response => {
  if(response.status === 200){
    movieItem.remove()
    toastr.success(`${movieName} er nu slettet fra din Set-liste`)
  } else {
    toastr.error("Der opstod en fejl")
  }
})
}

function shareMovie(movieId){
const clipboardString = `https://www.themoviedb.org/movie/${movieId}`
navigator.clipboard.writeText(clipboardString)
toastr.success("Kopieret til udklipsholderen")
}


