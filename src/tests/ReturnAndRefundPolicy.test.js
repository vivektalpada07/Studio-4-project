import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ReturnAndRefundPolicy from '../components/ReturnRefundPolicy';

// Mocking UserAuthContext
jest.mock('../context/UserAuthContext', () => ({
  useUserAuth: () => ({
    role: 'customer', // Mock role as needed for your tests
  }),
}));

// Mocking Footer and HeaderSwitcher components
jest.mock('../components/Footer', () => () => <div>Mock Footer</div>);
jest.mock('../components/HeaderSwitcher', () => () => <div>Mock HeaderSwitcher</div>);

describe('ReturnAndRefundPolicy Component', () => {
  it('renders the title correctly', () => {
    render(
      <BrowserRouter>
        <ReturnAndRefundPolicy />
      </BrowserRouter>
    );

    // Check if the title is rendered
    expect(screen.getByText(/Return & Refund Policy/i)).toBeInTheDocument();
  });

  it('renders the returns section', () => {
    render(
      <BrowserRouter>
        <ReturnAndRefundPolicy />
      </BrowserRouter>
    );

    // Check if the Returns section header is rendered
    expect(screen.getByText(/Returns/i)).toBeInTheDocument();
  });

  it('renders the refunds section', () => {
    render(
      <BrowserRouter>
        <ReturnAndRefundPolicy />
      </BrowserRouter>
    );

    // Check if the Refunds section header is rendered
    expect(screen.getByText(/Refunds/i)).toBeInTheDocument();
  });

  it('renders the footer component', () => {
    render(
      <BrowserRouter>
        <ReturnAndRefundPolicy />
      </BrowserRouter>
    );

    // Check if the mocked footer is rendered
    expect(screen.getByText(/Mock Footer/i)).toBeInTheDocument();
  });
});
