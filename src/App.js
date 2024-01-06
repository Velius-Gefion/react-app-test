import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from "./components/auth";
import { db, auth , storage} from "./config/firebase";
import { getDocs, collection , addDoc, deleteDoc, updateDoc, doc} from "firebase/firestore";
import { ref, uploadBytes } from 'firebase/storage';

function App()
{
  const [movieList, setMovieList] = useState([]);

  //New Movie State
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [oscarWorthy, setOscarWorthy] = useState(false);

  //Update Title State
  const [updatedTitle, setUpdatedTitle] = useState("");

  //File Upload State
  const [fileUpload, setFileUpload] = useState(null);


  const moviesCollectionRef = collection(db, "movies");
  
  const onSubmitMovie = async () =>
  {
    try
    {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle, 
        releaseDate: newReleaseDate, 
        oscar: oscarWorthy,
        userId: auth?.currentUser?.uid,
      });
    } catch (errr)
    {
      console.error(errr);
    }
  };

  const deleteMovie = async (id) => 
  {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
  };

  const updateMovieTitle = async (id) => 
  {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, {title: updatedTitle});
  };

  const uploadFile = async () =>
  {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try{
      await uploadBytes(filesFolderRef, fileUpload);
    }
    catch(errr)
    {
      console.error(errr);
    }
  };

  useEffect(() => 
  {
    const getMovieList = async () =>
    {
      try{
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id,}));
      setMovieList(filteredData);
      }catch(errr)
      {
        console.error(errr);
      }
    };
      getMovieList();
  }, [])

  return (
    <div className="App">
      <Auth/>

      <div>
        <input placeholder="Movie Title..." onChange={(e) => setNewMovieTitle(e.target.value)}/>
        <input placeholder="Release Date..." type="number" onChange={(e) => setNewReleaseDate(Number(e.target.value))}/>
        <input type="checkbox" checked={oscarWorthy} onChange={(e) => setOscarWorthy(e.target.checked)}/>
        <label>Received an Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>

      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{color: movie.oscar ? "green" : "red"}}>
              
              {movie.title}
              </h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

            <input placeholder="New Title..." onChange={(e) => setUpdatedTitle(e.target.value)}/>
            <button onClick={() => updateMovieTitle(movie.id)}>Update Title</button>
            </div>
        ))}
      </div>

      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])}/>
        <button onClick={uploadFile}>Submit File</button>
      </div>
    </div>
  );
}

export default App;
