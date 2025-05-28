import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import { AlbumProvider, useAlbums } from '../../context/AlbumContext'; // Adjust the import path as needed
import { useRouter } from 'next/navigation';

// Mock Next.js useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Custom component to consume the AlbumContext for testing
const AlbumTestComponent = () => {
  const { albums, addAlbum, removeAlbum, editAlbum } = useAlbums();

  return (
    <div>
      <button onClick={() => addAlbum({ title: "New Album", artist: "Artist", genre: "Pop", year: 2025, price: 20, format: "CD", image: "", songs: [] })}>
        Add Album
      </button>
      <button onClick={() => removeAlbum(1)}>
        Remove Album
      </button>
      <button onClick={() => editAlbum({ id: 1, title: "Edited Album", artist: "Artist", genre: "Pop", year: 2025, price: 20, format: "CD", image: "", songs: [] })}>
        Edit Album
      </button>

      <div>
        {albums.map((album) => (
          <div key={album.id} data-testid="album">
            <p>{album.title}</p>
            <p>{album.artist}</p>
            <p>{album.genre}</p>
            <p>{album.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

describe('Album Context', () => {
  // Mock the push method for useRouter
  const pushMock = jest.fn();

  beforeEach(() => {
    // Reset the mock before each test
    pushMock.mockReset();

    // Mock implementation of useRouter to return our mock push function
    useRouter.mockImplementation(() => ({
      push: pushMock,
    }));
  });

  test('should add a new album', async () => {
    render(
      <AlbumProvider>
        <AlbumTestComponent />
      </AlbumProvider>
    );

    const addButton = screen.getByText('Add Album');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('New Album')).toBeInTheDocument();
      expect(screen.getByText('Artist')).toBeInTheDocument();
      expect(screen.getByText('2014')).toBeInTheDocument();
    });
  });

  test('should remove an album', async () => {
    render(
      <AlbumProvider>
        <AlbumTestComponent />
      </AlbumProvider>
    );

    const removeButton = screen.getByText('Remove Album');
    fireEvent.click(removeButton);

    // Wait for album to be removed
    await waitFor(() => {
      expect(screen.queryByText('I AM MUSIC')).not.toBeInTheDocument();
    });
  });

  test('should edit an album', async () => {
    render(
      <AlbumProvider>
        <AlbumTestComponent />
      </AlbumProvider>
    );

    // First, add an album
    const addButton = screen.getByText('Add Album');
    fireEvent.click(addButton);

    // Wait for the album to appear
    await waitFor(() => screen.getByText('New Album'));

    const editButton = screen.getByText('Edit Album');
    fireEvent.click(editButton);

    // Check that router.push was called when the edit button is clicked
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/admin/edit/editOne");
    });
  });
});
