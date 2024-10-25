import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuditoriaService } from '../../core/services/auditoria.service';
import { User } from '../../core/models/user_login.model';
import { OpcionesUsuarioRequest } from '../../core/models/leerOpcionesXUsuario.model';
import { catchError, of, switchMap } from 'rxjs';
import { SoapHeader } from '../../core/models/datapower-soap.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router, private auditoriaService : AuditoriaService ) {}
  
  codigo_user : OpcionesUsuarioRequest = {cod_user: '', aplicacion: ''};
  usuario_login: User = { username: '', password: '' };
  errorMessage: string = '';

  login() {

    const header: SoapHeader = {
      username: 'usrCliFPlay',
      password: 'Q@ve123456',
      country: 'PE',
      language: 'ES',
      consumer: 'TCRM',
      system: 'OM',
      modulo: 'OM',
      pid: '201706140001',
      userId: 'usrPortSiacU',
      dispositivo: 'MOVIL',
      wsIp: '172.19.54.13',
      operation: 'leerDatosUsuario',
      timestamp: new Date().toISOString(),
      msgType: 'STRING',
      channel: 'SISAC',
      idApplication: '109',
      userApplication: 'DASDA',
      idESBTransaction: '090220180536',
      idBusinessTransaction: '09022018053612',
      startDate: new Date().toISOString()
    };

    const audit = {
      idTransaccion: '20201116103832',
      ipAplicacion: '172.19.73.221',
      aplicacion: 'SIAC PREPAGO',
      usrAplicacion: 'C12640'
    };
  
    const registroRequest = {
      transaccion: '1059',
      servicio: '8',
      ipCliente: '10.200.71.43',
      nombreCliente: '10.200.71.43',
      ipServidor: '172.19.73.221',
      nombreServidor: 'limsistecv01',
      cuentaUsuario: 'C12640',
      telefono: '988202023',
      monto: '0',
      texto: 'Consulta Teléfono/Servicio con Éxito.'
    };


    console.log("Iniciando proceso de login");
    console.log("Datos antes de la llamada:", this.usuario_login);

    const usuario = this.usuario_login.username;
    console.log("usuario:", usuario);

    this.auditoriaService.leerDatosUsuario(header, usuario).pipe(
      switchMap(codigo => {
        console.log('Codigo obtenido:', codigo);
        return this.auditoriaService.leerOpcionesPorUsuario(header, codigo).pipe(
          switchMap(opciones => {
            // Llamar al registroAuditoria después de obtener las opciones
            return this.auditoriaService.registroAuditoria(header, audit, registroRequest);
          })
        );
      }),
      catchError(error => {
        console.error('Error en leerDatosUsuario:', error);
        this.errorMessage = 'Error al leer datos del usuario: ' + error.message;
        return of(null);
      })
    ).subscribe({
      next: (opciones) => {
        if (opciones) {
          console.log('Opciones de usuario obtenidas:', opciones.data);
          this.router.navigate(['/busqueda']);
          //this.authenticate();
        } else {
          console.log('No se obtuvieron opciones de usuario');
        }
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener opciones del usuario: ' + error.message;
        console.error('Error en leerOpcionesPorUsuario:', error);
      }
    });
  }
}