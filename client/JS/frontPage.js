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

function saveMovie(movieId){
  fetch("/saveMovie/:movieId"), {
method: "POST"
  }.then(response => {
    if(response.status === 401){
      window.location.href = "/login?error=unauthorized"
    } else {
      toastr.success("Gemt til favoritter")
    }
  })
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
    readMore.id = "buttonDivbtn";
    readMore.textContent = "Læs mere";
    buttonDiv.appendChild(readMore);
    const buyTickets = document.createElement("button");
    buyTickets.id = "buttonDivbtn";
    buttonDiv.appendChild(buyTickets);

    movieDiv.appendChild(buttonDiv);

    movieListDiv.appendChild(movieDiv);

    image.addEventListener("click", function () {
      displayModal(movie.id);
    });
    readMore.addEventListener("click", function () {
      displayModal(movie.id);
    });

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

    function displayModal(movieid) {
      const modal = document.getElementById("myModal");
      const modalTitle = document.getElementById("modal-title");
      const modalDescription = document.getElementById("modal-description");
      const closeModal = document.getElementById("modal-close");
      const favorit = document.getElementById("farvorit")
      

      getTrailer(movieid)
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
          modalTitle.textContent = movie.title;
          modalDescription.textContent = movie.overview;
          modalDescription.insertAdjacentHTML(
            "afterbegin",
            `<h4>Sprog: ${movie.original_language}</br> Bedømmelse: ${movie.vote_average} stjerner</h4>`
          );
          closeModal.addEventListener("click", () => {
            modal.style.display = "none";
            youtubePlayer.destroy();
          });
        })
        .catch((error) => console.error("Error fetching trailers:", error));
    }
  });
}
