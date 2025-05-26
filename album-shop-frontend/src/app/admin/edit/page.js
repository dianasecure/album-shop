'use client';
import { useState } from "react";
import { useAlbums } from "../../../context/AlbumContext";
import Link from 'next/link'

export default function EditAlbumPage(){
  const { albums, editAlbum } = useAlbums();

  return(
    <div className="p-6 bg-orange-50 min-h-screen">
      
      <Link href="/admin">
          <button className="bg-stone-600 text-white px-4 py-2 mb-2 rounded">Back</button>
      </Link>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-stone-950">Choose album to edit</h1>
      </div>

      <div className="flex flex-wrap justify-left gap-6">
        
        {albums.map((album) => (
          <div key={album.id} >
            <div className="p-4 bg-fuchsia-100 rounded-md w-48 h-80 flex flex-col m-2">
                <Image src={album.image} className="w-full h-40 object-cover shadow-md"/>
                <h2 className="font-sans text-stone-950 font-semibold pt-2">{album.title}</h2> 
                <p className="text-sm text-stone-950">{album.artist} - {album.year}</p>
                <p className="text-gray-950">{album.price} $</p>
            </div>

            <div className="p-4 bg-fuchsia-100 rounded-md w-48 flex flex-col m-2 mt-0">
                <button type="button" onClick={() => editAlbum(album)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                  Edit
                </button>
            </div>
          </div>
            
        ))}
      </div>
      
    </div>


  );

}