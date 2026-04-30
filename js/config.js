/* ============================================================
   STLAI Asset Generator — Config
   ------------------------------------------------------------
   Carrega/salva configurações do localStorage.
   O modal de Settings (botão de engrenagem) é o jeito recomendado
   de configurar — não é mais necessário editar arquivo.
   ============================================================ */

const STORAGE_KEY = 'stlai_config_v1';

const DEFAULT_CONFIG = {
  OPENAI_API_KEY: '',
  OPENAI_IMAGE_MODEL: 'gpt-image-2',
  TRIPO_API_KEY: '',
  MAX_ITEMS_POR_GERACAO: 20,
  MOCK_MODE: false,
};

function loadConfig() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Falha ao ler config do localStorage:', e);
  }
  return { ...DEFAULT_CONFIG };
}

function saveConfig(partial) {
  const merged = { ...window.CONFIG, ...partial };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch (e) {
    console.warn('Falha ao salvar config no localStorage:', e);
  }
  window.CONFIG = merged;
  return merged;
}

function isMockMode() {
  if (window.CONFIG.MOCK_MODE) return true;
  // Sem chave da OpenAI, todo o pipeline cai pra mock automaticamente.
  if (!window.CONFIG.OPENAI_API_KEY) return true;
  return false;
}

window.CONFIG = loadConfig();
window.saveConfig = saveConfig;
window.isMockMode = isMockMode;
