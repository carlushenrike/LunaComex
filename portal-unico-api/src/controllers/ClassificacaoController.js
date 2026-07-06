/* src/controllers/ClassificacaoController.js */
const createPortalClient = require('../config/apiClient');
const fs = require('fs');
const path = require('path');

// Definimos os caminhos
const CACHE_FILE = path.join(__dirname, '../data/cache_ncm.json');
const AUTH_CACHE_FILE = path.join(__dirname, '../data/cache_auth.json');

// TTL (Tempo de Vida)
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 Horas
const AUTH_TTL = 1000 * 60 * 10;       // 10 Minutos

// --- HELPER DE LEITURA BLINDADO ---
const loadJson = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) return null;
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        return null; 
    }
};

// --- HELPER DE ESCRITA AUTO-GERENCIÁVEL ---
const saveJson = (filePath, data) => {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(`Erro ao salvar cache em ${filePath}:`, e);
    }
};

// --- FUNÇÃO DE TOKEN ---
const getAuthTokens = async () => {
    const agora = Date.now();
    const cachedAuth = loadJson(AUTH_CACHE_FILE);

    // 1. Tenta Cache
    if (cachedAuth && cachedAuth.timestamp && (agora - cachedAuth.timestamp) < AUTH_TTL) {
        return cachedAuth.tokens;
    }

    // 2. Busca API
    console.log('🔐 [AUTH API] Gerando novos tokens...');
    const api = createPortalClient();
    const authResponse = await api.post('/portal/api/autenticar', {}, {
        headers: { 'Role-Type': 'IMPEXP' }
    });

    const csrfToken = authResponse.headers['x-csrf-token'];
    const jwtToken = authResponse.headers['set-token'];

    if (!csrfToken || !jwtToken) throw new Error("Falha na autenticação Portal Único.");

    const tokens = { 'X-CSRF-Token': csrfToken, 'Authorization': jwtToken };

    // 3. Salva
    saveJson(AUTH_CACHE_FILE, { tokens, timestamp: agora });

    return tokens;
};

// --- CONTROLLER ---
const ClassificacaoController = {
    async buscarAtributos(req, res) {
        try {
            const { ncm } = req.params;
            const agora = Date.now();
            
            // 1. Tenta Cache de NCM
            const ncmCache = loadJson(CACHE_FILE) || {};
            
            if (ncmCache[ncm]) {
                const cached = ncmCache[ncm];
                if ((agora - cached.timestamp) < CACHE_TTL) {
                    console.log(`📦 [CACHE DISCO] NCM ${ncm} encontrada.`);
                    return res.json(cached.dados);
                }
            }

            // 2. Busca Token (Reutilizável)
            const headersAuth = await getAuthTokens();

            // 3. Busca Dados na API
            console.log(`🌍 [API] Buscando NCM ${ncm}...`);
            const api = createPortalClient();
            
            // AQUI O PULO DO GATO: TEM QUE REPASSAR O ROLE-TYPE NO GET TAMBÉM
            const response = await api.get(`/cadatributos/api/ext/atributo-ncm/${ncm}`, {
                headers: { 
                    ...headersAuth, 
                    'Role-Type': 'IMPEXP' 
                }
            });

            // 4. Salva Cache NCM
            ncmCache[ncm] = { dados: response.data, timestamp: agora };
            saveJson(CACHE_FILE, ncmCache);

            return res.json(response.data);

        } catch (error) {
            console.error(`❌ Erro NCM ${req.params.ncm}:`);
            
            // FALLBACK se der erro 422
            if (error.response && error.response.status === 422) {
                const ncmCache = loadJson(CACHE_FILE) || {};
                if (ncmCache[req.params.ncm]) {
                    console.warn(`⚠️ [FALLBACK] Usando cache antigo.`);
                    return res.json(ncmCache[req.params.ncm].dados);
                }
                // log detalhado
                console.error('RETORNO DA RECEITA (422):', JSON.stringify(error.response.data, null, 2));
                
                return res.status(422).json(error.response.data);
            }
            
            if (error.response) return res.status(error.response.status).json(error.response.data);
            return res.status(500).json({ erro: "Erro interno." });
        }
    }
};

module.exports = ClassificacaoController;