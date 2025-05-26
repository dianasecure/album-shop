import React from 'react';
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../../app/page";

describe('Main Component', () => {
  test('renders the user page with correct content', () => {
    render(<Home />);

    // Check if the elements are in the document
    expect(screen.getByText("recorDS")).toBeInTheDocument();
    expect(screen.getByText("For the love of music")).toBeInTheDocument();
    expect(screen.getByText("🎵")).toBeInTheDocument();
    expect(screen.getByText("Go to user's page")).toBeInTheDocument();
    expect(screen.getByText("Go to admin's page")).toBeInTheDocument();
  });
});