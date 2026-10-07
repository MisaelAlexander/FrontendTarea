import Mailjet from "node-mailjet";
import { config } from "../../config.js";

let mailjet = null;

const getMailjet = () => {
  if (!config.email.apiKey || !config.email.apiSecret) {
    throw new Error("Falta configurar MAILJET_API_KEY y MAILJET_SECRET_KEY en el .env");
  }
  if (!mailjet) {
    mailjet = Mailjet.apiConnect(config.email.apiKey, config.email.apiSecret);
  }
  return mailjet;
};

/**
 * Envía un correo transaccional con Mailjet (API v3.1).
 * @param {{ to: string, subject: string, html: string }} params
 */
export const sendEmail = async ({ to, subject, html }) => {
  const response = await getMailjet()
    .post("send", { version: "v3.1" })
    .request({
      Messages: [
        {
          From: {
            Email: config.email.from_email,
            Name: config.email.from_name,
          },
          To: [{ Email: to }],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    });

  return response.body;
};

export default sendEmail;
