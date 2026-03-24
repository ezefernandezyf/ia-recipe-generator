import AppRoutes from './AppRoutes';
import { Layout } from './components';
import type { ReactElement } from 'react';

type AppView = ReactElement;

const App = (): AppView => {
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
};

export default App;