// login.component.ts
import { Component } from '@angular/core';
import { AuthService } from './autenticacion.service';

@Component({
  selector: 'app-autentica',
  template: `
    <button (click)="login()">Iniciar sesión</button>
  `
})
export class AutenticaComponent {
  constructor(private authService: AuthService) {}

  login() {
    this.authService.login();
  }
}