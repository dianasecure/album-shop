'use client';
import { useParams } from 'next/navigation';
import { useAlbums } from '../../../../context/AlbumContext';
import { useShoppingList } from '../../../../context/ShoppingListContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function UserAlbumDetailPage() {
  const { albums } = useAlbums();
  const { addToShoppingList } = useShoppingList();
  const { id } = useParams();
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    const foundAlbum = albums.find((a) => a.id === Number(id));
    setAlbum(foundAlbum);
  }, [albums, id]);

  if (!album) return <p className="text-center mt-10">Album not found</p>;

  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      <Link href="/user">
        <button className="bg-stone-600 text-white px-4 py-2 mb-4 rounded">
          Back
        </button>
      </Link>
      <div className="max-w-xl mx-auto bg-orange-50 shadow-lg rounded-lg overflow-hidden">
        {album.image.length > 0 && (
          <Image src={album.image[0].url} alt={album.title} className="w-full object-cover" />
        )}
        <div className="p-4">
          <h1 className="text-2xl font-bold text-stone-950">{album.title}</h1>
          <p className="text-stone-700">{album.artist} - {album.year}</p>
          <p className="text-stone-900 font-semibold">Genre: {album.genre}</p>
          <p className="text-stone-900 font-semibold">{album.format}</p>
          <p className="text-stone-900 font-semibold">Price: ${album.price}</p>

          <h2 className="mt-4 text-lg text-stone-800 font-semibold">Tracklist:</h2>
          <ul className="list-disc list-inside">
            {album.songs && album.songs.map((song, index) => (
              <li key={index} className="text-stone-800">{song.name} - {song.duration}</li>
            ))}
          </ul>

          <button
            onClick={() => addToShoppingList(album)}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
} 