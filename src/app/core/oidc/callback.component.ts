// callback.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './autenticacion.service';
@Component({
  selector : 'app-callback',
  template: '<div>Procesando autenticación...</div>'
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const state = params['state'];
      
      if (code && state) {
        this.authService.handleCallback(code, state).subscribe(success => {
          if (success) {
            this.router.navigate(['/login']); // Redirige a la página principal
          } else {
            this.router.navigate(['/error']); // Redirige al login si hay error
          }
        });
      }
    });
  }
}