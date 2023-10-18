let youtubePlayer;

window.onload = loadPage();


function loadPage() {
  fetch("/movies")
    .then((response) => response.json())
    .then((data) => {
      displayMovies(data);
    })
    .catch((error) => console.error("Error fetching movies:", error));
}

function saveMovie(movieId, movieName){
  const username = localStorage.getItem("user_name")
  fetch(`/saveMovie/${movieId}/${username}`, {
    method: 'POST'
  })
  .then(response => {
    return response.json()
  })
  .then(data => toastr.info(data.message, `${movieName}`))
}

function seenMovie(movieId, movieName){
  const username = localStorage.getItem("user_name")
  fetch(`/seenMovie/${movieId}/${username}`, {
    method: 'POST'
  })
  .then(response => {
    return response.json()
  })
  .then(data => toastr.info(data.message, `${movieName}`))
}


function initYouTubePlayer(videoId) {
  if (youtubePlayer) {
    youtubePlayer.destroy();
  }

  youtubePlayer = new YT.Player("player", {
    height: "315",
    width: "560",
    videoId: videoId,
    playerVars: {
    },
    events: {
    },
  });
}

function displayMovies(response) {
  console.log("response")
  console.log(response)
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

    const title = document.createElement("h2");
    title.textContent = movie.title;
    movieDiv.appendChild(title);

    const releaseDate = document.createElement("p");
    releaseDate.textContent = `Udgivet: ${movie.release_date}`;
    movieDiv.appendChild(releaseDate);

    const readMore = document.createElement("button");
    readMore.textContent = "Læs mere";
    buttonDiv.appendChild(readMore);

    movieDiv.appendChild(buttonDiv);
    movieListDiv.appendChild(movieDiv);

    image.addEventListener("click", function () {
      displayModal(movie);
    });

    readMore.addEventListener("click", function () {
      displayModal(movie);
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
  

    function displayModal(movie) {
      const modal = document.getElementById("myModal");
      const modalTitle = document.getElementById("modal-title");
      const modalDescription = document.getElementById("modal-description");
      const closeModal = document.getElementById("modal-close");
      const favorit = document.getElementById("favorit")
      const set = document.getElementById("set")
      favorit.onclick = function() {
        saveMovie(movie.id, movie.title)
      }
      set.onclick = function(){
        seenMovie(movie.id, movie.title)
      }

      modalDescription.innerHTML = "";
      
      getTrailer(movie.id)
        .then((data) => {
          const trailer = data.results.find(
            (item) =>
              item.type === "Trailer" &&
              item.name.toLowerCase().includes("trailer")
          );

          if (trailer) {
            const trailerVideoId = trailer.key;
            initYouTubePlayer(trailerVideoId);
          }



      modal.style.display = "block";
      modalTitle.textContent = movie.title + `(${movie.release_date})`; 
      const movieInfoDiv = document.createElement("div");
      movieInfoDiv.classList.add("movie-info"); 

      const movieOverview = document.createElement("p");
      movieOverview.textContent = movie.overview;

      movieInfoDiv.appendChild(movieOverview);

      movieInfoDiv.insertAdjacentHTML(
        "beforeend",
        `<h4>Sprog - ${movie.original_language}</br> Bedømmelse - ${movie.vote_average} <i class="fa-solid fa-star"></i> </br> Udgivelsesdato - ${movie.release_date}</h4>`
      );

      modalDescription.appendChild(movieInfoDiv);
          closeModal.addEventListener("click", () => {
            modal.style.display = "none";
            youtubePlayer.destroy();
          });
        })

        .catch((error) => console.error("Error fetching trailers:", error));
    }

  

