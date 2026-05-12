import { Search, Filter, Download, ChevronDown } from 'lucide-react';

const AdminFilters = ({ filters, onFilterChange, categories, onExport }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 mb-6">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Búsqueda general */}
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Buscar por equipo, líder, correo, folio..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Filtros Dropdowns */}
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-slate-400" />
            </div>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer transition-all font-medium"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="accepted">Aceptados</option>
              <option value="waitlist">Lista de Espera</option>
              <option value="rejected">Rechazados</option>
              <option value="cancelled">Cancelados</option>
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-slate-400" />
            </div>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer transition-all font-medium"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-sm font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Exportar CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFilters;
