# Concurso UDEA 2026

Repositorio oficial de la pagina web del concurso de la Universidad de los Angeles.

🌐 **[udeaconcurso.site](https://udeaconcurso.site)**

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)]()

## Tecnologías

- **React** — Interfaz de usuario.
- **Vite** — Bundler y entorno de desarrollo
- **Tailwind CSS** — Estilos
- **Supabase** — Base de datos, autenticación y almacenamiento
- **Framer Motion** — Animaciones
- **Cloudflare Workers** — Despliegue

<p align="center">
  <img src="./public/captura.png" alt="Captura del concurso UDEA 2026" width="800"/>
</p>


## Características Principales

- **Autenticación y Base de Datos**: Integración con Supabase para manejo de usuarios y almacenamiento de datos.
- **Diseño Responsivo**: Interfaz fluida adaptable a dispositivos móviles y escritorio usando Tailwind CSS.
- **Animaciones Avanzadas**: Transiciones y efectos fluidos con Framer Motion.
- **Reproducción Multimedia**: Soporte para videos HLS y recorte de imágenes interactivo.

## Ejecución Local

Para correr este proyecto en tu PC localmente, sigue estos pasos:

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Danielnvcd/UDEA-Concurso.git
   cd UDEA-Concurso
   ```

2. **Instalar dependencias**
   Asegúrate de tener [Node.js](https://nodejs.org/) instalado en tu equipo y ejecuta:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables clave (pide los valores reales a los administradores del proyecto):
   ```env
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
   VITE_SITE_URL=http://localhost:5173
   VITE_ALLOWED_EMAIL_DOMAIN=
   VITE_TURNSTILE_SITE_KEY=
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la página.

## Estructura del Proyecto

- `/src/components`: Componentes reutilizables de la interfaz.
- `/src/pages`: Vistas principales de la aplicación.
- `/src/layouts`: Estructuras de diseño general (navbar, contenedores principales).
- `/src/lib`: Configuración de integraciones de terceros (como el cliente de Supabase).
- `/src/utils`: Funciones auxiliares genéricas.
- `/supabase`: Configuraciones y migraciones relacionadas con la base de datos de Supabase.

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar los siguientes comandos:

- `npm run dev`: Inicia el servidor de desarrollo local de Vite.
- `npm run build`: Compila la aplicación y la optimiza para producción en la carpeta `dist`.
- `npm run preview`: Sirve la aplicación compilada localmente a través de Cloudflare Wrangler.
- `npm run deploy`: Ejecuta el build y despliega automáticamente el proyecto a Cloudflare.
- `npm run lint`: Ejecuta el linter (ESLint) para buscar posibles problemas de sintaxis.

## Licencia

Este proyecto opera bajo una **Licencia Propietaria**. El código es propiedad exclusiva de Danielnvcd y está reservado para el uso de la Universidad de los Ángeles (UDEA).
Queda estrictamente prohibida su copia, modificación, distribución y comercialización sin autorización expresa. Para más detalles, consulta el archivo [LICENSE](./LICENSE).

## Autor

Desarrollado por **[Danielnvcd](https://danielnvcd.site)**