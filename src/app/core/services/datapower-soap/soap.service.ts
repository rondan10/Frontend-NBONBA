// soap.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SoapHeader, AccesoRequest } from '../../models/datapower-soap.model';

@Injectable({
  providedIn: 'root'
})
export class SoapService {
  constructor(private http: HttpClient) {}

  /*private createAuthorizationHeader(username: string, password: string): string {
    const credentials = `${username}:${password}`;
    const encodedCredentials = btoa(credentials); // Encode to base64
    return `Basic ${encodedCredentials}`;
  }*/

  buildSoapRequest(header: SoapHeader, requestBody: AccesoRequest, operation: string, namespaces : any, requestConfig: { prefix: string, requestElement: string }): string {

    const namespaceString = Object.entries(namespaces).map(([prefix, url]) => `xmlns:${prefix}="${url}"`).join(' ');

    return `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                       ${namespaceString}>
        <soapenv:Header>
          <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
            <wsse:UsernameToken>
              <wsse:Username>${header.username}</wsse:Username>
              <wsse:Password>${header.password}</wsse:Password>
            </wsse:UsernameToken>
          </wsse:Security>
          <v1:HeaderRequest>
            <country>${header.country}</country>
            <language>${header.language}</language>
            <consumer>${header.consumer}</consumer>
            <system>${header.system}</system>
            <modulo>${header.modulo}</modulo>
            <pid>${header.pid}</pid>
            <userId>${header.userId}</userId>
            <dispositivo>${header.dispositivo}</dispositivo>
            <wsIp>${header.wsIp}</wsIp>
            <operation>${operation}</operation>
            <timestamp>${header.timestamp}</timestamp>
            <msgType>${header.msgType}</msgType>
          </v1:HeaderRequest>
          <v2:headerRequest>
            <v2:channel>${header.channel}</v2:channel>
            <v2:idApplication>${header.idApplication ?? ''}</v2:idApplication>
            <v2:userApplication>${header.userApplication}</v2:userApplication>
            <v2:userSession>${header.userSession ?? ''}</v2:userSession>
            <v2:idESBTransaction>${header.idESBTransaction}</v2:idESBTransaction>
            <v2:idBusinessTransaction>${header.idBusinessTransaction}</v2:idBusinessTransaction>
            <v2:startDate>${header.startDate}</v2:startDate>
            <v2:additionalNode>${header.additionalNode ?? ''}</v2:additionalNode>
          </v2:headerRequest>
        </soapenv:Header>
         <soapenv:Body>
          <ws:${operation}>
            <${requestConfig.prefix}:${requestConfig.requestElement}>
              <${requestConfig.prefix}:usuario>${requestBody.usuario}</${requestConfig.prefix}:usuario>
              <${requestConfig.prefix}:aplicacion>${requestBody.aplicacion}</${requestConfig.prefix}:aplicacion>
            </${requestConfig.prefix}:${requestConfig.requestElement}>
          </ws:${operation}>
        </soapenv:Body>
      </soapenv:Envelope>`;
  }

  /*registro */
  buildRegistroAuditoriaRequest(header: SoapHeader, audit: any, registroRequest: any): string {
    const namespaces = {
      soapenv: "http://schemas.xmlsoap.org/soap/envelope/",
      v1: "http://claro.com.pe/generic/messageFormat/v1.0/",
      v2: "http://claro.com.pe/esb/data/commonBusinessEntities/claroGenericHeaders/v2/",
      reg: "http://service.eai.auditoria.claro.com.pe/RegistroAuditoriaWS"
    };
  
    const namespaceString = Object.entries(namespaces).map(([prefix, url]) => `xmlns:${prefix}="${url}"`).join(' ');
  
    return `
      <soapenv:Envelope ${namespaceString}>
        <soapenv:Header>
          <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
            <wsse:UsernameToken>
              <wsse:Username>${header.username}</wsse:Username>
              <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">${header.password}</wsse:Password>
            </wsse:UsernameToken>
          </wsse:Security>
          <v1:HeaderRequest>
            <country>${header.country}</country>
            <language>${header.language}</language>
            <consumer>${header.consumer}</consumer>
            <system>${header.system}</system>
            <modulo>${header.modulo}</modulo>
            <pid>${header.pid}</pid>
            <userId>${header.userId}</userId>
            <dispositivo>${header.dispositivo}</dispositivo>
            <wsIp>${header.wsIp}</wsIp>
            <operation>registroAuditoria</operation>
            <timestamp>${header.timestamp}</timestamp>
            <msgType>${header.msgType}</msgType>
            <VarArg>
              <Arg>
                <key>000</key>
                <value>000</value>
              </Arg>
            </VarArg>
          </v1:HeaderRequest>
          <v2:headerRequest>
            <v2:channel>${header.channel}</v2:channel>
            <v2:idApplication>${header.idApplication ?? ''}</v2:idApplication>
            <v2:userApplication>${header.userApplication}</v2:userApplication>
            <v2:userSession>${header.userSession ?? ''}</v2:userSession>
            <v2:idESBTransaction>${header.idESBTransaction}</v2:idESBTransaction>
            <v2:idBusinessTransaction>${header.idBusinessTransaction}</v2:idBusinessTransaction>
            <v2:startDate>${header.startDate}</v2:startDate>
            <v2:additionalNode>${header.additionalNode ?? ''}</v2:additionalNode>
          </v2:headerRequest>
        </soapenv:Header>
        <soapenv:Body>
          <reg:registroAuditoria>
            <reg:Audit>
              <reg:idTransaccion>${audit.idTransaccion}</reg:idTransaccion>
              <reg:ipAplicacion>${audit.ipAplicacion}</reg:ipAplicacion>
              <reg:aplicacion>${audit.aplicacion}</reg:aplicacion>
              <reg:usrAplicacion>${audit.usrAplicacion}</reg:usrAplicacion>
            </reg:Audit>
            <reg:RegistroRequest>
              <reg:transaccion>${registroRequest.transaccion}</reg:transaccion>
              <reg:servicio>${registroRequest.servicio}</reg:servicio>
              <reg:ipCliente>${registroRequest.ipCliente}</reg:ipCliente>
              <reg:nombreCliente>${registroRequest.nombreCliente}</reg:nombreCliente>
              <reg:ipServidor>${registroRequest.ipServidor}</reg:ipServidor>
              <reg:nombreServidor>${registroRequest.nombreServidor}</reg:nombreServidor>
              <reg:cuentaUsuario>${registroRequest.cuentaUsuario}</reg:cuentaUsuario>
              <reg:telefono>${registroRequest.telefono}</reg:telefono>
              <reg:monto>${registroRequest.monto}</reg:monto>
              <reg:texto>${registroRequest.texto}</reg:texto>
            </reg:RegistroRequest>
            <reg:ListaOpcionalRequest>
              <reg:RequestOpcional>
                <reg:clave></reg:clave>
                <reg:valor></reg:valor>
              </reg:RequestOpcional>
            </reg:ListaOpcionalRequest>
          </reg:registroAuditoria>
        </soapenv:Body>
      </soapenv:Envelope>`;
  }

  sendSoapRequest(url: string, soapRequest: string, username: string, password: string): Observable<string> {
    const authorizationHeader =  'Basic dXNyQmFqYUFjdGl2b3NGaWpvczpRQHZlMTIzNDU2';//this.createAuthorizationHeader(username, password);
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'Accept': 'text/xml',
      'Authorization': authorizationHeader
    });

    return this.http.post(url, soapRequest, { headers, responseType: 'text' });
  }
}
