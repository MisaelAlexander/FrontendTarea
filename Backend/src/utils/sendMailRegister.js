/**
 * Genera el HTML para el correo de verificación de registro.
 * @param {string} code - Código de verificación de 6 dígitos
 * @returns {string} HTML del correo electrónico
 */
const HTMLRegisterEmail = (code) => {
  return `
      <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f9; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2596be; font-size: 24px; margin-bottom: 20px;">Techne Meraki - Verifica tu cuenta</h1>
        <p style="font-size: 16px; color: #555; line-height: 1.5;">
          Gracias por registrarte. Usa el siguiente código para verificar tu cuenta:
        </p>
        <div style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 18px; font-weight: bold; color: #fff; background-color: #2596be; border-radius: 5px; border: 1px solid #1a7a9c;">
          ${code}
        </div>
        <p style="font-size: 14px; color: #777; line-height: 1.5;">
          Este código es válido por los próximos <strong>15 minutos</strong>. Si no solicitaste este registro, ignora este correo.
        </p>
      </div>
    `;
};

export default HTMLRegisterEmail;
