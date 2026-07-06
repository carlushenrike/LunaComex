// src/config/apiClient.js
require('dotenv').config();
const axios = require('axios');
const https = require('https');
const fs = require('fs');

const createPortalClient = () => {
    // 1. Pega os caminhos e senhas do arquivo .env
    const certPath = process.env.CERT_PATH || './certs/meu_certificado.pfx';
    const certPassword = process.env.CERT_PASSWORD;
    const portalUrl = process.env.PORTAL_UNICO_URL;

    // 2. Tenta ler o arquivo do certificado
    let pfxFile = null;
    try {
        if (fs.existsSync(certPath)) {
            pfxFile = fs.readFileSync(certPath);
        } else {
            console.warn(`⚠️ AVISO: Certificado não encontrado em: ${certPath}`);
        }
    } catch (err) {
        console.error("Erro ao ler o arquivo do certificado:", err.message);
    }

    // 3. Configura o Agente HTTPS
    const httpsAgent = new https.Agent({
        pfx: pfxFile,
        passphrase: certPassword,
        rejectUnauthorized: false 
    });

    // 4. Cria a instância (Mudei de 'api' para 'instance' para bater com o resto)
    const instance = axios.create({
        baseURL: portalUrl,
        httpsAgent: httpsAgent,
        headers: {
            'Content-Type': 'application/json',
            'Role-Type': 'IMPEXP', 
            'X-Role-Type': 'IMPEXP',
            'Accept': 'application/json'
        }
    });

    return instance;
};

module.exports = createPortalClient;