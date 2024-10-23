import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuditoriaService } from '../../core/services/auditoria.service';
import { User } from '../../core/models/user_login.model';
import { OpcionesUsuarioRequest } from '../../core/models/leerOpcionesXUsuario.model';
import { catchError, of, switchMap } from 'rxjs';
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

    console.log("Iniciando proceso de login");
    console.log("Datos antes de la llamada:", this.usuario_login);

    const usuario = this.usuario_login.username;
    console.log("usuario:", usuario);

    this.auditoriaService.leerDatosUsuario(usuario).pipe(
      switchMap(codigo => {
        console.log('Codigo obtenido:', codigo);
        return this.auditoriaService.leerOpcionesPorUsuario(codigo);
      }),
      catchError(error => {
        console.error('Error en leerDatosUsuario:', error);
        this.errorMessage = 'Error al leer datos del usuario: ' + error.message;
        return of(null);
      })
    ).subscribe({
      next: (opciones) => {
        if (opciones) {
          console.log('Opciones de usuario obtenidas:', opciones);
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