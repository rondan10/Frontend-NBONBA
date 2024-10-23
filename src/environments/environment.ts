type DataPowerUrls = {
  [key: string]: string;
};

// Luego, definimos la interfaz para nuestro objeto environment
interface Environment {
  production: boolean;
  consultaClavesUrl: string;
  codigoAplicacion: string;
  usuarioAplicacion: string;
  claveAplicacion: string;
  applicationCode : string;
  leerDatosUsuarioUrl: string;
  leerOpcionesPorUsuarioUrl:string;
  dataPowerUrls: DataPowerUrls;
  wsTimeOut: string;
  usrDatapower: string;
  passDatapower: string;
  dataPowerConfig: {
    consumer: string;
    country: string;
    language: string;
    system: string;
    wsIp: string;
  };
}

// Ahora, definimos nuestro objeto environment con el tipo correcto
export const environment: Environment = {
  production: false,
  consultaClavesUrl: 'http://localhost:3000/proxy-soap',
  codigoAplicacion: 'SISACT',
  usuarioAplicacion: 'GVSHrjfLXtMfI4ZBHilGHgWb2nPjUpvJ',
  claveAplicacion: 'Q1rOk8UF3Dpk22wrBho4vQ==',
  dataPowerUrls: {
    validarComunicacion: 'http://localhost:3000/proxy-validarComunicacion',
    // Puedes agregar más URLs aquí
  },
  wsTimeOut: '30000',
  applicationCode : '109',
  leerOpcionesPorUsuarioUrl : '/api/ebsAuditoria',
  leerDatosUsuarioUrl :'/api/ebsAuditoria',
  usrDatapower: 'usrPortSiacU',
  passDatapower: 'Q@ve123456',
  dataPowerConfig: {
    consumer: 'Usuario Portal Mi Claro',
    country: 'PE',
    language: 'PE',
    system: 'validarComunicacion',
    wsIp: '172.19.84.167'
  }
};