/**
 * Sistema de Rate Limiting para APIs
 * 
 * PROPÓSITO:
 * - Prevenir abuso de endpoints sensíveis
 * - Proteger contra ataques de força bruta
 * - Limitar operações por usuário/IP
 * 
 * SEGURANÇA:
 * ✅ Baseado em IP e/ou userId
 * ✅ Janela deslizante de tempo
 * ✅ Reset automático de contadores
 * ✅ Logs de tentativas suspeitas
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// Cache em memória para rate limiting
const rateLimitCache = new Map<string, RateLimitRecord>();

interface RateLimitConfig {
  windowMs: number; // Janela de tempo em ms
  maxRequests: number; // Máximo de requests por janela
  keyPrefix?: string; // Prefixo para diferentes tipos de limite
}

export class RateLimit {
  /**
   * Verifica se o usuário pode fazer a requisição
   */
  static async check(
    identifier: string, // IP ou userId
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; remainingRequests: number; resetTime: number }> {
    const key = `${config.keyPrefix || 'default'}:${identifier}`;
    const now = Date.now();
    
    // Buscar record existente
    let record = rateLimitCache.get(key);
    
    // Se não existe ou expirou, criar novo
    if (!record || now >= record.resetTime) {
      record = {
        count: 0,
        resetTime: now + config.windowMs
      };
    }
    
    // Incrementar contador
    record.count++;
    
    // Salvar no cache
    rateLimitCache.set(key, record);
    
    // Verificar se excedeu o limite
    const allowed = record.count <= config.maxRequests;
    const remainingRequests = Math.max(0, config.maxRequests - record.count);
    
    // Log para tentativas suspeitas
    if (!allowed) {
      console.warn(`🚨 RATE LIMIT EXCEEDED: ${key} - ${record.count}/${config.maxRequests} requests`);
    }
    
    return {
      allowed,
      remainingRequests,
      resetTime: record.resetTime
    };
  }
  
  /**
   * Limpa cache expirado (limpeza automática)
   */
  static cleanup(): void {
    const now = Date.now();
    const expired: string[] = [];
    
    for (const [key, record] of rateLimitCache.entries()) {
      if (now >= record.resetTime) {
        expired.push(key);
      }
    }
    
    expired.forEach(key => rateLimitCache.delete(key));
    
    // ✅ Limpeza silenciosa - removido log verboso
  }
  
  /**
   * Configurações pré-definidas para diferentes tipos de endpoints
   */
  static configs = {
    // Operações de carrinho
    cart: {
      windowMs: 60 * 1000, // 1 minuto
      maxRequests: 30, // 30 operações por minuto
      keyPrefix: 'cart'
    },
    
    // Login/Authentication
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      maxRequests: 5, // 5 tentativas por 15 minutos
      keyPrefix: 'auth'
    },
    
    // APIs de pagamento
    payment: {
      windowMs: 60 * 1000, // 1 minuto
      maxRequests: 3, // 3 tentativas por minuto
      keyPrefix: 'payment'
    },
    
    // APIs de cadastro/registro
    register: {
      windowMs: 60 * 60 * 1000, // 1 hora
      maxRequests: 3, // 3 registros por hora
      keyPrefix: 'register'
    }
  };
}

/**
 * Função utilitária para extrair IP da requisição
 */
export function getClientIP(request: Request): string {
  // Verificar headers de proxy
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback para desenvolvimento
  return 'unknown-ip';
}

// Limpeza automática a cada 5 minutos
if (typeof window === 'undefined') { // Apenas no servidor
  setInterval(() => {
    RateLimit.cleanup();
  }, 5 * 60 * 1000);
}
