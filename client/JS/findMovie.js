async function fetchMovieSuggestions(query) {
  const searchInput = document.getElementById("searchInput");
  const suggestionList = document.getElementById("suggestions");
  const API_KEY = "e5cf39b959e12b923e88d332dc6c853a";
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
                window.location.href = `movieDetails/${movie.id}`
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

function displayMovieDetails(movieId) {
  fetch(`/findMovie/${movieId}`)
    .then((response) => response.json())
    .then((data) => {
        const movieContainer = document.createElement("div")
        movieContainer.classList.add("movie-container")

        const title = document.createElement("h2")
        title.textContent = data.title

        const overview = document.createElement("p")
        overview.textContent = data.overview

        const poster = document.createElement("img")
        poster.src = `https://image.tmdb.org/t/p/w200${data.poster_path}`;
        poster.alt = `${data.title} Poster`;

        movieContainer.appendChild(title)
        movieContainer.appendChild(overview)
        movieContainer.appendChild(poster)
    })
    .catch((error) => {
      console.error(error);
    });
}
