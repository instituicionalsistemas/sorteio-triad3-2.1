
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
import { Cadastro } from './pages/Cadastro';
import { Painel } from './pages/Painel';
import { Historico } from './pages/Historico';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { GerenciarSorteios } from './pages/GerenciarSorteios';
import { Participar } from './pages/Participar';

const AppContent: React.FC = () => {
  const { loggedInOrganizer } = useData();

  return (
      <HashRouter>
        <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text min-h-screen font-sans transition-colors duration-300 flex flex-col">
          {loggedInOrganizer ? (
            <>
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/gerenciar" element={<GerenciarSorteios />} />
                  <Route path="/cadastro" element={<Cadastro />} />
                  <Route path="/painel" element={<Painel />} />
                  <Route path="/historico" element={<Historico />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </>
          ) : (
            <main className="flex-grow">
              <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/participar" element={<Participar />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </main>
          )}
          <Footer />
        </div>
      </HashRouter>
  );
};

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;