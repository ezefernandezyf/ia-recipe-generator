import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RecipeGeneratorPage } from './features/recipe-generator/components';
import PrivacyPage from './features/privacy-page/PrivacyPage';

type AppRoutesView = ReactElement;

const AppRoutes = (): AppRoutesView => {
  return (
    <Routes>
      <Route path="/" element={<RecipeGeneratorPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
