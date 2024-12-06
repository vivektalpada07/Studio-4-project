import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock Context Providers to isolate the test
jest.mock('../context/UserAuthContext', () => ({
  UserAuthContextProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('../context/Productcontext', () => ({
  ProductContextProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('../context/Cartcontext', () => ({
  CartContextProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('../context/Wishlistcontext', () => ({
  WishlistContextProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('../context/ReviewContext', () => ({
  ReviewProvider: ({ children }) => <div>{children}</div>,
}));

// Mock components to avoid dependency-related issues
jest.mock('../components/Home', () => () => <div>Mocked Home Component</div>);
jest.mock('../components/Login', () => () => <div>Mocked Login Component</div>);

describe('App Component', () => {
  test('renders the application without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Assert that the Home page or some main route renders
    const homeText = screen.getByText(/Mocked Home Component/i);
    expect(homeText).toBeInTheDocument();
  });
});
