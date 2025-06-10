'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import ErrorMessage from "@/components/utils/ErroMessage"; // Asegúrate que esté en /components
import { login } from "@/lib/auth"; // Asegúrate que esté en /services

export default function LoginPage() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ nombreUsuario?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    const newErrors: { nombreUsuario?: string; password?: string } = {};
    if (!nombreUsuario) {
      newErrors.nombreUsuario = "El nombre de usuario es obligatorio.";
    }
    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const { access_token } = await login(nombreUsuario, password); // asegúrate de que el login devuelva esto
        localStorage.setItem('access_token', access_token);
        router.push("/dashboard");
      } catch (error: unknown) {
        setErrors({ general: error instanceof Error ? error.message : "Ocurrió un error inesperado." });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6">
      <div className="bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">TICKET NOW</h1>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Bienvenido</h2>
        <p className="text-center text-gray-600 mb-8">Inicia sesión para continuar</p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Nombre de Usuario</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mt-1">
              <UserIcon className="w-5 h-5 text-gray-500 ml-3 mr-3" />
              <input
                type="text"
                className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-gray-700 text-black"
                placeholder="Nombre de usuario"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
              />
            </div>
            {errors.nombreUsuario && <ErrorMessage message={errors.nombreUsuario} />}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mt-1">
              <LockClosedIcon className="w-5 h-5 text-gray-500 ml-3 mr-3" />
              <input
                type="password"
                className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-gray-700 text-black"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && <ErrorMessage message={errors.password} />}
          </div>
          {errors.general && <ErrorMessage message={errors.general} />}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-semibold py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-transform transform hover:scale-105 focus:ring-2 focus:ring-gray-700"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
