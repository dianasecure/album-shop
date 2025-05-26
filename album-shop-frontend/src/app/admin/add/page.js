'use client';
import { useState } from "react";
import Link from 'next/link'

export default function AddAlbumPage() {
  const [album, setAlbum] = useState({ title: "", artist: "", genre: "", year: "", price:"", format: "CD", image: "", songs: [] });
  const [newSong, setNewSong] = useState({ name: "", duration: "" });

  const handleChange = (e) => {
    setAlbum({ ...album, [e.target.name]: e.target.value });
  };

  const handleSongChange = (e) => {
    setNewSong({ ...newSong, [e.target.name]: e.target.value });
  };

  const addSong = () => {
    if (newSong.name && newSong.duration) {
      setAlbum({ ...album, songs: [...album.songs, newSong] });
      setNewSong({ name: "", duration: "" });
    }
  };

  const removeSong = (index) => {
    setAlbum({ ...album, songs: album.songs.filter((_, i) => i !== index) });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   addAlbum(album);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(album),
    });
  
    if (res.ok) {
      alert("Album added!");
    }
  };
  

  return (
    <div className="p-6 bg-orange-50">

      <Link href="/admin">
          <button className="bg-stone-600 text-white px-4 py-2 mb-2 rounded">Back</button>
      </Link>

      <h1 className="text-2xl font-bold text-stone-950">Add CD/Vinyl</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="album name ex: Sentio(Deluxe)" value={album.title} onChange={handleChange} className="border-b-2 border-stone-300 p-2 w-full text-stone-950"/>
        <input type="text" name="artist" placeholder="artist name ex: Martin Garrix" value={album.artist} onChange={handleChange} className="border-b-2 border-stone-300 p-2 w-full text-stone-950"/>
        <input type="text" name="genre" placeholder="genre ex: pop" value={album.genre} onChange={handleChange} className="border-b-2 border-stone-300 p-2 w-full text-stone-950"/>
        <input type="text" name="year" placeholder="year ex: 2025" value={album.year} onChange={handleChange} className="border-b-2 border-stone-300 p-2 w-full text-stone-950"/>
        <input type="text" name="price" placeholder="price ex: 10" value={album.price} onChange={handleChange} className="border-b-2 border-stone-300 p-2 w-full text-stone-950"/>

        <select name="format" value={album.format} onChange={handleChange} className="border-b-2 border-stone-300 p-2 w-full text-stone-950">
          <option value="CD">CD</option>
          <option value="Vinyl">Vinyl</option>
        </select>

        <input type="text" name="image" placeholder="image URL from pc" value={album.image} onChange={handleChange} className="border-b-2 border-stone-300 p-2 w-full text-stone-950"/>

        {/* Add Song Section */}
        <div className="border p-4">
          <h2 className="text-lg font-semibold text-stone-800">Songs</h2>
          <input type="text" name="name" placeholder="song name ex: Follow (feat. Zedd)" value={newSong.name} onChange={handleSongChange} className="border p-2 w-full mt-2 border-stone-300 text-stone-950"/>
          <input type="text" name="duration" placeholder="duration ex: 3:45" value={newSong.duration} onChange={handleSongChange} className="border p-2 w-full mt-2 border-stone-300 text-stone-950"/>
          <button type="button" onClick={addSong} className="bg-stone-700 text-white px-3 py-1 mt-2 rounded">Add Song</button>

          <ul className="mt-2">
            {album.songs.map((song, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span className="text-stone-950">{song.name} - {song.duration}</span>
              <button type="button" onClick={() => removeSong(index)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                Remove
              </button>
            </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="bg-stone-800 text-white px-4 py-2 rounded">Add Album</button>
      </form>
    </div> 
  );
}
