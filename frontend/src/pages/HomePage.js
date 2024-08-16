import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { fetchItems } from "../api/api";
import { LIST_MOVIES, MOVIE_DETAILS } from "../config/apiEndpoints";
import Background from "../components/background";
import MovieCard from "../components/movieCard";
import DetailCard from "../components/detail-card";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import "../styles/homeStyles.css";
import "../index.css";
import { GENRE, MINIMUM_RATING, QUALITY, SORT_BY } from "../config/environment";
import Cast from "../components/cast";
import LoadingScreen from "../components/loadingScreen";
import ErrorScreen from "../components/errorScreen";
import MovieHeading from "../components/movieHeading";
import MainDetails from "../components/mainDetails";
import Torrents from "../components/torrents";
import Filtering from "../components/filtering";
import YouTubeEmbed from "../components/youtube";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [cast, setCast] = useState([]);
  const [activeMovie, setActiveMovie] = useState(null);
  const [activeMovieIndex, setActiveMovieIndex] = useState(0);
  const [activeMovieIMDBID, setActiveMovieIMDBID] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [movieCount, setMovieCount] = useState(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [isNoMovies, setIsNoMovies] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState({
    quality: "",
    minimumRating: null,
    genre: "",
    sortBy: "",
  });

  // Function to handle selection change
  const handleSelectionChange = (event, dropdown) => {
    console.log(dropdown);

    setSelectedOptions((prevState) => ({
      ...prevState,
      [dropdown]: event.target.value,
    }));
  };

  // Data fetching example
  const [options, setOptions] = useState({
    quality: QUALITY,
    minimumRating: MINIMUM_RATING,
    genre: GENRE,
    sortBy: SORT_BY,
  });

  const moviesPerPage = 8;
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (initialLoading) {
        setLoading(true);
        setInitialLoading(false);
      }
      try {
        const { quality, minimumRating, genre, sortBy } = selectedOptions;
        const queryParams = new URLSearchParams({
          limit: moviesPerPage,
          page: pageNo,
          query_term: query,
          quality: quality || "",
          minimum_rating: minimumRating || "",
          genre: genre || "",
          sort_by: sortBy || "date_added",
        }).toString();

        const moviesList = await fetchItems(`${LIST_MOVIES}?${queryParams}`);

        if (
          moviesList?.data?.movie_count > 0 &&
          moviesList?.data?.movies != null
        ) {
          setIsNoMovies(false);
          setMovies(moviesList?.data?.movies);
          setActiveMovieIndex(0);
          setActiveMovieIMDBID(moviesList?.data?.movies[0]?.id);
          setMovieCount(moviesList?.data?.movie_count);
        } else {
          setIsNoMovies(true);
        }
        // setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [pageNo, query, selectedOptions]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (initialLoading) {
        setLoading(true);
        setInitialLoading(false);
      }
      setCast([]);
      try {
        const movieDetails = await fetchItems(
          `${MOVIE_DETAILS}?movie_id=${activeMovieIMDBID}&with_cast=true`
        );
        setActiveMovie(movieDetails?.data?.movie);
        if (movieDetails?.data?.movie?.cast !== undefined) {
          setCast(movieDetails?.data?.movie?.cast);
          console.log(cast);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);

        setError(error.message);
      }
    };

    fetchMovieDetails();
  }, [activeMovieIMDBID]);

  const handleMovieClick = async (movie, index) => {
    setActiveMovieIndex(index);
    setActiveMovieIMDBID(movie.id);
  };

  const handleSearch = (text) => {
    const processedQuery = replaceSpacesWithPlus(text);
    setQuery(processedQuery);
  };

  function replaceSpacesWithPlus(sentence) {
    return sentence.split(" ").join("+");
  }

  const handleNextPage = () => {
    setPageNo((prevPageNo) => prevPageNo + 1);
    setActiveMovieIndex(0);
  };

  const handlePreviousPage = () => {
    if (pageNo > 1) {
      setPageNo((prevPageNo) => prevPageNo - 1);
      setActiveMovieIndex(0);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  return (
    <Background backgroundImage={activeMovie?.large_cover_image}>
      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <ErrorScreen error={error} />
      ) : (
        <Grid container xl={12}>
          <Grid container xl={6}>
            <div className="z-1">
              <DetailCard movie={activeMovie}></DetailCard>
            </div>

            <div
              class="position-absolute"
              style={{
                maxHeight: "90vh",
                overflowX: "clip",
                maxWidth: windowWidth * 0.5,
                overflowY: "auto",
                marginBottom: "10vh",
              }}
            >
              <MovieHeading activeMovie={activeMovie} />
              <MainDetails activeMovie={activeMovie} />

              <Grid container xl={12} ml={5} mb={3}>
                <Typography
                  variant="h6"
                  sx={{ color: "white", opacity: "0.75" }}
                >
                  Cast
                </Typography>
              </Grid>
              <Grid container mb={5}>
                {cast.map((item) => (
                  <Grid item xl={2} mb={3} key={item.id}>
                    <Cast image={item?.url_small_image} name={item?.name} />
                  </Grid>
                ))}
              </Grid>
              <Torrents activeMovie={activeMovie} />
              <YouTubeEmbed ytId={activeMovie?.yt_trailer_code} />
              <Grid container mt={2} ml={3} mb={10}>
                <Typography variant="h5" sx={{ color: "grey" }}>
                  {activeMovie?.title_english} - Official Trailer
                </Typography>
              </Grid>
            </div>
          </Grid>
          <Grid
            container
            xl={5}
            ml={12}
            className="z2"
            style={{
              maxHeight: "95vh",
              overflowX: "clip",
              overflowY: "auto",
            }}
          >
            {/* Heading */}
            <h1 class="z0 color-white w-100 fw-700 text-center m-0 align-content-end">
              Xillica Movies
            </h1>
            <h4 class="z0 color-white w-100 fw-200 text-center bg font-small m-0">
              Surf Your Favorite Movies
            </h4>
            {/* Heading */}

            <Grid xl={12}>
              <Filtering
                options={options}
                selectedOptions={selectedOptions}
                handleSearch={handleSearch}
                handleSelectionChange={handleSelectionChange}
                handleReload={handleReload}
              />
            </Grid>

            {isNoMovies ? (
              <Grid xl={12}>
                <Typography sx={{ color: "grey", textAlign: "left" }}>
                  Nothing Found yet! Keep typing..
                </Typography>
              </Grid>
            ) : (
              <Grid container xl={12} spacing={2}>
                {movies.map((item, index) => (
                  <Grid item xl={3} mb={1} key={item.id}>
                    <MovieCard
                      movie={item}
                      onClick={() => handleMovieClick(item, index)}
                      isActive={index === activeMovieIndex}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 2,
                marginBottom: 2,
                width: "100%", // Ensure the Box stretches the full width of the container
              }}
            >
              <Button
                variant="contained"
                onClick={() => setPageNo(1)}
                disabled={pageNo === 1}
                sx={{ marginRight: 2, backgroundColor: "grey", color: "black" }}
              >
                <ArrowBackIosIcon />
              </Button>
              <Button
                variant="contained"
                onClick={handlePreviousPage}
                disabled={pageNo === 1}
                sx={{ marginRight: 1, backgroundColor: "grey", color: "black" }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                onClick={handleNextPage}
                disabled={movieCount <= 8}
                sx={{ backgroundColor: "white", color: "black" }}
              >
                Next
              </Button>
              {loading && <CircularProgress />}
            </Box>
          </Grid>
        </Grid>
      )}
    </Background>
  );
};

export default HomePage;
