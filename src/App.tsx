import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import MenuPage from '@/pages/MenuPage';
import SplashScreen from '@/components/features/SplashScreen';
import { CartProvider } from '@/stores/cartStore';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashComplete = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setSplashDone(true);
  };

  return (
    <CartProvider>
      <Toaster position="top-center" />
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="*" element={<MenuPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}