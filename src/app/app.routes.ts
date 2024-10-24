import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { ConsultaOfertasComponent } from './features/consulta-ofertas/consulta-ofertas.component';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'busqueda', component: ConsultaOfertasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }