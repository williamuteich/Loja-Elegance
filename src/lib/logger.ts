/**
 * Sistema de Logging Seguro
 * 
 * PROPÓSITO:
 * - Controlar logs por ambiente (dev/prod)
 * - Filtrar dados sensíveis automaticamente
 * - Manter logs de segurança sempre ativos
 * 
 * SEGURANÇA:
 * ✅ Não loga dados sensíveis em produção
 * ✅ Redação automática de informações críticas
 * ✅ Logs de segurança sempre ativos
 * ✅ Estrutura consistente para auditoria
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Campos que nunca devem ser logados
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'secret',
  'key',
  'authorization',
  'cardNumber',
  'cvv',
  'cpf',
  'email', // Em produção
];

// Tipos de log
export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  SECURITY = 'SECURITY'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  environment: string;
  source?: string;
}

export class Logger {
  /**
   * Remove dados sensíveis do objeto
   */
  private static sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      
      // Verificar se é campo sensível
      if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
        sanitized[key] = isProduction ? '[REDACTED]' : `[${typeof value}]`;
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  /**
   * Cria entry de log estruturado
   */
  private static createLogEntry(
    level: LogLevel,
    message: string,
    data?: any,
    source?: string
  ): LogEntry {
    return {
      level,
      message,
      data: data ? this.sanitizeData(data) : undefined,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      source
    };
  }

  /**
   * Log de desenvolvimento (apenas em dev)
   */
  static debug(message: string, data?: any, source?: string): void {
    if (!isDevelopment) return;
    
    const entry = this.createLogEntry(LogLevel.DEBUG, message, data, source);
    console.log('🐛', entry.message, entry.data ? entry.data : '');
  }

  /**
   * Log informativo (dev e prod controlado)
   */
  static info(message: string, data?: any, source?: string): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, data, source);
    
    if (isDevelopment) {
      console.log('ℹ️', entry.message, entry.data ? entry.data : '');
    } else {
      // Em produção, apenas logs estruturados sem dados
      console.log(JSON.stringify({
        level: entry.level,
        message: entry.message,
        timestamp: entry.timestamp,
        source: entry.source
      }));
    }
  }

  /**
   * Log de warning (sempre ativo)
   */
  static warn(message: string, data?: any, source?: string): void {
    const entry = this.createLogEntry(LogLevel.WARN, message, data, source);
    
    if (isDevelopment) {
      console.warn('⚠️', entry.message, entry.data ? entry.data : '');
    } else {
      console.warn(JSON.stringify(entry));
    }
  }

  /**
   * Log de erro (sempre ativo)
   */
  static error(message: string, error?: Error | any, source?: string): void {
    const entry = this.createLogEntry(
      LogLevel.ERROR, 
      message, 
      error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: isDevelopment ? error.stack : '[REDACTED]'
      } : error,
      source
    );
    
    console.error('🚨', JSON.stringify(entry));
  }

  /**
   * Log de segurança (sempre ativo e detalhado)
   */
  static security(message: string, data?: any, source?: string): void {
    const entry = this.createLogEntry(LogLevel.SECURITY, message, data, source);
    
    // Logs de segurança sempre são mantidos, mas sanitizados
    console.warn('🔒 SECURITY:', JSON.stringify(entry));
    
    // TODO: Em produção, enviar para sistema de monitoramento
    // if (isProduction) {
    //   sendToSecurityMonitoring(entry);
    // }
  }

  /**
   * Log específico para operações de carrinho
   */
  static cart(action: string, data?: any): void {
    this.debug(`🛒 CART ${action}`, data, 'CartService');
  }

  /**
   * Log específico para pagamentos
   */
  static payment(action: string, data?: any): void {
    // Pagamentos sempre logam (mas sanitizados em produção)
    const entry = this.createLogEntry(LogLevel.INFO, `💳 PAYMENT ${action}`, data, 'PaymentService');
    
    if (isDevelopment) {
      console.log('💳', entry.message, entry.data ? entry.data : '');
    } else {
      // Em produção, apenas dados não sensíveis
      console.log(JSON.stringify({
        level: entry.level,
        message: entry.message,
        timestamp: entry.timestamp,
        source: entry.source,
        // Apenas campos seguros para pagamento
        orderId: entry.data?.orderId,
        amount: entry.data?.amount,
        status: entry.data?.status
      }));
    }
  }

  /**
   * Log específico para autenticação
   */
  static auth(action: string, userId?: string, success = true): void {
    this.security(`AUTH ${action} - ${success ? 'SUCCESS' : 'FAILED'}`, {
      userId: userId ? `user_${userId.slice(-4)}` : 'anonymous', // Apenas últimos 4 chars
      success,
      action
    }, 'AuthService');
  }
}

// Export da instância para uso direto
export const logger = Logger;

// Compatibilidade com o logger anterior
export default Logger;
