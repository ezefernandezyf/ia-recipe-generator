import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RecipeGeneratorPage, RecipeGeneratorSmokeTestPage } from './features/recipe-generator/components';

type AppRoutesView = ReactElement;

const AppRoutes = (): AppRoutesView => {
  return (
    <Routes>
      <Route path="/" element={<RecipeGeneratorPage />} />
      <Route path="/debug/recipe-generator" element={<RecipeGeneratorSmokeTestPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
