import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { useAlbums } from "../../context/AlbumContext";
import EditOneAlbumPage from "../../app/admin/edit/editOne/page";

// Mock the editOneAlbum function
const mockEditOneAlbum = jest.fn();

// Mock selectedAlbum
const mockSelectedAlbum = {
  id: 1,
  title: "Test Album",
  artist: "Test Artist",
  genre: "Pop",
  year: "2025",
  price: "20",
  format: "CD",
  image: "/test-album.jpg",
  songs: [{ name: "Test Song", duration: "3:45" }],
};

jest.mock("../../context/AlbumContext", () => ({
  useAlbums: jest.fn(),
}));

describe("EditOneAlbumPage", () => {
  beforeEach(() => {
    useAlbums.mockReturnValue({
      editOneAlbum: mockEditOneAlbum,
      selectedAlbum: mockSelectedAlbum,
    });
  });

  test("renders album details correctly", () => {
    render(<EditOneAlbumPage />);

    expect(screen.getByPlaceholderText("album name ex: Sentio(Deluxe)")).toHaveValue("Test Album");
    expect(screen.getByPlaceholderText("artist name ex: Martin Garrix")).toHaveValue("Test Artist");
    expect(screen.getByPlaceholderText("genre ex: pop")).toHaveValue("Pop");
    expect(screen.getByPlaceholderText("year ex: 2025")).toHaveValue("2025");
    expect(screen.getByPlaceholderText("price ex: 10")).toHaveValue("20");
  });

  test("updates album fields", () => {
    render(<EditOneAlbumPage />);

    fireEvent.change(screen.getByPlaceholderText("album name ex: Sentio(Deluxe)"), {
      target: { value: "Updated Album" },
    });

    expect(screen.getByPlaceholderText("album name ex: Sentio(Deluxe)")).toHaveValue("Updated Album");
  });

  test("adds a new song", () => {
    render(<EditOneAlbumPage />);

    fireEvent.change(screen.getByPlaceholderText("song name ex: Follow (feat. Zedd)"), {
      target: { value: "New Song" },
    });
    fireEvent.change(screen.getByPlaceholderText("duration ex: 3:45"), {
      target: { value: "4:00" },
    });
    fireEvent.click(screen.getByText("Add Song"));

    expect(screen.getByText("New Song - 4:00")).toBeInTheDocument();
  });

  test("removes a song", () => {
    render(<EditOneAlbumPage />);

    fireEvent.click(screen.getByText("Remove"));

    expect(screen.queryByText("Test Song - 3:45")).not.toBeInTheDocument();
  });

  test("submits edited album", () => {
    render(<EditOneAlbumPage />);

    fireEvent.click(screen.getByText("Edit Album"));

    expect(mockEditOneAlbum).toHaveBeenCalledWith({
      ...mockSelectedAlbum,
    });
  });
});
