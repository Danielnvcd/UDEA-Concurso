import { useState } from 'react';
import StatusBadge from './StatusBadge';
import { Eye, Edit, Image as ImageIcon } from 'lucide-react';

const AdminTeamTable = ({ teams, onViewDetails, onChangeStatus }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Folio / Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Equipo / Categoría
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Líder
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {teams.map((team) => (
              <tr key={team.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono font-medium text-slate-900">{team.folio}</div>
                  <div className="text-xs text-slate-500">{new Date(team.created_at).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {team.photo_url && (
                      <ImageIcon className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                    )}
                    <div>
                      <div className="text-sm font-bold text-slate-900">{team.team_name}</div>
                      <div className="text-xs text-slate-500">{team.categories?.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-900 font-medium">{team.leader_name}</div>
                  <div className="text-xs text-slate-500">{team.leader_email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <StatusBadge status={team.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() => onViewDetails(team)}
                    className="text-blue-600 hover:text-blue-900 transition-colors inline-flex items-center"
                    title="Ver Detalles"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <select
                    value={team.status}
                    onChange={(e) => onChangeStatus(team.id, e.target.value)}
                    className="text-xs border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500 ml-2"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="accepted">Aceptado</option>
                    <option value="waitlist">Lista Espera</option>
                    <option value="rejected">Rechazado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
            {teams.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">
                  No se encontraron equipos con los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTeamTable;
