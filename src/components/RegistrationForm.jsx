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
            .upload(filePath, photo);

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
      <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center"><span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span> Selecciona tu Categoría</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <label
              key={cat.category_id}
              className={`relative flex cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 ${
                categoryId === cat.category_id 
                  ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-600/10' 
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
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
                  <span className={`block text-base font-black ${categoryId === cat.category_id ? 'text-blue-900' : 'text-slate-900'}`}>{cat.name}</span>
                  <span className="mt-2 inline-flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 bg-white/60 px-2.5 py-1 rounded-md border border-slate-200/60 w-fit">
                    Max: {cat.max_members} integrantes
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
          <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center"><span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span> Datos del Equipo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre del Equipo <span className="text-red-500">*</span></label>
                <input type="text" name="team_name" required value={formData.team_name} onChange={handleInputChange} className="w-full rounded-xl bg-slate-50 border-0 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:bg-white px-4 py-3.5 text-slate-900 font-medium transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Código de Inscripción <span className="text-red-500">*</span></label>
                <input type="text" name="registration_code" required value={formData.registration_code} onChange={handleInputChange} className="w-full rounded-xl bg-slate-50 border-0 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:bg-white px-4 py-3.5 text-slate-900 font-medium transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sede <span className="text-red-500">*</span></label>
                <input type="text" name="campus" required value={formData.campus} onChange={handleInputChange} className="w-full rounded-xl bg-slate-50 border-0 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:bg-white px-4 py-3.5 text-slate-900 font-medium transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Institución <span className="text-red-500">*</span></label>
                <input type="text" name="institution" required value={formData.institution} onChange={handleInputChange} className="w-full rounded-xl bg-slate-50 border-0 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:bg-white px-4 py-3.5 text-slate-900 font-medium transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Carrera</label>
                <input type="text" name="career" value={formData.career} onChange={handleInputChange} className="w-full rounded-xl bg-slate-50 border-0 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:bg-white px-4 py-3.5 text-slate-900 font-medium transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Semestre</label>
                <input type="text" name="semester" value={formData.semester} onChange={handleInputChange} className="w-full rounded-xl bg-slate-50 border-0 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:bg-white px-4 py-3.5 text-slate-900 font-medium transition-all" />
              </div>
            </div>
            <div className="mt-6">
                <TeamPhotoUploader onPhotoSelect={setPhoto} />
            </div>
          </div>

          {/* Líder */}
          <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center"><span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span> Datos del Líder</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre Completo <span className="text-red-500">*</span></label>
                <input type="text" name="leader_name" required value={formData.leader_name} onChange={handleInputChange} className="w-full rounded-xl bg-slate-50 border-0 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:bg-white px-4 py-3.5 text-slate-900 font-medium transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Correo Electrónico <span className="text-red-500">*</span></label>
                <input type="email" name="leader_email" required value={formData.leader_email} onChange={handleInputChange} className="w-full rounded-xl bg-slate-50 border-0 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:bg-white px-4 py-3.5 text-slate-900 font-medium transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Matrícula / ID <span className="text-red-500">*</span></label>
                <input type="text" name="leader_student_id" required value={formData.leader_student_id} onChange={handleInputChange} className="w-full rounded-xl bg-slate-50 border-0 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:bg-white px-4 py-3.5 text-slate-900 font-medium transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Teléfono</label>
                <input type="tel" name="leader_phone" value={formData.leader_phone} onChange={handleInputChange} className="w-full rounded-xl bg-slate-50 border-0 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:bg-white px-4 py-3.5 text-slate-900 font-medium transition-all" />
              </div>
            </div>
          </div>

          {/* Integrantes Adicionales */}
          {members.length > 0 && (
             <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
                <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center"><span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span> Integrantes Adicionales</h3>
                <p className="text-sm font-medium text-slate-500 mb-8 pl-11">Llena los datos de los demás miembros de tu equipo. (Deja en blanco si tu equipo tiene menos del máximo permitido).</p>
                <div className="space-y-6">
                   {members.map((member, idx) => (
                      <div key={idx} className="p-6 border border-slate-200/60 rounded-2xl bg-slate-50/50">
                         <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Integrante {idx + 2}</h4>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre Completo</label>
                               <input type="text" value={member.full_name} onChange={(e) => handleMemberChange(idx, 'full_name', e.target.value)} className="w-full rounded-xl bg-white border-0 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 px-4 py-3 text-slate-900 font-medium transition-all" />
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Correo</label>
                               <input type="email" value={member.email} onChange={(e) => handleMemberChange(idx, 'email', e.target.value)} className="w-full rounded-xl bg-white border-0 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 px-4 py-3 text-slate-900 font-medium transition-all" />
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Matrícula</label>
                               <input type="text" value={member.student_id} onChange={(e) => handleMemberChange(idx, 'student_id', e.target.value)} className="w-full rounded-xl bg-white border-0 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 px-4 py-3 text-slate-900 font-medium transition-all" />
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* Términos */}
          <div className="bg-slate-200/50 p-6 sm:p-8 rounded-[2rem] border border-slate-200">
             <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative flex items-center">
                   <input type="checkbox" name="accepted_terms" checked={formData.accepted_terms} onChange={handleInputChange} className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border-2 border-slate-300 transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-500 focus:ring-4 focus:ring-blue-600/20 outline-none" />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                   </div>
                </div>
                <span className="text-sm font-medium text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                   He leído y acepto el reglamento del concurso, y autorizo el tratamiento de mis datos personales para los fines propios del evento.
                </span>
             </label>
          </div>

          <button
             type="submit"
             disabled={loading}
             className="w-full bg-slate-900 text-white font-black text-lg py-5 px-4 rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-slate-900/10 hover:shadow-blue-600/30 hover:-translate-y-1"
          >
             {loading ? 'Enviando Registro...' : 'Completar Inscripción Oficial'}
          </button>
        </>
      )}
    </form>
  );
};

export default RegistrationForm;
