import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ConfigurationProvider, useConfigValue } from './contexts/ConfigurationContext';
import { CRMAuthProvider } from './contexts/CRMAuthContext';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import CRMLogin from './pages/CRMLogin';
import CRMPage from './pages/CRMPage';

function FontLoader() {
  const fontFamily = useConfigValue('font_family', 'Inter, system-ui, -apple-system, sans-serif');

  useEffect(() => {
    if (fontFamily) {
      const fontValue = String(fontFamily).replace(/^"|"$/g, '');
      document.documentElement.style.fontFamily = fontValue;
    }
  }, [fontFamily]);

  return null;
}

function App() {
  return (
    <LanguageProvider>
      <ConfigurationProvider>
        <CRMAuthProvider>
          <FontLoader />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/adminlogin" element={<AdminLogin />} />
              <Route path="/adminpanel" element={<AdminPanel />} />
              <Route path="/crm/login" element={<CRMLogin />} />
              <Route path="/crm" element={<CRMPage />} />
            </Routes>
          </BrowserRouter>
        </CRMAuthProvider>
      </ConfigurationProvider>
    </LanguageProvider>
  );
}

export default App;
