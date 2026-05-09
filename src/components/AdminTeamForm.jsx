import { useState, useEffect } from 'react';
import { validateEmail } from '../utils/validation';
import TeamPhotoUploader from './TeamPhotoUploader';

const AdminTeamForm = ({ team, categories, onSubmit, onCancel, loading }) => {
  const [error, setError] = useState('');
  
  const [categoryId, setCategoryId] = useState(team?.category_id || (categories?.[0]?.id || ''));
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    team_name: team?.team_name || '',
    campus: team?.campus || 'Sede Central',
    institution: team?.institution || 'UDEA',
    career: team?.career || '',
    semester: team?.semester || '',
    registration_code: team?.registration_code || '',
    leader_name: team?.leader_name || '',
    leader_email: team?.leader_email || '',
    leader_phone: team?.leader_phone || '',
    leader_student_id: team?.leader_student_id || '',
    status: team?.status || 'pending',
    accepted_terms: true // Admin force accepts
  });

  const [members, setMembers] = useState([]);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const cat = categories.find(c => c.id === categoryId);
      setSelectedCategory(cat);
      
      // Initialize members
      if (cat) {
        const memberCount = Math.max(0, (cat.max_members || 1) - 1);
        
        // If editing, map existing members
        if (team && team.category_id === categoryId && team.team_members) {
          const existingMembers = team.team_members.filter(m => m.role === 'member');
          const newMembers = Array(memberCount).fill({ full_name: '', email: '', student_id: '' });
          
          for(let i=0; i<Math.min(existingMembers.length, memberCount); i++) {
             newMembers[i] = {
                full_name: existingMembers[i].full_name || '',
                email: existingMembers[i].email || '',
                student_id: existingMembers[i].student_id || ''
             };
          }
          setMembers(newMembers);
        } else {
          // Empty slots
          const newMembers = Array(memberCount).fill({ full_name: '', email: '', student_id: '' });
          setMembers(newMembers);
        }
      }
    }
  }, [categoryId, categories, team]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberChange = (index, field, value) => {
    setMembers(prev => {
      const newMembers = [...prev];
      newMembers[index] = { ...newMembers[index], [field]: value };
      return newMembers;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!categoryId) {
      setError('Por favor selecciona una categoría.');
      return;
    }

    if (!validateEmail(formData.leader_email)) {
      setError('Correo del líder no válido.');
      return;
    }

    // Validate members
    const allEmails = [formData.leader_email];
    const allStudentIds = [formData.leader_student_id];
    
    for (const m of members) {
      if (m.full_name || m.email || m.student_id) {
         if (!m.full_name || !m.student_id) {
            setError('Todos los integrantes agregados deben tener nombre y matrícula.');
            return;
         }
         if (m.email && !validateEmail(m.email)) {
            setError(`El correo del integrante ${m.full_name} no es válido.`);
            return;
         }
         if (m.email) {
            if (allEmails.includes(m.email)) {
               setError(`El correo ${m.email} está duplicado en el equipo.`);
               return;
            }
            allEmails.push(m.email);
         }
         if (allStudentIds.includes(m.student_id)) {
            setError(`La matrícula ${m.student_id} está duplicada en el equipo.`);
            return;
         }
         allStudentIds.push(m.student_id);
      }
    }

    // Submit
    onSubmit({ ...formData, category_id: categoryId }, members, photo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* Categoria & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-semibold text-slate-700 mb-1.5">Categoría <span className="text-red-500">*</span></label>
           <select 
             value={categoryId} 
             onChange={(e) => setCategoryId(e.target.value)}
             className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none"
             required
           >
             {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
             ))}
           </select>
        </div>
        <div>
           <label className="block text-sm font-semibold text-slate-700 mb-1.5">Estado <span className="text-red-500">*</span></label>
           <select 
             name="status"
             value={formData.status} 
             onChange={handleInputChange}
             className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none"
           >
              <option value="pending">Pendiente</option>
              <option value="accepted">Aceptado</option>
              <option value="waitlist">Lista de Espera</option>
              <option value="rejected">Rechazado</option>
              <option value="cancelled">Cancelado</option>
           </select>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
         <h3 className="text-md font-bold text-slate-900 mb-4">Datos del Equipo</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre del Equipo <span className="text-red-500">*</span></label>
               <input type="text" name="team_name" required value={formData.team_name} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm" />
            </div>
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sede <span className="text-red-500">*</span></label>
               <input type="text" name="campus" required value={formData.campus} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm" />
            </div>
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1.5">Institución <span className="text-red-500">*</span></label>
               <input type="text" name="institution" required value={formData.institution} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm" />
            </div>
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1.5">Código de Inscripción</label>
               <input type="text" name="registration_code" value={formData.registration_code} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm" />
            </div>
         </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
         <h3 className="text-md font-bold text-slate-900 mb-4">Comprobante de Inscripción</h3>
         <TeamPhotoUploader 
            onPhotoChange={setPhoto} 
            currentPhotoUrl={team?.photo_url} 
         />
      </div>

      <div className="border-t border-slate-200 pt-4">
         <h3 className="text-md font-bold text-slate-900 mb-4">Líder del Equipo</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre Completo <span className="text-red-500">*</span></label>
               <input type="text" name="leader_name" required value={formData.leader_name} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm" />
            </div>
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1.5">Correo Electrónico <span className="text-red-500">*</span></label>
               <input type="email" name="leader_email" required value={formData.leader_email} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm" />
            </div>
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1.5">Matrícula <span className="text-red-500">*</span></label>
               <input type="text" name="leader_student_id" required value={formData.leader_student_id} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm" />
            </div>
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1.5">Teléfono</label>
               <input type="text" name="leader_phone" value={formData.leader_phone} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm" />
            </div>
         </div>
      </div>

      {members.length > 0 && (
         <div className="border-t border-slate-200 pt-4">
            <h3 className="text-md font-bold text-slate-900 mb-4">Integrantes Adicionales</h3>
            <div className="space-y-4">
               {members.map((member, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                     <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Integrante {idx + 2}</h4>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                           <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre</label>
                           <input type="text" value={member.full_name} onChange={(e) => handleMemberChange(idx, 'full_name', e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm" />
                        </div>
                        <div>
                           <label className="block text-xs font-semibold text-slate-700 mb-1">Correo</label>
                           <input type="email" value={member.email} onChange={(e) => handleMemberChange(idx, 'email', e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm" />
                        </div>
                        <div>
                           <label className="block text-xs font-semibold text-slate-700 mb-1">Matrícula</label>
                           <input type="text" value={member.student_id} onChange={(e) => handleMemberChange(idx, 'student_id', e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm" />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
         <button 
            type="button" 
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
         >
            Cancelar
         </button>
         <button 
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
         >
            {loading ? (
               <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Guardando...
               </>
            ) : 'Guardar Equipo'}
         </button>
      </div>
    </form>
  );
};

export default AdminTeamForm;
