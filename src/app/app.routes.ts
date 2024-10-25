import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { ConsultaOfertasComponent } from './features/consulta-ofertas/consulta-ofertas.component';
import { AutenticaComponent } from './core/oidc/autentica.component';


export const routes: Routes = [
  { path: '', component : AutenticaComponent},
  { path: 'login', component: LoginComponent },
  { path: 'busqueda', component: ConsultaOfertasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }