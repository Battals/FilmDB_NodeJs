
let youtubePlayer;

window.onload = loadPage();

function loadPage() {
  fetch("/popularMovies")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayMovies(data);
    })
    .catch((error) => console.error("Error fetching movies:", error));
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
      displayModal(movie.id, movie.title);
    });

    readMore.addEventListener("click", function () {
      displayModal(movie.id, movie.title);
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

function displayModal(movieId) {
  
  const modal = document.getElementById("myModal");
  const modalTitle = document.getElementById("modal-title");
  const closeModal = document.getElementById("modal-close");
  const descriptionContainer = document.getElementById("test1");
  const favorit = document.getElementById("favorit");
  const set = document.getElementById("set");
  const movieInfo = document.getElementById("movieInfo");
  const movieOverview = document.getElementById("movieOverview");

  

  fetch(`/findMovie/${movieId}`)
    .then((response) => response.json())
    .then((data) => {
      modal.style.display = "block";
        modalTitle.innerHTML = data.title;
     

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
        movieOverview.classList.add("movieInfoElements");
        movieOverviewText.textContent = data.overview || "Information ikke tilgængelig";
        movieOverview.appendChild(movieOverviewText);
        movieInfo.appendChild(movieOverview);

        const actorInfoDiv = document.createElement("div");
        actorInfoDiv.classList.add("actorDiv");

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
          actorInfoDiv.appendChild(actorElement);
        });

        descriptionContainer.appendChild(actorInfoDiv);
        actorInfoDiv.insertAdjacentHTML('beforebegin', '<h3 id="actors">Medvirkende</h3>');

        closeModal.addEventListener("click", () => {
          modal.style.display = "none";
          descriptionContainer.removeChild(actorInfoDiv)
           const medvirkende = document.getElementById("actors")
           descriptionContainer.removeChild(medvirkende)
           descriptionContainer.removeChild(movieOverview)
           

          youtubePlayer.destroy();
        });
      })

      
      .catch((error) => console.error("Error fetching trailers:", error));
  });
}