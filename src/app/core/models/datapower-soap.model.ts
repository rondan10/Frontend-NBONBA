// soap-request.model.ts
export interface SoapHeader {
    username: string;
    password: string;
    country: string;
    language: string;
    consumer: string;
    system: string;
    modulo: string;
    pid: string;
    userId: string;
    dispositivo: string;
    wsIp: string;
    operation: string;
    timestamp: string;
    msgType: string;
    channel: string;
    idApplication?: string;
    userApplication: string;
    userSession?: string;
    idESBTransaction: string;
    idBusinessTransaction: string;
    startDate: string;
    additionalNode?: string;
  }
  
  export interface AccesoRequest {
    usuario: string;
    aplicacion: string;
  }
  