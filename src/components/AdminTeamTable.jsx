import StatusBadge from './StatusBadge';
import { Eye, Image as ImageIcon, Trash2, Pencil, ChevronDown, Inbox } from 'lucide-react';

const AdminTeamTable = ({ teams, onViewDetails, onEditTeam, onChangeStatus, selectedTeamIds = [], onToggleSelect, onToggleSelectAll, onDeleteTeam }) => {
  const allSelected = teams.length > 0 && selectedTeamIds.length === teams.length;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/80">
          <thead className="bg-gradient-to-b from-slate-50 to-slate-50/40">
            <tr>
              <th scope="col" className="px-6 py-3.5 text-left w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                Folio / Fecha
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                Equipo / Categoría
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                Líder
              </th>
              <th scope="col" className="px-6 py-3.5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                Estado
              </th>
              <th scope="col" className="px-6 py-3.5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {teams.map((team) => {
              const isPreviousYear = new Date(team.created_at).getFullYear() < new Date().getFullYear();
              const isSelected = selectedTeamIds.includes(team.id);

              let rowClass = "group transition-colors ";
              if (isSelected) {
                rowClass += "bg-blue-50/60 hover:bg-blue-50";
              } else if (isPreviousYear) {
                rowClass += "bg-rose-50/40 hover:bg-rose-50/70";
              } else {
                rowClass += "hover:bg-slate-50/70";
              }

              return (
                <tr key={team.id} className={rowClass}>
                  <td className="px-6 py-4 whitespace-nowrap w-12">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(team.id)}
                      className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-mono font-semibold ${isPreviousYear ? 'text-rose-700' : 'text-slate-900'}`}>{team.folio}</div>
                    <div className={`text-xs mt-0.5 ${isPreviousYear ? 'text-rose-500 font-semibold' : 'text-slate-500'}`}>{new Date(team.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      {team.photo_url ? (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isPreviousYear ? 'bg-rose-100 text-rose-500' : 'bg-blue-100 text-blue-600'}`}>
                          <ImageIcon className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                          <ImageIcon className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div>
                        <div className={`text-sm font-bold ${isPreviousYear ? 'text-rose-800' : 'text-slate-900'}`}>{team.team_name}</div>
                        <div className={`text-xs ${isPreviousYear ? 'text-rose-500' : 'text-slate-500'}`}>{team.categories?.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-medium ${isPreviousYear ? 'text-rose-700' : 'text-slate-900'}`}>{team.leader_name}</div>
                    <div className={`text-xs ${isPreviousYear ? 'text-rose-500' : 'text-slate-500'}`}>{team.leader_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={team.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewDetails(team)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Ver Detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditTeam(team)}
                        className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Editar Equipo"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTeam(team)}
                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Eliminar Equipo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="relative ml-1">
                        <select
                          value={team.status}
                          onChange={(e) => onChangeStatus(team.id, e.target.value)}
                          className="text-xs font-medium border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer hover:border-slate-300 transition-colors"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="accepted">Aceptado</option>
                          <option value="waitlist">Lista Espera</option>
                          <option value="rejected">Rechazado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                        <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
            {teams.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <Inbox className="h-7 w-7 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Sin resultados</p>
                      <p className="text-xs text-slate-500 mt-1">No se encontraron equipos con los filtros actuales.</p>
                    </div>
                  </div>
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
