import { Component } from '@angular/core';

@Component({
  selector: 'app-consulta-ofertas',
  standalone: true,
  imports: [],
  templateUrl: './consulta-ofertas.component.html',
  styleUrl: './consulta-ofertas.component.css'
})
export class ConsultaOfertasComponent {

  sessionInfo: string = '';

  setSessionInfo() {
    const now = new Date();
    this.sessionInfo = `Session ID : ${now.getTime()} ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }

}
