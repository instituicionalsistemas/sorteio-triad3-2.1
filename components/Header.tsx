import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ThemeToggle } from './ThemeToggle';

const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300";
const activeLinkClasses = "bg-light-primary text-white dark:bg-dark-primary dark:text-white";
const inactiveLinkClasses = "text-light-text dark:text-dark-text hover:bg-light-card dark:hover:bg-dark-card";

export const Header: React.FC = () => {
    const { logout, loggedInOrganizer } = useData();

  return (
    <header className="bg-light-background dark:bg-dark-background border-b border-light-border dark:border-dark-border sticky top-0 z-10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary">SorteAI Triad3</h1>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Dashboard</NavLink>
                <NavLink to="/gerenciar" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Gerenciar</NavLink>
                <NavLink to="/cadastro" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Cadastro</NavLink>
                <NavLink to="/painel" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Painel</NavLink>
                <NavLink to="/historico" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Histórico</NavLink>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-sm hidden sm:block">Olá, {loggedInOrganizer?.name.split(' ')[0]} ({loggedInOrganizer?.organizerCode})</span>
             <button onClick={logout} className={`${inactiveLinkClasses} ${navLinkClasses}`}>Sair</button>
             <ThemeToggle />
          </div>
        </div>
      </nav>
       <div className="md:hidden border-t border-light-border dark:border-dark-border">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex justify-around">
                <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Dashboard</NavLink>
                <NavLink to="/gerenciar" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Gerenciar</NavLink>
                <NavLink to="/cadastro" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Cadastro</NavLink>
                <NavLink to="/painel" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Painel</NavLink>
                <NavLink to="/historico" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Histórico</NavLink>
            </div>
        </div>
    </header>
  );
};