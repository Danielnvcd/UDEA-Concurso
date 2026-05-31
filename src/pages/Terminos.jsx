const serif = { fontFamily: "'Bricolage Grotesque', sans-serif" };

const Terminos = () => {
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
          Términos de <em style={{ ...serif, fontStyle: 'italic' }}>servicio</em>
        </h1>
        <p className="text-white/50 text-sm mb-10">Última actualización: {new Date().getFullYear()}</p>

        <div className="liquid-glass rounded-2xl p-8 space-y-7 text-white/65 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg text-white mb-2" style={serif}>1. Aceptación de los términos</h2>
            <p>Al registrarte en el TechCon UDEA, aceptas estos Términos de Servicio. Si no estás de acuerdo, no debes utilizar esta plataforma.</p>
          </section>

          <section>
            <h2 className="text-lg text-white mb-2" style={serif}>2. Elegibilidad</h2>
            <p>Para participar en el concurso debes ser estudiante activo de nivel bachillerato o preparatoria. El incumplimiento de los requisitos puede resultar en la cancelación de tu inscripción.</p>
          </section>

          <section>
            <h2 className="text-lg text-white mb-2" style={serif}>3. Registro e identidad</h2>
            <p>Cada participante puede registrar un solo equipo por edición del concurso. Al iniciar sesión con Google, garantizas que la cuenta utilizada es tuya y que la información proporcionada es verídica.</p>
          </section>

          <section>
            <h2 className="text-lg text-white mb-2" style={serif}>4. Conducta</h2>
            <p>Los participantes se comprometen a actuar con respeto e integridad durante todo el evento. Cualquier forma de deshonestidad académica o conducta inapropiada puede resultar en descalificación inmediata.</p>
          </section>

          <section>
            <h2 className="text-lg text-white mb-2" style={serif}>5. Modificaciones</h2>
            <p>El equipo organizador se reserva el derecho de modificar las bases del concurso, fechas o categorías en cualquier momento. Los cambios serán comunicados a través de esta plataforma.</p>
          </section>

          <section>
            <h2 className="text-lg text-white mb-2" style={serif}>6. Limitación de responsabilidad</h2>
            <p>La organización del TechCon UDEA no se hace responsable por problemas técnicos ajenos a su control que puedan afectar el proceso de inscripción.</p>
          </section>

          <section>
            <h2 className="text-lg text-white mb-2" style={serif}>7. Contacto</h2>
            <p>Para dudas sobre estos términos, contáctanos a través de la página de <a href="/contacto" className="text-white underline underline-offset-4 hover:opacity-80">Contacto</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terminos;
