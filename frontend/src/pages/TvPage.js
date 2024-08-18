import React, { useEffect, useState } from "react";
import { Grid, Typography, CircularProgress, Box, Button } from "@mui/material";
import { fetchItems } from "../api/api";
import {
  LIST_MOVIES,
  MOVIE_DETAILS,
  OMDB_LIST,
  SERIES_DETAILS,
} from "../config/apiEndpoints";
import Background from "../components/background";
import MovieCard from "../components/movieCard";
import DetailCard from "../components/detail-card";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import { GENRE, MINIMUM_RATING, SORT_BY } from "../config/environment";
import Cast from "../components/cast";
import LoadingScreen from "../components/loadingScreen";
import ErrorScreen from "../components/errorScreen";
import MovieHeading from "../components/movieHeading";
import MainDetails from "../components/mainDetails";
import Torrents from "../components/torrents";
import Filtering from "../components/filtering";
import YouTubeEmbed from "../components/youtube";
import Divider from "../components/divider";

import "../styles/homeStyles.css";
import "../index.css";
import FilteringTV from "../components/filtering-tv";
import TVHeading from "../components/tvHeading";
import TvCard from "../components/tvCard";
import MainDetailsTV from "../components/mainDetailsTV";
import TorrentsTV from "../components/torrentsTV";
import DetailCardTV from "../components/detail-cardTV";

const TvPage = () => {
  const [movies, setMovies] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [cast, setCast] = useState([]);
  const [activeMovie, setActiveMovie] = useState(null);
  const [activeMovieIndex, setActiveMovieIndex] = useState(0);
  const [activeMovieIMDBID, setActiveMovieIMDBID] = useState("tt0944947");
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [finalPageNo, setFinalPageNo] = useState(1);
  const [movieCount, setMovieCount] = useState(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [isNoMovies, setIsNoMovies] = useState(false);
  const [torrents, setTorrents] = useState(null);
  const moviesPerPage = 8;
  const torrentsPerPageInSeries = 100;

  const extractNumber = (str) => {
    return str
      .split("")
      .filter((char) => !isNaN(char) && char !== " ")
      .join("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesList = await fetchItems(
          `${OMDB_LIST}&s=${query}&page=${pageNo}&type=series`
        );
        if (moviesList?.Search?.length > 0) {
          setIsNoMovies(false);
          setMovies(moviesList?.Search);
          setActiveMovieIndex(0);
          setMovieCount(moviesList?.Search?.totalResults || 0);
          setActiveMovieIMDBID(moviesList?.Search[0]?.imdbID);
          setFinalPageNo(
            movieCount % moviesPerPage !== 0
              ? Math.floor(movieCount / moviesPerPage) + 1
              : Math.floor(movieCount / moviesPerPage)
          );
        } else {
          setIsNoMovies(true);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [query, pageNo]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (initialLoading) {
        setLoading(true);
        setInitialLoading(false);
      }
      setCast([]);
      try {
        const movieDetails = await fetchItems(
          `${OMDB_LIST}&i=${activeMovieIMDBID}&plot=full`
        );
        const torrentList = await fetchItems(
          `${SERIES_DETAILS}?imdb_id=${extractNumber(activeMovieIMDBID)}&limit=${torrentsPerPageInSeries}&page=1`
        );
        setTorrents(torrentList?.torrents);
        setActiveMovie(movieDetails);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setInitialLoading(false);

        setError(error.message);
      }
    };

    fetchMovieDetails();
  }, [activeMovieIMDBID]);

  const handleSearchClick = () => {
    // setSearch(true);
  };

  const handleMovieClick = async (movie, index) => {
    setActiveMovieIndex(index);
    setActiveMovieIMDBID(movie.imdbID);
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

  const handleFinalPage = () => {
    setPageNo(
      movieCount % moviesPerPage != 0
        ? Math.floor(movieCount / moviesPerPage) + 1
        : Math.floor(movieCount / moviesPerPage)
    );
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
    <Background backgroundImage={activeMovie?.Poster}>
      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <ErrorScreen error={error} />
      ) : (
        <Grid container xl={12}>
          <Grid container xl={6}>
            <div className="z-1 fade-slide-up">
              <DetailCardTV movie={activeMovie}></DetailCardTV>
            </div>

            <div
              class="position-absolute fade-slide-up"
              style={{
                maxHeight: "90vh",
                overflowX: "clip",
                maxWidth: windowWidth * 0.5,
                overflowY: "auto",
                marginBottom: "10vh",
              }}
            >
              <TVHeading activeMovie={activeMovie} />
              <MainDetailsTV activeMovie={activeMovie} />
              <Divider />
              <TorrentsTV torrents={torrents} />
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
              Xillica Series
            </h1>
            <h4 class="z0 color-white w-100 fw-200 text-center bg font-small m-0">
              Surf Your Favorite Series
            </h4>
            {/* Heading */}

            <Grid xl={12}>
              <FilteringTV handleSearch={handleSearch} />
            </Grid>

            {isNoMovies ? (
              <Grid xl={12}>
                <Typography sx={{ color: "grey", textAlign: "left" }}>
                  Nothing Found yet! Keep typing..
                </Typography>
              </Grid>
            ) : (
              <Grid
                container
                xl={12}
                spacing={2}
                style={{
                  maxHeight: "60vh",
                  overflowX: "clip",
                  overflowY: "auto",
                }}
              >
                {movies.map((item, index) => (
                  <Grid item xl={3} mb={1} key={item.imdbID}>
                    <TvCard
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
                sx={{ marginRight: 1, backgroundColor: "grey", color: "black" }}
              >
                <KeyboardDoubleArrowLeftIcon />
              </Button>
              <Button
                variant="contained"
                onClick={handlePreviousPage}
                disabled={pageNo === 1}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                <KeyboardArrowLeftIcon />
              </Button>
              <Typography
                ml={1}
                mr={1}
                sx={{ color: "grey", textAlign: "center", fontSize: "0.7rem" }}
              >
                Page {pageNo}
              </Typography>
              <Button
                variant="contained"
                onClick={handleNextPage}
                disabled={moviesPerPage * pageNo >= movieCount}
                sx={{
                  marginRight: 1,
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                <KeyboardArrowRightIcon />
              </Button>
              <Button
                variant="contained"
                onClick={handleFinalPage}
                disabled={moviesPerPage * pageNo >= movieCount}
                sx={{ backgroundColor: "grey", color: "black" }}
              >
                <KeyboardDoubleArrowRightIcon />
              </Button>
              {loading && <CircularProgress />}
            </Box>
          </Grid>
        </Grid>
      )}
    </Background>
  );
};

export default TvPage;
