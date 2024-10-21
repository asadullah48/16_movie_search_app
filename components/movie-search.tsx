"use client";

import { useState, ChangeEvent } from "react"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, StarIcon } from "lucide-react"; 
import Image from "next/image"; 
import ClipLoader from "react-spinners/ClipLoader";

// Define the MovieDetails type
type MovieDetails = {
  Title: string;
  Year: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  Genre: string;
  Director: string;
  Actors: string;
  Runtime: string;
  Released: string;
};

export default function MovieSearch() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    

  // Function to handle the search button click
  const handleSearch = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setMovieDetails(null);
    try {
        const response = await fetch(
            `https://www.omdbapi.com/?t=${searchTerm}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
        );
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data.Response === "False") {
            throw new Error(data.Error);
        }
        setMovieDetails(data);
    } catch (error: unknown) {
        if (error instanceof Error) {
            setError(error.message);
        } else {
            setError("An unknown error occurred.");
        }
    } finally {
        setLoading(false);
    }
};


  // Function to handle changes in the search input field
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value); // Update the search term state with input value
  };

  // Function to clear the search and reset the state
  const handleClear = (): void => {
    setSearchTerm(""); // Clear the search term
    setMovieDetails(null); // Clear the movie details
    setError(null); // Clear any errors
  };

  // JSX return statement rendering the Movie Search UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-lg p-6 rounded-lg shadow-2xl bg-gray-800 border border-gray-700 transition-all hover:border-blue-500 hover:shadow-blue-500/50">
        {/* Title of the Movie Search component */}
        <h1 className="text-4xl font-bold mb-1 text-center">
          <span className="text-blue-500">Movie</span>{" "}
          <span className="text-red-500">Search</span>
        </h1>
        <p className="mb-6 text-center text-gray-400">
          Search for any movie and display details.
        </p>
        <div className="flex items-center mb-6">
          {/* Search input field */}
          <Input
            type="text"
            placeholder="Enter a movie title"
            value={searchTerm}
            onChange={handleChange}
            className="flex-1 mr-2 px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {/* Search button */}
          <Button
            onClick={handleSearch}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition duration-300"
          >
            Search
          </Button>
          {/* Clear button */}
          <Button
            onClick={handleClear}
            className="ml-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition duration-300"
          >
            Clear
          </Button>
        </div>
        {/* Loading spinner */}
        {loading && (
          <div className="flex justify-center items-center">
            <ClipLoader className="w-6 h-6 text-indigo-500" />
          </div>
        )}
        {/* Error message */}
        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}. Please try searching for another movie.
          </div>
        )}
        {/* Movie details */}
        {movieDetails && (
          <div className="flex flex-col items-center">
            <div className="w-full mb-4">
              {/* Movie poster image */}
              <Image
                src={
                  movieDetails.Poster !== "N/A"
                    ? movieDetails.Poster
                    : "/placeholder.svg"
                }
                alt={movieDetails.Title}
                width={200}
                height={300}
                className="rounded-md shadow-lg mx-auto hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="w-full text-center">
              <h2 className="text-2xl font-bold mb-2 text-white">
                {movieDetails.Title}
              </h2>
              <p className="text-gray-400 mb-4 italic">{movieDetails.Plot}</p>
              {/* Movie details section */}
              <div className="flex justify-center items-center text-gray-400 mb-2">
                <CalendarIcon className="w-4 h-4 mr-1 text-indigo-500" />
                <span className="mr-4">{movieDetails.Year}</span>
                <StarIcon className="w-4 h-4 mr-1 fill-yellow-500" />
                <span>{movieDetails.imdbRating}</span>
              </div>
              <div className="text-gray-400 mb-2">
                <strong>Genre:</strong> {movieDetails.Genre}
              </div>
              <div className="text-gray-400 mb-2">
                <strong>Director:</strong> {movieDetails.Director}
              </div>
              <div className="text-gray-400 mb-2">
                <strong>Actors:</strong> {movieDetails.Actors}
              </div>
              <div className="text-gray-400 mb-2">
                <strong>Runtime:</strong> {movieDetails.Runtime}
              </div>
              <div className="text-gray-400 mb-2">
                <strong>Released:</strong> {movieDetails.Released}
              </div>
            </div>
          </div>
        )}
      </div>
                  {/* Footer section */}
                  <footer className="mt-4 text-sm text-muted-foreground">
        Generated By Asadullah Shafique
      </footer>
    </div>
  );
}