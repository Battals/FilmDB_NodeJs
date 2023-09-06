const API_KEY = process.env.API_KEY;

export const getMovies = async (req, res) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&include_adult=false&include_video=false&language=da&page=1&sort_by=popularity.desc`);
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Movies fetched successfully!");
      res.json(data);
    } catch (error) {
      console.error("Error fetching movies:", error.message);
      res.status(500).send("Error fetching movies");
    }
  };
  export const getTrailer = async (req, res) => {
    try {
      const movieId = req.params.movieId;
      const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`;
  
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (response.ok) {
        res.json(data);
      } else {
        res.status(response.status).send("Error fetching trailers");
      }
    } catch (error) {
      console.error('Error fetching trailers:', error);
      res.status(500).send("Internal Server Error");
    }
  };