'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeIcon,
  UserIcon,
  TableCellsIcon,
  BellIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTablesOpen, setIsTablesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    const profileState = localStorage.getItem('isProfileOpen');
    const tablesState = localStorage.getItem('isTablesOpen');
    setIsProfileOpen(profileState === 'true');
    setIsTablesOpen(tablesState === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('isProfileOpen', isProfileOpen.toString());
  }, [isProfileOpen]);

  useEffect(() => {
    localStorage.setItem('isTablesOpen', isTablesOpen.toString());
  }, [isTablesOpen]);

  const isActive = (path: string) => pathname === path;
  const isPrefix = (prefix: string) => pathname?.startsWith(prefix);

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white border-r border-gray-800 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 md:z-0 md:block`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Mi Panel</h1>
          <button
            className="md:hidden p-2 text-white hover:bg-gray-700 rounded-lg"
            onClick={() => setIsSidebarOpen(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Usuario */}
        <div className="relative flex items-center p-4 mb-4 border-b border-gray-800">
          <img
            src="https://via.placeholder.com/40"
            alt="Perfil"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{user?.nombre || ''}</h2>
            <span className="text-sm text-gray-400">Administrador</span>
          </div>
          <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
            <ChevronDownIcon className={`w-5 h-5 transition ${isUserMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
          </button>
          {isUserMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-gray-800 shadow-lg rounded-lg z-10">
              <ul className="py-2">
                <li>
                  <Link href="#" className="block px-4 py-2 text-gray-200 hover:bg-gray-700">Ver perfil</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-gray-200 hover:bg-gray-700">Cerrar sesión</button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Navegación */}
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center space-x-4 p-2 rounded-lg transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <HomeIcon className="w-6 h-6" />
                <span>Inicio</span>
              </Link>
            </li>

            {/* Sección Perfil */}
            <li>
              <button
                className={`flex items-center justify-between w-full text-left p-2 rounded-lg transition-colors ${
                  isPrefix('/perfil')
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <span className="flex items-center space-x-4">
                  <UserIcon className="w-6 h-6" />
                  <span>Perfil</span>
                </span>
                <ChevronDownIcon className={`w-5 h-5 transition ${isProfileOpen ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              {isProfileOpen && (
                <ul className="ml-6 mt-2 space-y-1">
                  <li>
                    <Link href="/perfil/editar" className="text-sm text-gray-400 hover:text-white">Editar perfil</Link>
                  </li>
                  <li>
                    <Link href="/perfil/configuracion" className="text-sm text-gray-400 hover:text-white">Configuración</Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Sección Administración */}
            <li>
              <button
                className={`flex items-center justify-between w-full text-left p-2 rounded-lg transition-colors ${
                  isPrefix('/administracion')
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
                onClick={() => setIsTablesOpen(!isTablesOpen)}
              >
                <span className="flex items-center space-x-4">
                  <TableCellsIcon className="w-6 h-6" />
                  <span>Administración</span>
                </span>
                <ChevronDownIcon className={`w-5 h-5 transition ${isTablesOpen ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              {isTablesOpen && (
                <ul className="ml-6 mt-2 space-y-1">
                  <li><Link href="/administracion/productos" className="text-sm text-gray-400 hover:text-white">Productos</Link></li>
                  <li><Link href="/administracion/inventarios" className="text-sm text-gray-400 hover:text-white">Inventario</Link></li>
                  <li><Link href="/administracion/pedidos" className="text-sm text-gray-400 hover:text-white">Pedidos</Link></li>
                  <li><Link href="/administracion/categorias" className="text-sm text-gray-400 hover:text-white">Categorías</Link></li>
                  <li><Link href="/administracion/usuarios" className="text-sm text-gray-400 hover:text-white">Usuarios</Link></li>
                </ul>
              )}
            </li>

            <li>
              <Link
                href="/notificaciones"
                className={`flex items-center space-x-4 p-2 rounded-lg transition-colors ${
                  isActive('/notificaciones')
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <BellIcon className="w-6 h-6" />
                <span>Notificaciones</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
