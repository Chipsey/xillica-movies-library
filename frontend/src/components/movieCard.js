import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import "../styles/movieCardStyles.css";

const MovieCard = ({ movie, onClick }) => {
  console.log(movie);
  const windowWidth = window.innerWidth;
  const primaryWidth = windowWidth / 30;

  return (
    <Card
      onClick={onClick}
      sx={{
        width: primaryWidth * 2.8,
        margin: "auto",
        boxShadow: 3,
        borderRadius: 3,
        height: primaryWidth * 4.5,
        backgroundColor: "rgba(100, 100, 100)",
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height={primaryWidth * 3}
          image={movie?.large_cover_image}
          alt={movie?.title_english}
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // Space the content evenly
            height: primaryWidth,
          }}
        >
          <Typography gutterBottom variant="h8" component="div" color="white">
            <div className="card_movie_title">{movie?.title_english}</div>
          </Typography>
          <Typography
            variant="body3"
            component="div"
            color="white"
            sx={{
              mt: "auto", // Move the year to the bottom
            }}
          >
            <div className="card_movie_year">{movie?.year}</div>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;
