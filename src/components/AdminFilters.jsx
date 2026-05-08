import { Search, Filter, Download } from 'lucide-react';

const AdminFilters = ({ filters, onFilterChange, categories, onExport }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Búsqueda general */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por equipo, líder, correo, folio..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Filtros Dropdowns */}
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-slate-400" />
            </div>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="block w-full pl-10 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="accepted">Aceptados</option>
              <option value="waitlist">Lista de Espera</option>
              <option value="rejected">Rechazados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>

          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-slate-400" />
            </div>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="block w-full pl-10 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={onExport}
            className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Download className="h-4 w-4 mr-2 text-slate-500" />
            Exportar CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFilters;
