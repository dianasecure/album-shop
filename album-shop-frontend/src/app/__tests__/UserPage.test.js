import React from 'react';
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import UserPage from "../../app/user/page";

describe('Main Component', () => {
  test('renders the user page with correct content', () => {
    render(<UserPage />);

    // Check if the elements are in the document
    expect(screen.getByText('User page')).toBeInTheDocument();
    expect(screen.getByText('^^')).toBeInTheDocument();
  });
});
