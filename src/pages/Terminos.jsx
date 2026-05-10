const Terminos = () => {
  return (
    <div className="min-h-screen bg-[#070b0a] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-2">Términos de Servicio</h1>
        <p className="text-slate-400 text-sm mb-8">Última actualización: {new Date().getFullYear()}</p>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-sm border border-white/10 p-8 space-y-6 text-slate-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Aceptación de los términos</h2>
            <p>Al registrarte en el TechCon UDEA, aceptas estos Términos de Servicio. Si no estás de acuerdo, no debes utilizar esta plataforma.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. Elegibilidad</h2>
            <p>Para participar en el concurso debes ser estudiante activo de nivel bachillerato o preparatoria. El incumplimiento de los requisitos puede resultar en la cancelación de tu inscripción.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Registro e identidad</h2>
            <p>Cada participante puede registrar un solo equipo por edición del concurso. Al iniciar sesión con Google, garantizas que la cuenta utilizada es tuya y que la información proporcionada es verídica.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. Conducta</h2>
            <p>Los participantes se comprometen a actuar con respeto e integridad durante todo el evento. Cualquier forma de deshonestidad académica o conducta inapropiada puede resultar en descalificación inmediata.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. Modificaciones</h2>
            <p>El equipo organizador se reserva el derecho de modificar las bases del concurso, fechas o categorías en cualquier momento. Los cambios serán comunicados a través de esta plataforma.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">6. Limitación de responsabilidad</h2>
            <p>La organización del TechCon UDEA no se hace responsable por problemas técnicos ajenos a su control que puedan afectar el proceso de inscripción.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">7. Contacto</h2>
            <p>Para dudas sobre estos términos, contáctanos a través de la página de <a href="/contacto" className="text-blue-400 hover:underline">Contacto</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terminos;
