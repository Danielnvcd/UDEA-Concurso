import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { validateEmail } from '../utils/validation';
import TeamPhotoUploader from './TeamPhotoUploader';

const serif = { fontFamily: "'Instrument Serif', serif" };

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base sm:text-sm text-white placeholder-white/30 shadow-none focus:border-white/30 focus:outline-none focus:ring-0 transition-colors min-h-[44px]';

const labelClass = 'block text-[11px] font-medium text-white/65 uppercase tracking-[0.18em] mb-1.5';

const sectionClass = 'liquid-glass rounded-2xl p-5 sm:p-8';

const RegistrationForm = ({ categories, onSuccess, userEmail, requireRegistrationCode = true }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    leader_email: userEmail || '',
    leader_phone: '',
    leader_student_id: '',
    accepted_terms: false
  });

  const [members, setMembers] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (categoryId) {
      const cat = categories.find(c => c.category_id === categoryId);
      setSelectedCategory(cat);
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

    if (website !== '') { setError('Error de validación.'); return; }
    if (!selectedCategory) { setError('Por favor selecciona una categoría.'); return; }
    if (!formData.accepted_terms) { setError('Debes aceptar el reglamento.'); return; }
    if (!validateEmail(formData.leader_email)) { setError('Correo del líder no válido.'); return; }

    const allEmails = [formData.leader_email];
    const allStudentIds = [formData.leader_student_id];

    for (const m of members) {
      if (m.full_name || m.email || m.student_id) {
        if (!m.full_name || !m.student_id) { setError('Todos los integrantes agregados deben tener nombre y matrícula.'); return; }
        if (m.email && !validateEmail(m.email)) { setError(`Correo no válido para el integrante: ${m.full_name}`); return; }
        if (m.email) allEmails.push(m.email);
        allStudentIds.push(m.student_id);
      }
    }

    const uniqueEmails = new Set(allEmails.filter(e => e));
    if (uniqueEmails.size !== allEmails.filter(e => e).length) { setError('Hay correos duplicados entre los integrantes.'); return; }

    const uniqueStudentIds = new Set(allStudentIds);
    if (uniqueStudentIds.size !== allStudentIds.length) { setError('Hay matrículas duplicadas entre los integrantes.'); return; }

    setLoading(true);

    try {
      if (requireRegistrationCode || formData.registration_code) {
        const { data: codeData, error: codeError } = await supabase.rpc('validate_registration_code', {
          input_code: formData.registration_code,
          input_category_id: categoryId
        });
        if (codeError) throw codeError;
        if (!codeData.valid) { setError(codeData.message); setLoading(false); return; }
      }

      const { data: folio, error: folioError } = await supabase.rpc('generate_folio', {
        category_slug: selectedCategory.slug
      });
      if (folioError) throw folioError;

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
        const { data: publicUrlData } = supabase.storage.from('team-photos').getPublicUrl(filePath);
        photoUrl = publicUrlData.publicUrl;
      }

      const teamId = crypto.randomUUID();
      const { error: teamError } = await supabase.from('teams').insert({
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
        if (teamError.code === '23505') { setError('Ya existe un registro con este correo o matrícula.'); }
        else { throw teamError; }
        setLoading(false);
        return;
      }

      const teamMembersToInsert = [{
        team_id: teamId,
        full_name: formData.leader_name,
        email: formData.leader_email,
        student_id: formData.leader_student_id,
        role: 'leader'
      }];

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

      const { error: membersError } = await supabase.from('team_members').insert(teamMembersToInsert);
      if (membersError) throw membersError;

      onSuccess({ id: teamId, folio, ...formData });

    } catch (err) {
      console.error('Registration error:', err);
      setError('Ocurrió un error al procesar tu registro. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      <input type="url" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" tabIndex="-1" autoComplete="off" />

      {error && (
        <div className="liquid-glass rounded-2xl px-4 py-3 text-sm text-white/90">
          {error}
        </div>
      )}

      {/* Categoría */}
      <div className={sectionClass}>
        <h3 className="text-xl text-white mb-4 sm:mb-5" style={serif}>Selecciona tu categoría</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <label
              key={cat.category_id}
              className={`relative flex cursor-pointer rounded-xl p-4 transition-colors min-h-[64px] ${
                categoryId === cat.category_id
                  ? 'liquid-glass'
                  : 'border border-white/10 bg-white/[0.02] active:bg-white/[0.06]'
              }`}
            >
              <input
                type="radio"
                name="category_id"
                value={cat.category_id}
                className="sr-only"
                onChange={(e) => setCategoryId(e.target.value)}
              />
              <span className="flex flex-col">
                <span className={`text-sm font-medium ${categoryId === cat.category_id ? 'text-white' : 'text-white/85'}`}>{cat.name}</span>
                <span className="mt-1 text-xs text-white/50">Máximo: {cat.max_members} integrantes</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {categoryId && (
        <>
          {/* Datos del Equipo */}
          <div className={sectionClass}>
            <h3 className="text-xl text-white mb-4 sm:mb-5" style={serif}>Datos del equipo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className={labelClass}>Nombre del Equipo *</label>
                <input type="text" name="team_name" required value={formData.team_name} onChange={handleInputChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>
                  Código de Inscripción {requireRegistrationCode ? '*' : '(opcional)'}
                </label>
                <input type="text" name="registration_code" required={requireRegistrationCode} value={formData.registration_code} onChange={handleInputChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Sede *</label>
                <input type="text" name="campus" required value={formData.campus} onChange={handleInputChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Institución *</label>
                <input type="text" name="institution" required value={formData.institution} onChange={handleInputChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Carrera</label>
                <input type="text" name="career" value={formData.career} onChange={handleInputChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Semestre</label>
                <input type="text" name="semester" value={formData.semester} onChange={handleInputChange} className={inputClass} />
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <TeamPhotoUploader onPhotoSelect={setPhoto} />
            </div>
          </div>

          {/* Líder */}
          <div className={sectionClass}>
            <h3 className="text-xl text-white mb-4 sm:mb-5" style={serif}>Datos del líder</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className={labelClass}>Nombre Completo *</label>
                <input type="text" name="leader_name" required value={formData.leader_name} onChange={handleInputChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Correo Electrónico *</label>
                <input type="email" name="leader_email" readOnly value={formData.leader_email} className={`${inputClass} cursor-not-allowed opacity-70`} title="El correo está vinculado a tu cuenta de Google." />
              </div>
              <div>
                <label className={labelClass}>Matrícula / ID *</label>
                <input type="text" name="leader_student_id" required value={formData.leader_student_id} onChange={handleInputChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Teléfono</label>
                <input type="tel" name="leader_phone" value={formData.leader_phone} onChange={handleInputChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Integrantes */}
          {members.length > 0 && (
            <div className={sectionClass}>
              <h3 className="text-xl text-white mb-2" style={serif}>Integrantes adicionales</h3>
              <p className="text-sm text-white/55 mb-5">Llena los datos de los demás miembros. Deja en blanco si tu equipo tiene menos del máximo permitido.</p>
              <div className="space-y-5">
                {members.map((member, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                    <h4 className="text-[11px] font-medium text-white/65 uppercase tracking-[0.18em] mb-4">Integrante {idx + 2}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className={labelClass}>Nombre</label>
                        <input type="text" value={member.full_name} onChange={(e) => handleMemberChange(idx, 'full_name', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Correo</label>
                        <input type="email" value={member.email} onChange={(e) => handleMemberChange(idx, 'email', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Matrícula</label>
                        <input type="text" value={member.student_id} onChange={(e) => handleMemberChange(idx, 'student_id', e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Términos */}
          <div className={sectionClass}>
            <label className="flex items-start gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                name="accepted_terms"
                checked={formData.accepted_terms}
                onChange={handleInputChange}
                className="mt-1 h-5 w-5 rounded border-white/20 bg-white/5 accent-white shrink-0"
              />
              <span className="text-sm text-white/70 leading-relaxed">
                He leído y acepto el reglamento del concurso, y autorizo el tratamiento de mis datos personales para los fines propios del evento.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="liquid-glass w-full text-white font-medium text-base py-4 px-4 rounded-full active:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px]"
          >
            {loading ? 'Enviando registro…' : 'Completar Inscripción'}
          </button>
        </>
      )}
    </form>
  );
};

export default RegistrationForm;
