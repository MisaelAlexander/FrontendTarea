import { getWompiToken, wompiRequest, buildChargePayload } from "../utils/wompiService.js";

/**
 * Controller de Wompi (cargo directo).
 * Basado en ProyectoBackend1A + mejoras: token server-side con caché,
 * endpoint /cobro que hace el flujo completo y fix del bug `if (!response)`.
 */
const wompiController = {};

/** POST /api/wompi/token - Devuelve access_token (útil para depurar). */
wompiController.generarToken = async (req, res) => {
  try {
    const token = await getWompiToken();
    return res.status(200).json({ access_token: token });
  } catch (error) {
    console.log("Error Wompi token: " + error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

/**
 * POST /api/wompi/cobro - Cobro directo con tarjeta (flujo completo server-side).
 * Body: { monto, emailCliente, nombreCliente, tarjeta: { numeroTarjeta, cvv, mesVencimiento, anioVencimiento },
 *         formaPago (0 normal, 2 cuotas), cantidadCuotas, idExterno, con3DS (default true) }
 */
wompiController.cobro = async (req, res) => {
  try {
    const { monto, emailCliente, nombreCliente, tarjeta, formaPago = 0, cantidadCuotas, idExterno, con3DS = true } = req.body;

    if (!monto || Number(monto) <= 0) {
      return res.status(400).json({ message: "Monto inválido" });
    }
    if (!emailCliente || !nombreCliente) {
      return res.status(400).json({ message: "Faltan datos del cliente (emailCliente, nombreCliente)" });
    }
    if (!tarjeta?.numeroTarjeta || !tarjeta?.cvv || !tarjeta?.mesVencimiento || !tarjeta?.anioVencimiento) {
      return res.status(400).json({ message: "Datos de tarjeta incompletos" });
    }

    const payload = buildChargePayload({ monto, emailCliente, nombreCliente, tarjeta, formaPago, cantidadCuotas, idExterno });
    const endpoint = con3DS ? "/TransaccionCompra/3Ds" : "/TransaccionCompra";
    const { ok, status, data } = await wompiRequest(endpoint, payload);

    return res.status(ok ? 200 : status).json(data);
  } catch (error) {
    console.log("Error Wompi cobro: " + error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

/**
 * POST /api/wompi/cobro-tokenizado - Cobro con tarjeta tokenizada (sin 3DS).
 * Body: { monto, emailCliente, nombreCliente, tokenTarjeta, idExterno }
 */
wompiController.cobroTokenizado = async (req, res) => {
  try {
    const { monto, emailCliente, nombreCliente, tokenTarjeta, idExterno } = req.body;
    if (!monto || !emailCliente || !nombreCliente || !tokenTarjeta) {
      return res.status(400).json({ message: "Faltan datos (monto, emailCliente, nombreCliente, tokenTarjeta)" });
    }
    const body = { monto: Number(monto), emailCliente, nombreCliente, tokenTarjeta };
    if (idExterno) body.idExterno = String(idExterno).slice(0, 50);
    const { ok, status, data } = await wompiRequest("/TransaccionCompra/TokenizadaSin3Ds", body);
    return res.status(ok ? 200 : status).json(data);
  } catch (error) {
    console.log("Error Wompi cobro tokenizado: " + error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

/**
 * POST /api/wompi/tokenizar - Tokeniza una tarjeta para cobros futuros.
 * Body: { numeroTarjeta, cvv, mesVencimiento, anioVencimiento }
 */
wompiController.tokenizar = async (req, res) => {
  try {
    const { numeroTarjeta, cvv, mesVencimiento, anioVencimiento } = req.body;
    if (!numeroTarjeta || !cvv || !mesVencimiento || !anioVencimiento) {
      return res.status(400).json({ message: "Datos de tarjeta incompletos" });
    }
    const { ok, status, data } = await wompiRequest("/Tokenizacion", {
      numeroTarjeta: String(numeroTarjeta).replace(/\s/g, ""),
      cvv: String(cvv),
      mesVencimiento: Number(mesVencimiento),
      anioVencimiento: Number(anioVencimiento),
    });
    return res.status(ok ? 200 : status).json(data);
  } catch (error) {
    console.log("Error Wompi tokenizar: " + error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// ===== Compatibilidad con ProyectoBackend1A ({ token, formData }) =====

wompiController.paymentTest = async (req, res) => {
  try {
    const { token, formData } = req.body;
    // Si el frontend ya trae token de /token se usa directo; si no, el servicio lo genera
    const authToken = token || (await getWompiToken());
    const response = await (await import("node-fetch")).default(
      "https://api.wompi.sv/TransaccionCompra/TokenizadaSin3Ds",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(formData),
      },
    );
    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error });
    }
    return res.status(200).json(await response.json());
  } catch (error) {
    console.log("Error Wompi paymentTest: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

wompiController.payment3DS = async (req, res) => {
  try {
    const { token, formData } = req.body;
    const authToken = token || (await getWompiToken());
    const response = await (await import("node-fetch")).default(
      "https://api.wompi.sv/TransaccionCompra/3Ds",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(formData),
      },
    );
    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error });
    }
    return res.status(200).json(await response.json());
  } catch (error) {
    console.log("Error Wompi payment3DS: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default wompiController;
