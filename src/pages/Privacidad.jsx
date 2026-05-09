const Privacidad = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Política de Privacidad</h1>
        <p className="text-slate-500 text-sm mb-8">Última actualización: {new Date().getFullYear()}</p>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6 text-slate-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Información que recopilamos</h2>
            <p>Al registrarte a través de Google OAuth, recopilamos tu nombre y correo electrónico con el único propósito de identificar tu inscripción al concurso TechCon UDEA. No almacenamos contraseñas ni información de pago.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. Uso de la información</h2>
            <p>La información recopilada se utiliza exclusivamente para:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Identificar y gestionar tu inscripción al concurso.</li>
              <li>Comunicarnos contigo sobre el estado de tu registro.</li>
              <li>Cumplir con los procesos administrativos del evento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">3. Compartición de datos</h2>
            <p>No vendemos, intercambiamos ni transferimos tu información personal a terceros. Los datos son accesibles únicamente por el equipo organizador del TechCon UDEA.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">4. Seguridad</h2>
            <p>Utilizamos Supabase como plataforma de base de datos con Row Level Security (RLS) activado, lo que garantiza que cada usuario solo puede acceder a su propia información.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">5. Tus derechos</h2>
            <p>Puedes solicitar la eliminación de tus datos en cualquier momento contactando al equipo organizador del evento.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">6. Contacto</h2>
            <p>Para preguntas sobre esta política, contáctanos a través de la página de <a href="/contacto" className="text-blue-600 hover:underline">Contacto</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacidad;
