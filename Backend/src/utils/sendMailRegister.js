/**
 * Genera el HTML para el correo de verificación de registro.
 * @param {string} code - Código de verificación de 6 dígitos
 * @returns {string} HTML del correo electrónico
 */
const HTMLRegisterEmail = (code) => {
  return `
      <div style="font-family: Arial, sans-serif; text-align: center; background-color: #E6F4FE; padding: 20px; border: 1px solid #bad4f8; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(90deg, #2596be, #1e7a9b); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Techne Meraki</h1>
        </div>
        <h2 style="color: #1a365d; font-size: 20px; margin-bottom: 20px;">Verifica tu cuenta</h2>
        <p style="font-size: 16px; color: #1a365d; line-height: 1.5;">
          Gracias por registrarte. Usa el siguiente código para verificar tu cuenta:
        </p>
        <div style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 18px; font-weight: bold; color: #fff; background-color: #2596be; border-radius: 5px; border: 1px solid #1e7a9b;">
          ${code}
        </div>
        <p style="font-size: 14px; color: #1a365d; line-height: 1.5;">
          Este código es válido por los próximos <strong>15 minutos</strong>. Si no solicitaste este registro, ignora este correo.
        </p>
      </div>
    `;
};

export default HTMLRegisterEmail;
