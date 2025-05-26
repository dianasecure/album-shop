// API base URL - use environment variable with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/albums';

/**
 * Fetch all albums with optional filtering and sorting
 * @param {Object} filters - Filter parameters
 * @param {string} filters.genre - Filter by genre
 * @param {string} filters.artist - Filter by artist
 * @param {string} filters.format - Filter by format (CD, Vinyl, Digital)
 * @param {number} filters.minPrice - Minimum price
 * @param {number} filters.maxPrice - Maximum price
 * @param {number} filters.minYear - Minimum year
 * @param {number} filters.maxYear - Maximum year
 * @param {string} sortBy - Field to sort by (title, artist, genre, year, price)
 * @param {string} order - Sort order (asc, desc)
 * @returns {Promise<Array>} - Array of albums
 */
export const fetchAlbums = async (filters = {}, sortBy = null, order = 'asc') => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    // Add sorting parameters
    if (sortBy) {
      queryParams.append('sortBy', sortBy);
      queryParams.append('order', order);
    }
    
    // Construct URL with query parameters
    const url = `${API_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    console.log('Fetching albums from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch albums');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw error;
  }
};

/**
 * Fetch a single album by ID
 * @param {number} id - Album ID
 * @returns {Promise<Object>} - Album object
 */
export const fetchAlbumById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Album not found');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch album');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching album with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Add a new album
 * @param {Object} album - Album data
 * @returns {Promise<Object>} - Created album
 */
export const addAlbum = async (album) => {
  try {
    console.log('Adding album:', album);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(album),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add album');
    }
    
    const data = await response.json();
    console.log('Album added successfully:', data);
    return data;
  } catch (error) {
    console.error('Error adding album:', error);
    throw error;
  }
};

/**
 * Update an existing album
 * @param {number} id - Album ID
 * @param {Object} album - Updated album data
 * @returns {Promise<Object>} - Updated album
 */
export const updateAlbum = async (id, album) => {
  try {
    console.log(`Updating album with ID ${id}:`, album);
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(album),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Album not found');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update album');
    }
    
    const data = await response.json();
    console.log('Album updated successfully:', data);
    return data;
  } catch (error) {
    console.error(`Error updating album with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an album
 * @param {number} id - Album ID
 * @returns {Promise<Object>} - Success message
 */
export const deleteAlbum = async (id) => {
  try {
    console.log(`Deleting album with ID ${id}`);
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Album not found');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete album');
    }
    
    const data = await response.json();
    console.log('Album deleted successfully:', data);
    return data;
  } catch (error) {
    console.error(`Error deleting album with ID ${id}:`, error);
    throw error;
  }
}; 