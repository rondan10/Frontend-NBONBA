export const environment = {
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
  leerDatosUsuarioUrl: '/api/v1.0/MIG1_plataforma-empresarial/enterprise_Domain/administrative/auditoria/leerDatosUsuario',
  leerOpcionesPorUsuarioUrl: '/api/v1.0/MIG1_plataforma-empresarial/enterprise_Domain/administrative/auditoria/leerOpcionesPorUsuario',
  registroAuditoriaUrl : 'api/v1.0/MIG1_plataforma-empresarial/enterprise_Domain/administrative/auditoria/registroAuditoria',
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