import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


/*
html


<ion-header>
  <ion-toolbar color="primary">
    <ion-title>Cálculo de IMC</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <h2>Preencha os campos abaixo para calcular seu IMC</h2>

  <ion-item>
    <ion-label position="floating">Peso (em kg)</ion-label>
    <ion-input [(ngModel)]="peso" type="number" placeholder="Insira seu peso"></ion-input>
  </ion-item>

  <ion-item>
    <ion-label position="floating">Altura (em metros)</ion-label>
    <ion-input [(ngModel)]="altura" type="number" placeholder="Insira sua altura"></ion-input>
  </ion-item>

  <ion-button expand="full" (click)="calcularIMC()">Calcular</ion-button>

  <div *ngIf="imc">
    <h3>Seu IMC: {{ imc | number: '1.2-2' }}</h3>
  </div>
</ion-content>

ts
export class HomePage {
  peso?: number;
  altura?: number;
  imc?: number;
  constructor() {}

  calcularIMC() {
    if (this.peso && this.altura) {
      this.imc = this.peso / (this.altura * this.altura);
    }
  }
}
*/
