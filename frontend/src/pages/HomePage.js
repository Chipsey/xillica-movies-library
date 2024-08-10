import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { fetchItems } from "../api/api";
import { LIST_MOVIES } from "../config/apiEndpoints";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesList = await fetchItems(`${LIST_MOVIES}`);
        setMovies(moviesList?.data?.movies);
        console.log(movies);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        marginTop: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
      >
        Home Page
      </Typography>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="60vh"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography
          color="error"
          sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" } }}
        >
          Failed to fetch items: {error}
        </Typography>
      ) : (
        <Grid container spacing={2} mt={4}>
          <Grid item xs={12}>
            <List>
              {movies.map((item) => (
                <ListItem key={item.id} sx={{ borderBottom: "1px solid #ddd" }}>
                  <ListItemText primary={item.title_long} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default HomePage;
