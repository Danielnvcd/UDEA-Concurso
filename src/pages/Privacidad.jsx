const serif = { fontFamily: "'Bricolage Grotesque', sans-serif" };

const Privacidad = () => {
  return (
    <div className="min-h-screen text-white pt-28 pb-16 px-6 relative overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(80,110,200,0.10) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto relative">
        <p className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-5">
          Legal
        </p>
        <h1 className="text-4xl md:text-5xl font-medium mb-3 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent" style={serif}>
          Política de <em style={{ ...serif, fontStyle: 'italic' }}>privacidad</em>
        </h1>
        <p className="text-white/50 text-sm mb-10">Última actualización: {new Date().getFullYear()}</p>

        <div className="liquid-glass rounded-2xl p-8 space-y-7 text-white/65 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg text-white mb-2" style={serif}>1. Información que recopilamos</h2>
            <p>Al registrarte a través de Google OAuth, recopilamos tu nombre y correo electrónico con el único propósito de identificar tu inscripción al concurso TechCon UDEA. No almacenamos contraseñas ni información de pago.</p>
          </section>

          <section>
            <h2 className="text-lg text-white mb-2" style={serif}>2. Uso de la información</h2>
            <p>La información recopilada se utiliza exclusivamente para:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Identificar y gestionar tu inscripción al concurso.</li>
              <li>Comunicarnos contigo sobre el estado de tu registro.</li>
              <li>Cumplir con los procesos administrativos del evento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg text-white mb-2" style={serif}>3. Compartición de datos</h2>
            <p>No vendemos, intercambiamos ni transferimos tu información personal a terceros. Los datos son accesibles únicamente por el equipo organizador del TechCon UDEA.</p>
          </section>

          <section>
            <h2 className="text-lg text-white mb-2" style={serif}>4. Seguridad</h2>
            <p>Utilizamos Supabase como plataforma de base de datos con Row Level Security (RLS) activado, lo que garantiza que cada usuario solo puede acceder a su propia información.</p>
          </section>

          <section>
            <h2 className="text-lg text-white mb-2" style={serif}>5. Tus derechos</h2>
            <p>Puedes solicitar la eliminación de tus datos en cualquier momento contactando al equipo organizador del evento.</p>
          </section>

          <section>
            <h2 className="text-lg text-white mb-2" style={serif}>6. Contacto</h2>
            <p>Para preguntas sobre esta política, contáctanos a través de la página de <a href="/contacto" className="text-white underline underline-offset-4 hover:opacity-80">Contacto</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacidad;
