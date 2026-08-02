import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuPage from '@/pages/MenuPage';
import SplashScreen from '@/components/features/SplashScreen';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="*" element={<MenuPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}