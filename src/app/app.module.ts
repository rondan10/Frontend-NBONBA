import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app.routes';
import { LoginComponent } from './features/login/login.component';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { ConsultaOfertasComponent } from "./features/consulta-ofertas/consulta-ofertas.component";

@NgModule({
  declarations: [
    LoginComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    ConsultaOfertasComponent
],
  providers: [
    provideHttpClient()  
  ],
  bootstrap: [AppComponent]  
})
export class AppModule { }