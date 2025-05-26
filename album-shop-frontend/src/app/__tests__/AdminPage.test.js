// __tests__/AdminPage.test.js
import React from 'react';
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { useAlbums } from '../../context/AlbumContext';
import AdminPage from "../../app/admin/page";

// Mock album data
const mockAlbums = [
  { id: 1, title: "Dalliance", artist: "Chase Atlantic", genre: "Pop", year: 2014, price: 500, format: "CD", image: "/DALLIANCE.jpeg", songs: [] },
  { id: 2, title: "Emotion", artist: "Carly Rey Jepsen", genre: "Pop", year: 2015, price: 10, format: "CD", image: "/EMOTION.jpeg" },
  { id: 3, title: "SOS", artist: "SZA", genre: "Pop", year: 2022, price: 10, image: "/SOS.jpeg", songs: [] },
];

// Mock useAlbums to return mockAlbums
jest.mock('../../context/AlbumContext', () => ({
  useAlbums: jest.fn(),
}));

describe("Admin Page", () => {
  beforeEach(() => {
    useAlbums.mockReturnValue({ albums: mockAlbums });
  });

  test("renders album list", () => {
    render(<AdminPage />);
    expect(screen.getByText("recorDS")).toBeInTheDocument();
    expect(screen.getByText("Dalliance")).toBeInTheDocument();
    expect(screen.getByText("Emotion")).toBeInTheDocument();
    expect(screen.getByText("SOS")).toBeInTheDocument();
  });

  test("sorts albums A-Z", () => {
    render(<AdminPage />);
    const sortDropdown = screen.getByRole("combobox", { name: "Sort by" });

    fireEvent.change(sortDropdown, { target: { value: "title-asc" } });

    const albumTitles = screen.getAllByText(/(Dalliance|Emotion|SOS)/).map((e) => e.textContent);
    expect(albumTitles).toEqual(["Dalliance", "Emotion", "SOS"]);
  });

  test("sorts albums Z-A", () => {
    render(<AdminPage />);
    const sortDropdown = screen.getByRole("combobox", { name: "Sort by" });

    fireEvent.change(sortDropdown, { target: { value: "title-desc" } });

    const albumTitles = screen.getAllByText(/(Dalliance|Emotion|SOS)/).map((e) => e.textContent);
    expect(albumTitles).toEqual(["SOS", "Emotion", "Dalliance"]);
  });

  // test("sorts albums price asc", () => {
  //   render(<AdminPage />);
  //   const sortDropdown = screen.getByRole("combobox", { name: "Sort by" });

  //   fireEvent.change(sortDropdown, { target: { value: "price-asc" } });

  //   const albumTitles = screen.getAllByText(/(Dalliance|Emotion|SOS)/).map((e) => e.textContent);
  //   expect(albumTitles).toEqual(["Dalliance", "Emotion", "SOS"]);
  // });

  // test("sorts albums price desc", () => {
  //   render(<AdminPage />);
  //   const sortDropdown = screen.getByRole("combobox", { name: "Sort by" });

  //   fireEvent.change(sortDropdown, { target: { value: "price-desc" } });

  //   const albumTitles = screen.getAllByText(/(Dalliance|Emotion|SOS)/).map((e) => e.textContent);
  //   expect(albumTitles).toEqual(["SOS", "Emotion", "Dalliance"]);
  // });

  test("filters albums by genre", () => {
    render(<AdminPage />);
    const genreDropdown = screen.getByRole("combobox", { name: "Genre" });

    fireEvent.change(genreDropdown, { target: { value: "Pop" } });

    expect(screen.getByText("SOS")).toBeInTheDocument();
    expect(screen.queryByText("Dalliance")).toBeInTheDocument();
    expect(screen.queryByText("Emotion")).toBeInTheDocument();
  });

  test("filters albums by year", () => {
    render(<AdminPage />);
    const yearDropdown = screen.getByRole("combobox", { name: "Year" });

    fireEvent.change(yearDropdown, { target: { value: "2022" } });

    expect(screen.queryByText("Emotion")).not.toBeInTheDocument();
    expect(screen.queryByText("SOS")).toBeInTheDocument();
    expect(screen.queryByText("Dalliance")).not.toBeInTheDocument();
  });
});
