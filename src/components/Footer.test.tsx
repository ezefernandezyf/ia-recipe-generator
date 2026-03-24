import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('links to privacy and the GitHub repository', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Privacidad' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/ezefernandezyf/ia-recipe-generator');
  });
});