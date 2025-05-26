// src/app/admin/page.js
'use client';
import React from 'react';  
import { useState } from "react";
import { useAlbums } from '../../context/AlbumContext';
import GenreChart from './charts/page';
import PriceChart from './charts/PriceChart'; 
import FormatChart from './charts/FormatChart';
import Link from 'next/link'


export default function AdminPage() {
      
    const { albums, isRestocking, startRestocking, stopRestocking, error } = useAlbums();

    const [sortOrder, setSortOrder] = useState(""); // Sorting state
    const [selectedGenre, setSelectedGenre] = useState(""); // Genre filter state
    const [selectedYear, setSelectedYear] = useState(""); // Year filter state
    

    // Sort and filter albums
    const filteredAlbums = albums
        .filter((album) => (selectedGenre ? album.genre === selectedGenre : true)) // Filter by genre
        .filter((album) => (selectedYear ? album.year.toString() === selectedYear : true)) // Filter by year
        .sort((a, b) => {
        if (sortOrder === "title-asc") return a.title.localeCompare(b.title); // A-Z sort
        if (sortOrder === "price-asc") return a.price - b.price; // Increasing price sort
        if (sortOrder === "title-desc") return b.title.localeCompare(a.title); // Z-A sort
        if (sortOrder === "price-desc") return b.price - a.price; // Descending price sort
        return 0;
    });

    // SILVER - Charts statistics
    const prices = albums.map(album => album.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    // GOLD - Pagination + CHARTS
    const [currentPage, setCurrentPage] = useState(1);
    const [albumsPerPage, setAlbumsPerPage] = useState(12); // Default albums per page is 12

    const indexOfLastAlbum = currentPage * albumsPerPage;
    const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
    const currentAlbums = filteredAlbums.slice(indexOfFirstAlbum, indexOfLastAlbum);


    const getPriceClass = (price) => {
        const priceRange = maxPrice - minPrice;
        const lowThreshold = minPrice + priceRange / 3;
        const highThreshold = minPrice + (2 * priceRange) / 3;
    
        if (price <= lowThreshold) return "bg-green-200";  // Low price range
        if (price <= highThreshold) return "bg-orange-200"; // Medium price range
        return "bg-red-200";  // High price range
      };


    return (
        <div className="flex justify-between min-h-screen">
            <div className="bg-[#3B252C] w-[20%] p-3">
                <div className="font-sans p-2 text-5xl text-center text-stone-50">recorDS</div>
                <div className="pt-2 text-xl text-center text-stone-50 pb-6">Admin page</div>
                <div className="flex flex-col gap-1 text">
                    <Link href="/">
                        <button className="bg-stone-50 hover:bg-stone-200 text-[#634137] font-bold py-2 px-4 rounded-[10] w-full text-left">Home</button>
                    </Link>
                    <Link href="/admin/add">
                        <button className="bg-stone-50 hover:bg-stone-200 text-[#634137] font-bold py-2 px-4 rounded-[10] w-full text-left">Add</button>
                    </Link>
                    <Link href="/admin/edit">
                        <button className="bg-stone-50 hover:bg-stone-200 text-[#634137] font-bold py-2 px-4 rounded-[10] w-full text-left">Edit</button>
                    </Link>
                    <Link href="/admin/remove">
                        <button className="bg-stone-50 hover:bg-stone-200 text-[#634137] font-bold py-2 px-4 rounded-[10] w-full text-left">Remove</button>
                    </Link>
                </div>
                <div>
                    {/* Error Label */}
                    {error === 'network' && (
                        <div style={{ width: '20px', height: '20px', backgroundColor: 'red' }} title="Network Error"></div>
                    )}
                    {error === 'server' && (
                        <div style={{ width: '20px', height: '20px', backgroundColor: 'yellow' }} title="Server Error"></div>
                    )}
                    {/* Other admin page content */}
                    </div>
            </div>

            <div className="flex flex-col min-h-screen bg-fuchsia-100 w-[80%] ">

                
                <div className="flex text-stone-900 w-4 h-4 m-4"> 
                    <p> 🟥highest 🟨average 🟩lowest </p> 
                </div>

                {/* Sorting and Filtering Controls */}
                <div className="flex justify-between mb-6 absolute top-4 right-4 gap-2">
                    {/* Sort Dropdown */}
                    <select 
                        id="sort"
                        aria-label="Sort by"
                        value={sortOrder} 
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="p-2 text-black border-b-2 border-[#634137]-900"
                    >
                    <option value="">Sort by</option>
                    <option value="title-asc">A-Z (Album Name)</option>
                    <option value="title-desc">Z-A (Album Name)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    </select>

                    {/* Genre Filter Dropdown */}
                    <select
                        id="genre-filter"
                        aria-label="Genre"
                        value={selectedGenre} 
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="p-2 text-black border-b-2 border-[#634137]-900"
                    >
                    <option value="">All Genres</option>
                    {Array.from(new Set(albums.map((album) => album.genre))) // Get unique genres
                        .map((genre) => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                    </select>

                    {/* Year Filter Dropdown */}
                    <select 
                        id="year-filter"
                        aria-label="Year"
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="p-2 text-black border-b-2 border-[#634137]-900"
                    >
                        <option value="">All Years</option>
                        {Array.from(new Set(albums.map((album) => album.year))) // Get unique years
                            .sort((a, b) => b - a) // Sort years in descending order
                            .map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                    </select>

                </div>


                {/* Album display */}
                <div className="flex flex-wrap gap-2 justify-center items-center p-4 mt-12">
                    
                    {currentAlbums.map((album) => (
                    <Link href={`/album/${album.id}`}>
                        <div key={album.id} className="p-4 bg-fuchsia-100 rounded-md w-48 h-72 flex flex-col">
                            {album.image.length > 0 && (
                            <Image
                                src={album.image[0].url}
                                alt={album.title}
                                className="w-full h-40 object-cover shadow-xl rounded"
                            />
                            )}
                            <h2 className="font-sans text-stone-950 font-semibold pt-2">{album.title}</h2> 
                            <p className="text-sm text-stone-950">{album.artist} - {album.year}</p>
                            <p className="text-sm text-red-900">{album.genre}</p>
                            <p className={`text-gray-950 ${getPriceClass(album.price)}`}>{album.price} $</p>
                        </div>
                    </Link>
                    ))}

                </div>

                <div className="w-full flex justify-center items-center mt-8 p-4">
                    <button 
                        className="bg-[#672836] hover:bg-[#94A187] text-stone-50 font-bold py-2 px-4 rounded-[10]"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    
                    {/* Albums per page dropdown */}
                    <select
                        value={albumsPerPage}
                        onChange={(e) => {
                            let newAlbumsPerPage = parseInt(e.target.value, 10);
                            setAlbumsPerPage(newAlbumsPerPage);
                            setCurrentPage(1); // Reset to first page when changing albums per page
                        }}
                        className="w-20 text-center text-stone-950 border border-gray-400 rounded-md m-4 p-1 bg-white"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="12">12</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>

                    <span className="text-stone-900 m-4"> Page {currentPage} </span>

                    <button 
                        className="bg-[#672836] hover:bg-[#94A187] text-stone-50 font-bold py-2 px-4 rounded-[10]"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredAlbums.length / albumsPerPage)))}
                        disabled={currentPage === Math.ceil(filteredAlbums.length / albumsPerPage)}
                    >
                        Next
                    </button>
                </div>

                <div className="flex flex-row justify-between gap-4 p-4">
                    <GenreChart />
                    <PriceChart />
                    <FormatChart />
                </div>

                {/* Start/Stop Restock Button */}
                <button 
                    onClick={isRestocking ? stopRestocking : startRestocking}
                    className={`p-2 text-white font-bold rounded-lg w-40 m-4 ${
                        isRestocking ? "bg-red-400" : "bg-[#672836]"
                    }`}
                >
                    {isRestocking ? "Stop Restocking" : "Start Restocking"}
                </button>

                

            </div>
        </div>

    );
  }
