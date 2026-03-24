import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

type FooterView = ReactElement;

const repositoryUrl = 'https://github.com/ezefernandezyf/ia-recipe-generator';

const GitHubIcon = (): ReactElement => {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M12 .5C5.73.5.75 5.63.75 12.08c0 5.16 3.29 9.54 7.86 11.09.58.11.79-.26.79-.57v-2.03c-3.2.72-3.88-1.58-3.88-1.58-.52-1.36-1.28-1.72-1.28-1.72-1.05-.75.08-.74.08-.74 1.16.08 1.77 1.23 1.77 1.23 1.03 1.82 2.72 1.29 3.38.99.1-.76.4-1.29.72-1.59-2.56-.3-5.25-1.31-5.25-5.84 0-1.29.45-2.34 1.19-3.16-.12-.3-.51-1.48.11-3.09 0 0 .97-.32 3.18 1.21a10.4 10.4 0 0 1 5.79 0c2.21-1.53 3.18-1.21 3.18-1.21.62 1.61.23 2.79.11 3.09.74.82 1.19 1.87 1.19 3.16 0 4.54-2.7 5.54-5.27 5.83.41.36.77 1.07.77 2.16v3.2c0 .32.2.69.8.57 4.56-1.55 7.85-5.93 7.85-11.09C23.25 5.63 18.27.5 12 .5Z" />
    </svg>
  );
};

const Footer = (): FooterView => {
  return (
    <footer className="border-t border-stone-200 bg-stone-950/95 px-4 py-6 text-stone-100 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-tight">IA Recipe Generator</p>
          <p className="max-w-2xl text-sm leading-6 text-stone-300">Generador de recetas con IA para combinar ingredientes, ajustar porciones y revisar el resultado en una sola pantalla.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium md:ml-auto md:justify-end">
          <Link className="transition hover:text-white" to="/privacy">
            Privacidad
          </Link>
          <a className="inline-flex items-center gap-2 transition hover:text-white" href={repositoryUrl} target="_blank" rel="noreferrer">
            <GitHubIcon />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;