import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AppRoutes from './AppRoutes';

describe('AppRoutes', () => {
  it('renders the privacy page route', () => {
    render(
      <MemoryRouter initialEntries={['/privacy']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Política de privacidad' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver al generador' })).toHaveAttribute('href', '/');
  });
});