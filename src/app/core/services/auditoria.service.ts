import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
  private baseUrl = environment.leerDatosUsuarioUrl;;  
  private applicationCode = environment.applicationCode;

  constructor(private http: HttpClient) {}

  private parseXMLResponse(xmlString: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
      parser.parseString(xmlString, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  leerDatosUsuario(usuario: string): Observable<string> {
    const soapRequest = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://pe/com/claro/esb/services/auditoria/ws" xmlns:acc="http://pe/com/claro/esb/services/auditoria/schemas/accesos/Acceso.xsd">
        <soapenv:Header/>
        <soapenv:Body>
          <ws:leerDatosUsuario>
            <acc:AccesoRequest>
              <acc:usuario>${usuario}</acc:usuario>
              <acc:aplicacion>${this.applicationCode}</acc:aplicacion>
            </acc:AccesoRequest>
          </ws:leerDatosUsuario>
        </soapenv:Body>
      </soapenv:Envelope>`;

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'Accept': 'text/xml'
    });

    return this.http.post(this.baseUrl, soapRequest, { headers, responseType: 'text' })
      .pipe(
        switchMap(response => {
          console.log('Raw XML response:', response);
          return from(this.parseXMLResponse(response));
        }),
        map(parsedResponse => {
          console.log('Parsed XML response:', JSON.stringify(parsedResponse, null, 2));
          
          // Intentar encontrar el código en la estructura XML
          let codigo = this.findCodigoInResponse(parsedResponse);
          
          if (!codigo) {
            throw new Error('No se pudo encontrar el código en la respuesta XML');
          }
          
          return codigo;
        }),
        catchError(error => {
          console.error('Error in leerDatosUsuario:', error);
          return throwError(() => new Error('Error processing response: ' + error.message));
        })
      );
  }

  private findCodigoInResponse(obj: any): string | null {
    if (typeof obj !== 'object' || obj === null) {
      return null;
    }

    for (let key in obj) {
      if (key.toLowerCase().includes('codigo') || key.toLowerCase().includes('code')) {
        return obj[key].toString();
      }
      if (typeof obj[key] === 'object') {
        let result = this.findCodigoInResponse(obj[key]);
        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  leerOpcionesPorUsuario(codigo: string): Observable<any> {
    const soapRequest = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                       xmlns:ws="http://pe/com/claro/esb/services/auditoria/ws" 
                       xmlns:opc="http://pe/com/claro/esb/services/auditoria/schemas/accesos/OpcionesUsuario.xsd">
        <soapenv:Header/>
        <soapenv:Body>
          <ws:leerOpcionesPorUsuario>
            <opc:OpcionesUsuarioRequest>
              <opc:usuario>${codigo}</opc:usuario>
              <opc:aplicacion>${this.applicationCode}</opc:aplicacion>
            </opc:OpcionesUsuarioRequest>
          </ws:leerOpcionesPorUsuario>
        </soapenv:Body>
      </soapenv:Envelope>`;

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'Accept': 'text/xml'
    });

    return this.http.post(this.baseUrl, soapRequest, { headers, responseType: 'text' });
  }
}