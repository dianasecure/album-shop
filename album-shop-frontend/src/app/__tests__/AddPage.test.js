// __tests__/AddPage.test.js
import React from 'react';
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { useAlbums } from '../../context/AlbumContext';
import AddAlbumPage from "../../app/admin/add/page";

// Mock the addAlbum function
const mockAddAlbum = jest.fn();

// Mock useAlbums to return mockAlbums
jest.mock('../../context/AlbumContext', () => ({
  useAlbums: jest.fn(),
}));

describe("Add Page", () => {
  beforeEach(() => {
    useAlbums.mockReturnValue({ addAlbum: mockAddAlbum });
  });

  test("renders form correctly", () => {
    render(<AddAlbumPage />);
    expect(screen.getByText("Add CD/Vinyl")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("album name ex: Sentio(Deluxe)")).toBeInTheDocument();
    expect(screen.getByText("Add Album")).toBeInTheDocument();
  });

  test("allows user to input album details", () => {
    render(<AddAlbumPage />);
    const titleInput = screen.getByPlaceholderText("album name ex: Sentio(Deluxe)");
    fireEvent.change(titleInput, { target: { value: "Test Album" } });
    expect(titleInput.value).toBe("Test Album");
  });

  test("adds and removes songs", () => {
    render(<AddAlbumPage />);
    const songNameInput = screen.getByPlaceholderText("song name ex: Follow (feat. Zedd)");
    const songDurationInput = screen.getByPlaceholderText("duration ex: 3:45");
    const addSongButton = screen.getByText("Add Song");

    // Add song
    fireEvent.change(songNameInput, { target: { value: "Test Song" } });
    fireEvent.change(songDurationInput, { target: { value: "3:30" } });
    fireEvent.click(addSongButton);
    
    expect(screen.getByText("Test Song - 3:30")).toBeInTheDocument();
    
    // Remove song
    fireEvent.click(screen.getByText("Remove"));
    expect(screen.queryByText("Test Song - 3:30")).not.toBeInTheDocument();
  });

  test("submits album", () => {
    render(<AddAlbumPage />);
    fireEvent.change(screen.getByPlaceholderText("album name ex: Sentio(Deluxe)"), { target: { value: "Test Album" } });
    fireEvent.change(screen.getByPlaceholderText("artist name ex: Martin Garrix"), { target: { value: "Test Artist" } });
    fireEvent.change(screen.getByPlaceholderText("year ex: 2025"), { target: { value: "2023" } });
    fireEvent.change(screen.getByPlaceholderText("price ex: 10"), { target: { value: "15" } });

    fireEvent.click(screen.getByText("Add Album"));
    expect(mockAddAlbum).toHaveBeenCalledWith({
      title: "Test Album",
      artist: "Test Artist",
      genre: "",
      year: "2023",
      price: "15",
      format: "CD",
      image: "",
      songs: [],
    });
  });

});