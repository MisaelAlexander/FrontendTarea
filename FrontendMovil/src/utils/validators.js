// Costura única de validaciones del móvil.
// Todas las pantallas validan a través de este módulo (no duplicar regex ni reglas).

export const EMAIL_RE = /^\S+@\S+\.\S+$/;
export const MIN_PASSWORD = 6;

export const isEmail = (v) => EMAIL_RE.test(String(v || '').trim());

const need = (v, label) => (String(v || '').trim() ? null : `${label} es obligatorio`);

export function validateLogin(usuario, password) {
  return need(usuario, 'El usuario') || need(password, 'La contraseña');
}

export function validateRegister({ nombre, apellido, usuario, password, correo }) {
  return (
    need(nombre, 'El nombre') ||
    need(apellido, 'El apellido') ||
    need(usuario, 'El usuario') ||
    need(correo, 'El correo') ||
    (!isEmail(correo) ? 'El correo no tiene un formato válido' : null) ||
    need(password, 'La contraseña') ||
    (String(password).length < MIN_PASSWORD
      ? `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres`
      : null)
  );
}

export function validateProfile({ nombre, apellido, usuario, correo, password }) {
  const base =
    need(nombre, 'El nombre') ||
    need(apellido, 'El apellido') ||
    need(usuario, 'El usuario') ||
    need(correo, 'El correo') ||
    (!isEmail(correo) ? 'El correo no tiene un formato válido' : null);
  if (base) return base;
  if (password && String(password).length > 0 && String(password).length < MIN_PASSWORD) {
    return `La nueva contraseña debe tener al menos ${MIN_PASSWORD} caracteres`;
  }
  return null;
}

export function validateRecoveryEmail(correo) {
  return need(correo, 'El correo') || (!isEmail(correo) ? 'El correo no tiene un formato válido' : null);
}

export function validateRecoveryCode(code) {
  const c = String(code || '').trim();
  if (!c) return 'El código es obligatorio';
  if (!/^[0-9a-fA-F]{6}$/.test(c)) return 'El código debe tener 6 caracteres hexadecimales';
  return null;
}

export function validateNewPassword(pw, confirm) {
  if (!pw) return 'La nueva contraseña es obligatoria';
  if (String(pw).length < MIN_PASSWORD) return `Mínimo ${MIN_PASSWORD} caracteres`;
  if (pw !== confirm) return 'Las contraseñas no coinciden';
  return null;
}

export function validateComment(text, rating) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return 'La calificación debe ser de 1 a 5';
  if (String(text || '').trim().length < 3) return 'Escribe al menos 3 caracteres';
  return null;
}

export function validateCard({ name, number, exp, cvc }) {
  const nameErr = need(name, 'El titular de la tarjeta');
  if (nameErr) return nameErr;
  const digits = String(number || '').replace(/\D/g, '');
  if (digits.length < 15 || digits.length > 16) return 'Revisa el número de tarjeta';
  const m = String(exp || '').match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!m) return 'Usa formato MM/AA';
  const year = 2000 + Number(m[2]);
  const month = Number(m[1]);
  const now = new Date();
  if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
    return 'La tarjeta está vencida';
  }
  if (!/^\d{3,4}$/.test(String(cvc || '').trim())) return 'Revisa el código de seguridad';
  return null;
}

// Control de inventario del lado cliente (el backend revalida).
export const stockOf = (product) => {
  const s = Number(product?.stock);
  return Number.isFinite(s) && s >= 0 ? s : 0;
};

export const canPurchase = (product, qty = 1) => stockOf(product) >= qty && qty > 0;
