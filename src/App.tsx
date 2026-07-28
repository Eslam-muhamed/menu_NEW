import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuPage from '@/pages/MenuPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="*" element={<MenuPage />} />
      </Routes>
    </BrowserRouter>
  );
}
