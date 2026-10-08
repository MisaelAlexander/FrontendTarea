/**
 * Genera el HTML para el correo de recuperación de contraseña.
 * @param {string} code - Código de verificación de 6 caracteres
 * @returns {string} HTML del correo electrónico
 */
const HTMLRecoveryEmail = (code) => {
  return `
      <div style="font-family: Arial, sans-serif; text-align: center; background-color: #E6F4FE; padding: 20px; border: 1px solid #bad4f8; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(90deg, #2596be, #1e7a9b); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Techne Meraki</h1>
        </div>
        <h2 style="color: #1a365d; font-size: 20px; margin-bottom: 20px;">Password Recovery</h2>
        <p style="font-size: 16px; color: #1a365d; line-height: 1.5;">
          Hello, we received a request to reset your password. Use the verification code below to proceed:
        </p>
        <div style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 18px; font-weight: bold; color: #fff; background-color: #2596be; border-radius: 5px; border: 1px solid #1e7a9b;">
          ${code}
        </div>
        <p style="font-size: 14px; color: #1a365d; line-height: 1.5;">
          This code is valid for the next <strong>15 minutes</strong>. If you didn't request this email, you can safely ignore it.
        </p>
        <hr style="border: none; border-top: 1px solid #bad4f8; margin: 20px 0;">
        <footer style="font-size: 12px; color: #1a365d;">
          If you need further assistance, please contact our support team.
        </footer>
      </div>
    `;
};

export default HTMLRecoveryEmail;
