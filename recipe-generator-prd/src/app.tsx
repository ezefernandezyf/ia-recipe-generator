import AppRoutes from './AppRoutes';
import type { ReactElement } from 'react';

type AppView = ReactElement;

const App = (): AppView => {
  return <AppRoutes />;
};

export default App;