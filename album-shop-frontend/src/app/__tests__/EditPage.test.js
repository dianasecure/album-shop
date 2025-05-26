import React from 'react';
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { useAlbums } from '../../context/AlbumContext';
import EditAlbumPage from "../../app/admin/edit/page";

// Mock the editAlbum function
const mockEditAlbum = jest.fn();

// Mock albums
const mockAlbums = [
  { id: 1, title: "Dalliance", artist: "Chase Atlantic", year: 2014, price: 500, image: "/DALLIANCE.jpeg" },
  { id: 2, title: "Emotion", artist: "Carly Rae Jepsen", year: 2015, price: 10, image: "/EMOTION.jpeg" },
];

jest.mock('../../context/AlbumContext', () => ({
  useAlbums: jest.fn(),
}));

describe("Edit Album Page", () => {
  beforeEach(() => {
    useAlbums.mockReturnValue({ albums: mockAlbums, editAlbum: mockEditAlbum });
  });

  test("renders album list", () => {
    render(<EditAlbumPage />);

    expect(screen.getByText("Dalliance")).toBeInTheDocument();
    expect(screen.getByText("Emotion")).toBeInTheDocument();
  });

  test("calls editAlbum when clicking Edit button", () => {
    render(<EditAlbumPage />);

    // Click the edit button for the first album
    fireEvent.click(screen.getAllByText("Edit")[0]);

    // Ensure editAlbum was called with the correct album object
    expect(mockEditAlbum).toHaveBeenCalledWith(mockAlbums[0]);
  });
});
