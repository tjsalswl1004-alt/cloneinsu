import { render, screen } from '@testing-library/react';
import App from './App';

test('renders cloneinsu text', () => {
  render(<App />);
  const textElement = screen.getByText(/cloneinsu/i);
  expect(textElement).toBeInTheDocument();
});
