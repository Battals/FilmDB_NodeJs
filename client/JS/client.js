let youtubePlayer;
const API_KEY = "e5cf39b959e12b923e88d332dc6c853a";

async function fetchMovieSuggestions(query) {
  const searchInput = document.getElementById("searchInput");
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

function saveMovie(movieId, movieName) {
  const username = localStorage.getItem("user_name");
  fetch(`/saveMovie/${movieId}/${username}`, {
    method: "POST",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => toastr.info(data.message, `${movieName}`));
}

function seenMovie(movieId, movieName) {
  const username = localStorage.getItem("user_name");
  fetch(`/seenMovie/${movieId}/${username}`, {
    method: "POST",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => toastr.info(data.message, `${movieName}`));
}

function initYouTubePlayer(videoId) {
  if (youtubePlayer) {
    youtubePlayer.destroy();
  }

  youtubePlayer = new YT.Player("player", {
    height: "315",
    width: "560",
    videoId: videoId,
    playerVars: {},
    events: {},
  });
}

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

function getTrailer(movieId) {
  return fetch(`/trailer/${movieId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log("Error fetching trailers", error);
      throw error;
    });
}

function displayRating(data){
 let stars = ""
 for(let i = 0; i < data; i++){
  stars += "⭐"
 }

 return stars
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

  fetch(`/findMovie/${movieId}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Data", data.similar)
        modalTitle.innerHTML = data.title;
        console.log(data)

      getTrailer(movieId).then((data1) => {
        const trailer = data1.results.find(
          (item) =>
            item.type === "Trailer" &&
            item.name.toLowerCase().includes("trailer")
        );

        if (trailer) {
          const trailerVideoId = trailer.key;
          initYouTubePlayer(trailerVideoId);
        }
      
        favorit.onclick = () => saveMovie(data.id, data.title);
        set.onclick = () => seenMovie(data.id, data.title);

        const movieOverviewText = document.getElementById("movieOverviewText")
        movieOverviewText.textContent = data.overview || "Information ikke tilgængelig";

        const movieDetails = document.createElement("div")
        movieDetails.classList.add("movieDetails")
        const rating = document.getElementById("rating")
        rating.innerHTML = "<h5>Bedømmelse </h5>" + displayRating(data.vote_average)
        movieOverview.appendChild(movieDetails)



        const similarResults = data.similar.results
        const similarInfoDiv = document.getElementById("similarDiv")


        if(similarResults.length === 0){
          similarInfoDiv.textContent = "Information ikke tilgængelig"
        } else {
        for(let i = 0; i < 7; i++){
          const item = similarResults[i]
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

      
      .catch((error) => console.error("Error fetching trailers:", error));
  });
}



function deleteMovie(movieId, movieName) {
  const username = localStorage.getItem("user_name");
  const movieItem = document.getElementById(`movieItem-${movieId}`);
  fetch(`/deleteMovie/${movieId}/${username}`, {
    method: 'POST'
  })
    .then(response => {
    if(response.status === 200) {
      movieItem.remove()
      toastr.success(`${movieName}: er fjernet fra dine favoritter`)
    } else {
      toastr.error("Der opstod en fejl")
    }
  })

}

function deleteSeenMovie(movieId, movieName){
const movieItem = document.getElementById(`movieItem-${movieId}`);
var userName = localStorage.getItem("user_name")
fetch(`/deleteSeenMovie/${movieId}/${userName}`, {
  method: 'POST'
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

function shareMovie(){
  console.log("shareMovie")
}

