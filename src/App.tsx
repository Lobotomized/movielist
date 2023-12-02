import React, { useEffect, useState } from 'react';
import './App.css';
import { Movie } from './Movie'


function App() {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[] | undefined>(undefined);
  const [releaseYear, setReleaseYear] = useState<string>('2000');
  const [genres, setGenres] = useState<string[]>([]);
  const [genre, setGenre] = useState<string>('');
  const [hideNextPage, setHideNextPage] = useState<boolean>(false);

  function onReleaseDateChange(event: React.ChangeEvent<HTMLInputElement>){
    setPage(1);
    setReleaseYear(event.target.value + '');
  }
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://moviesdatabase.p.rapidapi.com/titles/utils/genres`, {
        method: "GET",
        headers: {
          'X-RapidAPI-Key':"68406432f0msh0f371dd02a70857p11cfe4jsn228b8809ebc1"
        }
      });
      const tempGenres = await response.json();
      setGenres(tempGenres.results);
    };
    fetchData();
  }, [])
  
  useEffect(() => {
    const handler = setTimeout(() => {
      let tempYear = parseInt(releaseYear);
      if(tempYear < 1896 || !tempYear){
        tempYear = 1896;
      }
      else if(tempYear > 2023){
        tempYear = 2023;
      }
      setReleaseYear(tempYear + '');
    }, 500);
 
    return () => {
      clearTimeout(handler);
    };
  }, [releaseYear]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://moviesdatabase.p.rapidapi.com/titles?page=+${page}&year=${releaseYear}${genre === '' ? '' : '&genre=' + genre}`, {
        method: "GET",
        headers: {
          'X-RapidAPI-Key':"68406432f0msh0f371dd02a70857p11cfe4jsn228b8809ebc1"
        }
      });
      const tempMovies = await response.json();

      setMovies(tempMovies.results); 
    };
    fetchData();
  },[page, releaseYear,genre])

  return (
    <div className="App">
      <h1 className="title">Movies with Tumba</h1>
      <div className="menu">
        
        <div className="genreContainer">
          <label>Genre: </label>
          <select className="select" onChange={(event:React.ChangeEvent<HTMLSelectElement>) => {
            setGenre(event.target.value)
            setPage(1);
            }}>
            {
              genres.map((genre, index) => {
                return <option key={'genre'+index} value={genre}>{genre}</option>
              })
            }
          </select>
        </div>
          
        <div className="releaseYear">
          <label>Release year: </label>
          <input className="releaseYearInput" value={releaseYear} type="number" onChange={onReleaseDateChange}/>
        </div>
        

      </div>

      

      <div className="moviesContainer">
        {
          movies?.map((movie, index) => {
            return <div className="singleMovieContainer" key={'movie'+index}>
                <h3 className="singleMovieTitle">{movie.titleText.text}</h3>
                {
                  movie.primaryImage? 
                  <img className="image" src={movie.primaryImage.url} alt={movie.primaryImage.caption.playText} /> : 
                  <img className="image" src='./movieDefault.jpeg' />
                }
                <div className="releaseYearSpan">
                  <span>Released : {movie.releaseYear.year}</span>

                </div>
            </div>
          })
        }

        {
          !movies || movies.length === 0 ? <h3>No Movies found</h3> : ''
        }
      </div>
      <div className="pages">
              {
                page > 1? <button className="pageButton" onClick={() => {setPage(page-1)}}>&#8592; Previous Page</button> : ''
              }
              
              {
                !movies || movies.length < 10 || hideNextPage? "" : <button className="pageButton nextPage" onClick={() => {
                  if(movies.length >= 10){
                    setPage(page+1)
                  }
                }}>Next Page &#8594;	</button>
              }
              
        </div>
      <div className="pageRow">
        <span>Current Page : {page}</span>

      </div>

    </div>
  );
}

export default App;
