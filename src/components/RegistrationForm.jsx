import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { validateEmail } from '../utils/validation';
import TeamPhotoUploader from './TeamPhotoUploader';

const RegistrationForm = ({ categories, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [categoryId, setCategoryId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    team_name: '',
    campus: 'Sede Central',
    institution: 'UDEA',
    career: '',
    semester: '',
    registration_code: '',
    leader_name: '',
    leader_email: '',
    leader_phone: '',
    leader_student_id: '',
    accepted_terms: false
  });

  const [members, setMembers] = useState([]);
  const [photo, setPhoto] = useState(null);

  // Honeypot
  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (categoryId) {
      const cat = categories.find(c => c.category_id === categoryId);
      setSelectedCategory(cat);
      // Reset members when category changes, keeping only empty slots for max_members - 1 (since leader is 1)
      if (cat) {
        const memberCount = cat.max_members - 1;
        const newMembers = Array(memberCount).fill({ full_name: '', email: '', student_id: '' });
        setMembers(newMembers);
      }
    } else {
      setSelectedCategory(null);
      setMembers([]);
    }
  }, [categoryId, categories]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    // Honeypot check
    if (website !== '') {
      setError('Error de validación.');
      return;
    }

    if (!selectedCategory) {
      setError('Por favor selecciona una categoría.');
      return;
    }

    if (!formData.accepted_terms) {
      setError('Debes aceptar el reglamento.');
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
             setError(`Correo no válido para el integrante: ${m.full_name}`);
             return;
         }
         if (m.email) allEmails.push(m.email);
         allStudentIds.push(m.student_id);
      }
    }

    // Check duplicates in form
    const uniqueEmails = new Set(allEmails.filter(e => e));
    if (uniqueEmails.size !== allEmails.filter(e => e).length) {
       setError('Hay correos duplicados entre los integrantes.');
       return;
    }

    const uniqueStudentIds = new Set(allStudentIds);
    if (uniqueStudentIds.size !== allStudentIds.length) {
       setError('Hay matrículas duplicadas entre los integrantes.');
       return;
    }

    setLoading(true);

    try {
      // 1. Validate Code
      const { data: codeData, error: codeError } = await supabase.rpc('validate_registration_code', {
        input_code: formData.registration_code,
        input_category_id: categoryId
      });

      if (codeError) throw codeError;
      if (!codeData.valid) {
         setError(codeData.message);
         setLoading(false);
         return;
      }

      // 2. Generate Folio
      const { data: folio, error: folioError } = await supabase.rpc('generate_folio', {
        category_slug: selectedCategory.slug
      });
      if (folioError) throw folioError;

      // 3. Upload Photo (if any)
      let photoUrl = null;
      let photoPath = null;
      if (photo) {
         const fileExt = photo.name.split('.').pop();
         const fileName = `team-photo.${fileExt}`;
         const filePath = `${folio}/${fileName}`;

         const { error: uploadError, data: uploadData } = await supabase.storage
            .from('team-photos')
            .upload(filePath, photo, { upsert: true });

         if (uploadError) throw uploadError;
         
         photoPath = uploadData.path;
         const { data: publicUrlData } = supabase.storage
            .from('team-photos')
            .getPublicUrl(filePath);
         
         photoUrl = publicUrlData.publicUrl;
      }

      // 4. Insert Team (Generate ID locally to avoid RLS Select restrictions)
      const teamId = crypto.randomUUID();
      const { error: teamError } = await supabase
        .from('teams')
        .insert({
          id: teamId,
          folio,
          team_name: formData.team_name,
          category_id: categoryId,
          campus: formData.campus,
          institution: formData.institution,
          career: formData.career,
          semester: formData.semester,
          leader_name: formData.leader_name,
          leader_email: formData.leader_email,
          leader_phone: formData.leader_phone,
          leader_student_id: formData.leader_student_id,
          registration_code: formData.registration_code,
          accepted_terms: formData.accepted_terms,
          photo_url: photoUrl,
          photo_path: photoPath,
          status: 'pending'
        });

      if (teamError) {
         if (teamError.code === '23505') {
             setError('Ya existe un registro con este correo o matrícula.');
         } else {
             throw teamError;
         }
         setLoading(false);
         return;
      }

      // 5. Insert Members (Leader + others)
      const teamMembersToInsert = [
         {
            team_id: teamId,
            full_name: formData.leader_name,
            email: formData.leader_email,
            student_id: formData.leader_student_id,
            role: 'leader'
         }
      ];

      for (const m of members) {
         if (m.full_name && m.student_id) {
             teamMembersToInsert.push({
                 team_id: teamId,
                 full_name: m.full_name,
                 email: m.email || null,
                 student_id: m.student_id,
                 role: 'member'
             });
         }
      }

      const { error: membersError } = await supabase
        .from('team_members')
        .insert(teamMembersToInsert);

      if (membersError) throw membersError;

      // Success
      onSuccess({ id: teamId, folio, ...formData });

    } catch (err) {
      console.error('Registration error:', err);
      setError('Ocurrió un error al procesar tu registro. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Honeypot */}
      <input type="url" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" tabIndex="-1" autoComplete="off" />

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* Categoria */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-5 pb-4 border-b border-slate-100">Selecciona tu Categoría</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <label
              key={cat.category_id}
              className={`relative flex cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                categoryId === cat.category_id 
                  ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="category_id"
                value={cat.category_id}
                className="sr-only"
                onChange={(e) => setCategoryId(e.target.value)}
              />
              <span className="flex flex-1">
                <span className="flex flex-col">
                  <span className={`block text-sm font-semibold ${categoryId === cat.category_id ? 'text-blue-900' : 'text-slate-900'}`}>{cat.name}</span>
                  <span className="mt-1 block text-sm text-slate-500">
                    Máximo: {cat.max_members} integrantes
                  </span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {categoryId && (
        <>
          {/* Datos del Equipo */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-5 pb-4 border-b border-slate-100">Datos del Equipo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre del Equipo <span className="text-red-500">*</span></label>
                <input type="text" name="team_name" required value={formData.team_name} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Código de Inscripción <span className="text-red-500">*</span></label>
                <input type="text" name="registration_code" required value={formData.registration_code} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sede <span className="text-red-500">*</span></label>
                <input type="text" name="campus" required value={formData.campus} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Institución <span className="text-red-500">*</span></label>
                <input type="text" name="institution" required value={formData.institution} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Carrera</label>
                <input type="text" name="career" value={formData.career} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Semestre</label>
                <input type="text" name="semester" value={formData.semester} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>
            </div>
            <div className="mt-8 border-t border-slate-100 pt-6">
                <TeamPhotoUploader onPhotoSelect={setPhoto} />
            </div>
          </div>

          {/* Líder */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-5 pb-4 border-b border-slate-100">Datos del Líder</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre Completo <span className="text-red-500">*</span></label>
                <input type="text" name="leader_name" required value={formData.leader_name} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Correo Electrónico <span className="text-red-500">*</span></label>
                <input type="email" name="leader_email" required value={formData.leader_email} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Matrícula / ID <span className="text-red-500">*</span></label>
                <input type="text" name="leader_student_id" required value={formData.leader_student_id} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Teléfono</label>
                <input type="tel" name="leader_phone" value={formData.leader_phone} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Integrantes Adicionales */}
          {members.length > 0 && (
             <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Integrantes Adicionales</h3>
                <p className="text-sm text-slate-500 mb-6">Llena los datos de los demás miembros de tu equipo. (Deja en blanco si tu equipo tiene menos del máximo permitido).</p>
                <div className="space-y-6">
                   {members.map((member, idx) => (
                      <div key={idx} className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                         <h4 className="text-sm font-bold text-slate-700 mb-4 border-b border-slate-200 pb-2">Integrante {idx + 2}</h4>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                               <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre Completo</label>
                               <input type="text" value={member.full_name} onChange={(e) => handleMemberChange(idx, 'full_name', e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
                            </div>
                            <div>
                               <label className="block text-sm font-semibold text-slate-700 mb-1.5">Correo</label>
                               <input type="email" value={member.email} onChange={(e) => handleMemberChange(idx, 'email', e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
                            </div>
                            <div>
                               <label className="block text-sm font-semibold text-slate-700 mb-1.5">Matrícula</label>
                               <input type="text" value={member.student_id} onChange={(e) => handleMemberChange(idx, 'student_id', e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* Términos */}
          <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
             <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center mt-0.5">
                   <input type="checkbox" name="accepted_terms" checked={formData.accepted_terms} onChange={handleInputChange} className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 bg-white transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-500 focus:ring-2 focus:ring-blue-600/20 outline-none" />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                   </div>
                </div>
                <span className="text-sm text-slate-600 leading-relaxed">
                   He leído y acepto el reglamento del concurso, y autorizo el tratamiento de mis datos personales para los fines propios del evento.
                </span>
             </label>
          </div>

          <button
             type="submit"
             disabled={loading}
             className="w-full bg-blue-600 text-white font-semibold text-base py-3 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
             {loading ? 'Enviando Registro...' : 'Completar Inscripción'}
          </button>
        </>
      )}
    </form>
  );
};

export default RegistrationForm;
