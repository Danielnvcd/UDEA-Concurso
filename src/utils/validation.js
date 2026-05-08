export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return false;

  const allowedDomain = import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN;
  if (allowedDomain && !email.endsWith(`@${allowedDomain}`)) {
    return false;
  }
  return true;
};

export const validateFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!allowedTypes.includes(file.type)) {
    return 'El archivo debe ser JPG, PNG o WebP.';
  }

  if (file.size > maxSize) {
    return 'El archivo no debe pesar más de 2MB.';
  }

  return null;
};
