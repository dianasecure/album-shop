import React from 'react';
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { useAlbums } from '../../context/AlbumContext';
import RemoveAlbumPage from "../../app/admin/remove/page";

// Mock the removeAlbum function
const mockRemoveAlbum = jest.fn();

// Mock albums
const mockAlbums = [
  { id: 1, title: "Dalliance", artist: "Chase Atlantic", year: 2014, price: 500, image: "/DALLIANCE.jpeg" },
  { id: 2, title: "Emotion", artist: "Carly Rae Jepsen", year: 2015, price: 10, image: "/EMOTION.jpeg" },
];

jest.mock('../../context/AlbumContext', () => ({
  useAlbums: jest.fn(),
}));

describe("Remove Album Page", () => {
  beforeEach(() => {
    useAlbums.mockReturnValue({ albums: mockAlbums, removeAlbum: mockRemoveAlbum });
  });

  test("renders album list", () => {
    render(<RemoveAlbumPage />);

    expect(screen.getByText("Dalliance")).toBeInTheDocument();
    expect(screen.getByText("Emotion")).toBeInTheDocument();
  });

  test("removes an album", () => {
    render(<RemoveAlbumPage />);

    // Click the remove button for the first album
    fireEvent.click(screen.getAllByText("Remove")[0]);

    // Ensure removeAlbum was called with the correct album ID
    expect(mockRemoveAlbum).toHaveBeenCalledWith(1);
  });
});
