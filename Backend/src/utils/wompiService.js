import fetch from "node-fetch";
import { config } from "../../config.js";

/**
 * Servicio Wompi (El Salvador - docs.wompi.sv).
 * Auth OAuth2 client-credentials con caché en memoria.
 * Los cobros salen siempre desde el backend: el client_secret nunca llega al frontend.
 */

const AUTH_URL = process.env.WOMPI_AUTH_URL || "https://id.wompi.sv/connect/token";
const API_URL = process.env.WOMPI_API_URL || "https://api.wompi.sv";

let cachedToken = null;
let tokenExpiresAt = 0;

/** Obtiene (y cachea) el access_token de Wompi. */
export async function getWompiToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) return cachedToken;

  if (!config.wompi.client_id || !config.wompi.client_secret) {
    throw new Error("Faltan credenciales Wompi (CLIENT_ID / CLIENT_SECRET)");
  }

  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: config.wompi.grant_type,
      audience: config.wompi.audience,
      client_id: config.wompi.client_id,
      client_secret: config.wompi.client_secret,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error("Wompi auth falló: " + error);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + (Number(data.expires_in) || 3600) * 1000 - 60000;
  return cachedToken;
}

/** POST autenticado a la API de Wompi. Retorna { ok, status, data }. */
export async function wompiRequest(path, body) {
  const token = await getWompiToken();
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return { ok: response.ok, status: response.status, data };
}

/** Arma el payload de cobro con tarjeta para Wompi. */
export function buildChargePayload({ monto, emailCliente, nombreCliente, tarjeta, formaPago = 0, cantidadCuotas, idExterno }) {
  const payload = {
    monto: Number(monto),
    emailCliente,
    nombreCliente,
    tarjetaCreditoDebido: {
      numeroTarjeta: String(tarjeta.numeroTarjeta).replace(/\s/g, ""),
      cvv: String(tarjeta.cvv),
      mesVencimiento: Number(tarjeta.mesVencimiento),
      anioVencimiento: Number(tarjeta.anioVencimiento),
    },
    formaPago: Number(formaPago),
  };
  if (cantidadCuotas) payload.cantidadCuotas = Number(cantidadCuotas);
  if (idExterno) payload.idExterno = String(idExterno).slice(0, 50);
  return payload;
}
