import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutUs from '../components/AboutUs';

// Mock the useUserAuth hook
jest.mock('../context/UserAuthContext', () => ({
  useUserAuth: () => ({
    role: 'customer', // Mock role
  }),
}));

describe('AboutUs Component', () => {
  it('renders the About Us title', () => {
    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );
    // Use a more specific query, like finding the `h3` heading
    const titleElement = screen.getByRole('heading', { name: /About Us/i });
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the Discover our Eco Shop section', () => {
    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );
    const subheadingElement = screen.getByText(/Discover our Eco Shop/i);
    expect(subheadingElement).toBeInTheDocument();
  });

  it('renders the description text', () => {
    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );
    const descriptionElement = screen.getByText(/The Eco Shop is a second-hand deal platform/i);
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders the Footer component', () => {
    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );
    const footerElement = screen.getByText(/Copyright © 2024 Eco Shop/i);
    expect(footerElement).toBeInTheDocument();
  });
});
