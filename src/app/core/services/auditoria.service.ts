import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SoapService } from './datapower-soap/soap.service';
import { SoapHeader, AccesoRequest } from '../models/datapower-soap.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  constructor(private soapService: SoapService) {}

  private parseXMLResponse(xmlString: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        const result = this.xmlToJson(xmlDoc.documentElement);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }

  // Función auxiliar para convertir XML a JSON
  private xmlToJson(node: Element): any {
    const result: any = {};

    // Procesar atributos
    if (node.hasAttributes()) {
      const attrs = node.attributes;
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        result[attr.nodeName] = attr.nodeValue;
      }
    }

    // Procesar nodos hijo
    let hasChildren = false;
    if (node.hasChildNodes()) {
      const children = node.childNodes;
      for (let i = 0; i < children.length; i++) {
        const item = children[i];
        if (item.nodeType === Node.ELEMENT_NODE) {
          hasChildren = true;
          const childElement = item as Element;
          const nodeName = childElement.nodeName;
          
          if (typeof(result[nodeName]) === 'undefined') {
            result[nodeName] = this.xmlToJson(childElement);
          } else {
            if (!Array.isArray(result[nodeName])) {
              const tmp = result[nodeName];
              result[nodeName] = [tmp];
            }
            result[nodeName].push(this.xmlToJson(childElement));
          }
        } else if (item.nodeType === Node.TEXT_NODE && item.nodeValue?.trim()) {
          // Solo guardar texto si no está vacío
          return item.nodeValue.trim();
        }
      }
    }

    return hasChildren ? result : node.textContent?.trim() || '';
  }

  leerDatosUsuario(header: SoapHeader, usuario: string): Observable<string> {
    const accesoRequest: AccesoRequest = { usuario, aplicacion: environment.applicationCode };
    const namespaces = {
      ws: "http://pe/com/claro/esb/services/auditoria/ws",
      acc: "http://pe/com/claro/esb/services/auditoria/schemas/accesos/Acceso.xsd",
      v1: "http://claro.com.pe/generic/messageFormat/v1.0/",
      v2: "http://claro.com.pe/esb/data/commonBusinessEntities/claroGenericHeaders/v2/"
    };
    const requestConfig = { prefix: 'acc', requestElement: 'AccesoRequest' };
    const soapRequest = this.soapService.buildSoapRequest(header, accesoRequest, 'leerDatosUsuario', namespaces, requestConfig);

    return this.soapService.sendSoapRequest(
      environment.leerDatosUsuarioUrl,
      soapRequest,
      header.username,
      header.password
    )
    .pipe(
      switchMap(response => from(this.parseXMLResponse(response))),
      map(parsedResponse => {
        const codigo = this.findCodigoInResponse(parsedResponse);
        if (codigo === null) {
          throw new Error('Código no encontrado en la respuesta');
        }
        return codigo;
      }),
      catchError(error => throwError(() => new Error('Error processing response: ' + error.message)))
    );
  }

  private findCodigoInResponse(obj: any): string | null {
    if (typeof obj !== 'object' || obj === null) {
      return null;
    }

    for (let key in obj) {
      if (key.toLowerCase().includes('codigo')) {
        return obj[key].toString();
      }
      if (typeof obj[key] === 'object') {
        const result = this.findCodigoInResponse(obj[key]);
        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  leerOpcionesPorUsuario(header: SoapHeader, codigo: string): Observable<any> {
    const accesoRequest: AccesoRequest = { usuario: codigo, aplicacion: environment.applicationCode };

    const namespaces = {
      ws: "http://pe/com/claro/esb/services/auditoria/ws",
      opc: "http://pe/com/claro/esb/services/auditoria/schemas/accesos/OpcionesUsuario.xsd",
      v1: "http://claro.com.pe/generic/messageFormat/v1.0/",
      v2: "http://claro.com.pe/esb/data/commonBusinessEntities/claroGenericHeaders/v2/"
    };

    const requestConfig = { prefix: 'opc', requestElement: 'OpcionesUsuarioRequest' };
    const soapRequest = this.soapService.buildSoapRequest(header, accesoRequest, 'leerOpcionesPorUsuario', namespaces, requestConfig);

    return this.soapService.sendSoapRequest(
      environment.leerOpcionesPorUsuarioUrl,
      soapRequest,
      header.username,
      header.password
    );
  }

  registroAuditoria(header: SoapHeader, audit: any, registroRequest: any): Observable<any> {
    const soapRequest = this.soapService.buildRegistroAuditoriaRequest(header, audit, registroRequest);
  
    return this.soapService.sendSoapRequest(
      environment.registroAuditoriaUrl,
      soapRequest,
      header.username,
      header.password
    ).pipe(
      catchError(error => throwError(() => new Error('Error processing registroAuditoria response: ' + error.message)))
    );
  }
}