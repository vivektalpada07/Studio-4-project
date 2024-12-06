import { render, screen } from '@testing-library/react';
import Header from './Header';

test('renders the header component', () => {
  render(<Header />);
  const headerElement = screen.getByText(/Studio 4/i);
  expect(headerElement).toBeInTheDocument();
});
