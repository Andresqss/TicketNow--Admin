'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { format, parseISO } from 'date-fns';
import { getAllEventTypes, deleteEventType } from '@/services/event-types/api';
import { EventType } from '@/services/event-types/type';
import Pagination from '@/components/utils/Pagination';
import ErrorMessage from '@/components/utils/ErrorMessage';

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 10;

  useEffect(() => {
    const fetchEventTypes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllEventTypes();
        setEventTypes(data);
      } catch {
        setError('Error al cargar los tipos de evento.');
      } finally {
        setLoading(false);
      }
    };
    fetchEventTypes();
  }, []);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      theme : 'dark',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteEventType(id);
        setEventTypes(prev => prev.filter(et => et.event_type_id !== id));
        Swal.fire('Eliminado', 'El tipo de evento ha sido eliminado.', 'success');
      } catch {
        Swal.fire('Error', 'No se pudo eliminar el tipo de evento.', 'error');
      }
    }
  };

  const totalPages = Math.ceil(eventTypes.length / perPage);
  const paginated = eventTypes.slice(
    currentPage * perPage,
    (currentPage + 1) * perPage
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Tipos de Evento</h1>
        <Link
          href="/dashboard/event-types/new"
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Tipo
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <p className="text-gray-300">Cargando tipos de evento...</p>
      ) : eventTypes.length === 0 ? (
        <p className="text-gray-400">No se encontraron tipos de evento.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-gray-800 text-white">
              <thead className="bg-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Descripción</th>
                  <th className="px-4 py-2 text-left">Activo</th>
                  <th className="px-4 py-2 text-left">Fecha Creación</th>
                  <th className="px-4 py-2 text-left">Última Actualización</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((et) => (
                  <tr
                    key={et.event_type_id}
                    className="border-b border-gray-600 hover:bg-gray-700"
                  >
                    <td className="px-4 py-2">{et.type_name}</td>
                    <td className="px-4 py-2">{et.description}</td>
                    <td className="px-4 py-2">{et.is_active ? 'Sí' : 'No'}</td>
                    <td className="px-4 py-2">
                    {et.created_at ? format(parseISO(et.created_at), 'dd/MM/yyyy HH:mm:ss') : ''}
                    </td>
                    <td className="px-4 py-2">
                    {et.updated_at ? format(parseISO(et.updated_at), 'dd/MM/yyyy HH:mm:ss') : ''}
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/dashboard/event-types/edit?eventTypeId=${et.event_type_id}`}
                        className="text-blue-400 hover:underline mr-3"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(et.event_type_id)}
                        className="text-red-400 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </div>
  );
}
