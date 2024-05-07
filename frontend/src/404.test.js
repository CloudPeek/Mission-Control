import { render, screen } from '@testing-library/react';
import NotFound from './404';

test('renders 404 page correctly', () => {
  render(<NotFound />);
  
  // Assert that the page content is rendered correctly
  expect(screen.getByText(/404/i)).toBeInTheDocument();
  expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
  expect(screen.getByText(/Sorry, the feature isn't completed yet please come back later or help us by building it on github./i)).toBeInTheDocument();
  expect(screen.getByText(/Go back home/i)).toBeInTheDocument();
  expect(screen.getByText(/Github/i)).toBeInTheDocument();
});

test('renders correct links', () => {
  render(<NotFound />);
  
  // Assert that the links have the correct href values
  expect(screen.getByText(/Go back home/i).getAttribute('href')).toBe('');
  expect(screen.getByText(/Github/i).getAttribute('href')).toBe('https://github.com/CloudPeek/Mission-Control');
});