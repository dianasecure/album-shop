// AlbumDetailPage.test.js
import { render, screen, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import { useAlbums } from '../../context/AlbumContext';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router'; // Import useRouter from next/router
import AlbumDetailPage from '../../app/album/[id]/page'; // Adjust the path according to your app


// Mock the necessary hooks from next/navigation and next/router
jest.mock('next/navigation', () => ({
    useParams: jest.fn(), // Mock useParams here
  }));
  
  jest.mock('next/router', () => ({
    useRouter: jest.fn(), // Mock useRouter here
  }));
  
  // Mock the useAlbums context hook
  jest.mock('../../context/AlbumContext', () => ({
    useAlbums: jest.fn(),
  }));
  
  describe('AlbumDetailPage', () => {
    const mockAlbum = {
      id: 1,
      title: 'Test Album',
      artist: 'Test Artist',
      year: '2025',
      genre: 'Pop',
      format: 'CD',
      price: '20',
      image: '/test-album.jpg',
      songs: [{ name: 'Test Song', duration: '3:45' }],
    };
  
    beforeEach(() => {
      // Mock the useRouter hook to return a mock router object
      useRouter.mockReturnValue({
        push: jest.fn(),
        query: {}, // You can modify the query if needed
      });
  
      // Mock the useParams hook to return the dynamic `id`
      useParams.mockReturnValue({ id: '1' });
  
      // Mock the useAlbums hook to return the album list
      useAlbums.mockReturnValue({ albums: [mockAlbum] });
    });
  
    test('renders album details', async () => {
      render(<AlbumDetailPage />);
  
      // Check if album details are rendered correctly
      await waitFor(() => {
        expect(screen.getByText('Test Album')).toBeInTheDocument();
        expect(screen.getByText('Test Artist - 2025')).toBeInTheDocument();
        expect(screen.getByText('Genre: Pop')).toBeInTheDocument();
        expect(screen.getByText('Price: $20')).toBeInTheDocument();
        expect(screen.getByText('Test Song - 3:45')).toBeInTheDocument();
      });
    });
  
    test('shows "Album not found" if album is not found', async () => {
      useAlbums.mockReturnValue({ albums: [] }); // Simulate no albums
  
      render(<AlbumDetailPage />);
  
      // Check if "Album not found" is displayed
      await waitFor(() => {
        expect(screen.getByText('Album not found')).toBeInTheDocument();
      });
    });
  
    test('displays album details correctly with dynamic routing', async () => {
      // This test will check if the dynamic routing works correctly
      useParams.mockReturnValue({ id: '1' }); // Mocking ID for dynamic routing
      render(<AlbumDetailPage />);
  
      await waitFor(() => {
        expect(screen.getByText('Test Album')).toBeInTheDocument();
        expect(screen.getByText('Test Artist - 2025')).toBeInTheDocument();
      });
    });
  });