import { render, screen } from '@testing-library/react';
import App from './App';
if (typeof window.matchMedia === 'function') {
test('renders the app header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Rick Morty Characters/i);
  expect(linkElement).toBeInTheDocument();
});
}
