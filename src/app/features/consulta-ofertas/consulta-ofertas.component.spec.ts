import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaOfertasComponent } from './consulta-ofertas.component';

describe('ConsultaOfertasComponent', () => {
  let component: ConsultaOfertasComponent;
  let fixture: ComponentFixture<ConsultaOfertasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaOfertasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaOfertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
