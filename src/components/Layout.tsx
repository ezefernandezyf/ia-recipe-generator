import type { ReactElement, ReactNode } from 'react';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
};

type LayoutView = ReactElement;

const Layout = ({ children }: LayoutProps): LayoutView => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;