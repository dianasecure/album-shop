"use client";
import React from 'react';
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { fetchAlbums, fetchAlbumById, addAlbum as addAlbumService, updateAlbum as updateAlbumService, deleteAlbum as deleteAlbumService } from '../services/albumService';

const AlbumContext = createContext();

export function AlbumProvider({ children }) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isRestocking, setIsRestocking] = useState(false);

  const router = useRouter();

  // Load albums when component mounts or filters/sorting changes
  useEffect(() => {
    loadAlbums();
  }, [filters, sortBy, sortOrder]);

  // Function to load albums from the API
  const loadAlbums = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAlbums(filters, sortBy, sortOrder);
      console.log('Fetched albums:', data); // Log the fetched albums
      setAlbums(data);
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('network'); // Network error
      } else {
        setError('server'); // Server error
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to get a single album by ID
  const getAlbumById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const album = await fetchAlbumById(id);
      return album;
    } catch (err) {
      console.error(`Error loading album with ID ${id}:`, err);
      setError(err.message || 'Failed to load album');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new album
  const addAlbum = async (newAlbum) => {
    setLoading(true);
    setError(null);
    try {
      const addedAlbum = await addAlbumService(newAlbum);
      // Refresh the albums list after adding
      await loadAlbums();
      router.push("/admin");
      return addedAlbum;
    } catch (err) {
      console.error('Error adding album:', err);
      setError(err.message || 'Failed to add album');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to update an album
  const updateAlbum = async (id, updatedAlbum) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateAlbumService(id, updatedAlbum);
      // Refresh the albums list after updating
      await loadAlbums();
      return updated;
    } catch (err) {
      console.error(`Error updating album with ID ${id}:`, err);
      setError(err.message || 'Failed to update album');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete an album
  const removeAlbum = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteAlbumService(id);
      // Refresh the albums list after deleting
      await loadAlbums();
    } catch (err) {
      console.error(`Error deleting album with ID ${id}:`, err);
      setError(err.message || 'Failed to delete album');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to select an album for editing
  const editAlbum = (album) => {
    setSelectedAlbum(album);
    router.push(`/admin/edit/editOne`);
  };

  // Function to edit a single album
const editOneAlbum = async (id, updatedAlbum) => {
  setLoading(true);
  setError(null);
  try {
    console.log("Editing album with ID:", id);
    const updated = await updateAlbumService(id, updatedAlbum);
    // Refresh the albums list after editing
    await loadAlbums();
    return updated;
  } catch (err) {
    console.error(`Error editing album with ID ${id}:`, err);
    setError(err.message || 'Failed to edit album');
    throw err;
  } finally {
    setLoading(false);
  }
};

  // Function to update filters
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  // Function to clear filters
  const clearFilters = () => {
    setFilters({});
  };

  // Function to update sorting
  const updateSorting = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  // Restocking functionality
  useEffect(() => {
    let interval;

    if (isRestocking) {
      interval = setInterval(async () => {
        if (albums.length === 0) return; // Ensure there's at least one album to add

        const randomAlbum = albums[Math.floor(Math.random() * albums.length)]; // Pick a random album
        const newAlbum = {
          ...randomAlbum,
          title: `${randomAlbum.title} (Re-stocked)`, // Indicate it's a restock
          price: Math.floor(Math.random() * 100) + 10, // Randomize the price a bit
        };

        try {
          await addAlbumService(newAlbum);
          await loadAlbums(); // Refresh the albums list
        } catch (err) {
          console.error('Error restocking album:', err);
        }
      }, 3000);
    }

    return () => clearInterval(interval); // Clean up on unmount or when stopping
  }, [isRestocking, albums]);

  // Functions to start/stop the restocking
  const startRestocking = () => setIsRestocking(true);
  const stopRestocking = () => setIsRestocking(false);

  return (
    <AlbumContext.Provider value={{ 
      albums, 
      loading, 
      error, 
      filters, 
      sortBy, 
      sortOrder,
      selectedAlbum,
      isRestocking,
      loadAlbums, 
      getAlbumById, 
      addAlbum, 
      updateAlbum, 
      removeAlbum, 
      editAlbum, 
      editOneAlbum,
      updateFilters, 
      clearFilters, 
      updateSorting,
      startRestocking, 
      stopRestocking 
    }}>
      {children}
    </AlbumContext.Provider>
  );
}

export function useAlbums() {
  return useContext(AlbumContext);
}

