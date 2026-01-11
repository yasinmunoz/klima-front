import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { KlimaService } from '../services/klima-service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Municipio } from '../interfaces/Municipio';
import { catchError, distinctUntilChanged, filter, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { Prediccion } from '../interfaces/Prediccion';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { UnitTemperature } from '../interfaces/UnitTemperature';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-prediccion-municipio',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe,
    MatGridListModule,
    MatProgressBarModule
  ],
  templateUrl: './prediccion-municipio.html',
  styleUrl: './prediccion-municipio.css',
})
export class PrediccionMunicipio implements OnInit {

  climaForm: FormGroup;

  filteredMunicipios: Observable<Municipio[]> | undefined;

  municipios: Municipio[] = [];
  municipioSelected: Municipio | undefined;

  prediccion = signal<Prediccion | undefined>(undefined);
  cargandoPrediccion: boolean = false;

  unitsTemperature: UnitTemperature[] = [
    {value: 'c', viewValue: '°C'},
    {value: 'f', viewValue: '°F'}
  ];

  constructor(
    private fb: FormBuilder,
    private klimaSvc: KlimaService,
    private toastSvc: ToastrService
  ) {
    this.climaForm = this.fb.group({
      municipio: [null, Validators.required],
      unidad: [this.unitsTemperature[0].value, Validators.required]
    });
  }

  ngOnInit() {
    this.filteredMunicipios = this.filterMunicipiosObservable();
    this.changeUnitTemperatureObservable();
  }

  displayFn = (municipio: Municipio): string => {
    if (municipio == null) return '';

    this.prediccion.set(undefined);
    this.getPrediccionMananaMunicipio(municipio.id);
    return municipio ? municipio.nombre : '';
  }

  getUnitSymbol(unit: string): string {
    return this.unitsTemperature.find(u => u.value === unit)?.viewValue || '';
  }

  getMananaDate(): Date {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return manana;
  }

  getPrediccionMananaMunicipio(municipioId: string): void {
    this.cargandoPrediccion = true;
    this.klimaSvc.getPrediccionMananaMunicipio(municipioId.replace(/^id/, ''), this.climaForm.get('unidad')?.value).subscribe({
      next: (prediccion: Prediccion) => {
        this.prediccion.set(prediccion);
        this.cargandoPrediccion = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error message:', error.message, 'Status code:', error.status);

        if (error.status === 429) {
          this.toastSvc.error('Error al obtener la prediccion. Por favor inténtelo dentro de un minuto', 'Error', {
            timeOut: 5000,
            positionClass: 'toast-top-right'
          });
        } else {
          this.toastSvc.error('Error al obtener la prediccion. Por favor, vuelve a intentarlo', 'Error', {
            timeOut: 5000,
            positionClass: 'toast-top-right'
          });
        }
      }
    });
  }

  getMatchMunicipios(municipio: string): Observable<Municipio[]> {
    return this.klimaSvc.getMatchMunicipios(municipio).pipe(
      tap(municipios => {
        this.municipios = municipios;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error message:', error.message, 'Status code:', error.status);

        this.toastSvc.error('Error al obtener la prediccion. Por favor inténtelo dentro de un minuto', 'Error', {
          timeOut: 5000,
          positionClass: 'toast-top-right'
        });

        return of([]);
      })
    );
  }

  filterMunicipiosObservable(): Observable<Municipio[]> | undefined {
    return this.climaForm.get('municipio')?.valueChanges.pipe(
      startWith(''),
      distinctUntilChanged(),
      filter(value => value.length > 0),
      switchMap(value => this.getMatchMunicipios(value))
    );
  }

  changeUnitTemperatureObservable(): void {
    this.climaForm.get('unidad')?.valueChanges.subscribe(unidad => {
      const municipio = this.climaForm.get('municipio')?.value;

      if (municipio) this.getPrediccionMananaMunicipio(municipio.id);
    });
  }

  getIconoTiempo(): string {
    const prediccionActual = this.prediccion();

    if (!prediccionActual) return '';

    const maxProbabilidad = Math.max(...prediccionActual.probPrecipitacion.map(prob => prob.probabilidad));

    if (maxProbabilidad === 0) return '/img/precipitacion-0.png';
    if (maxProbabilidad < 50) return '/img/precipitacion-50.png';
    if (maxProbabilidad < 80) return '/img/precipitacion-80.png';
    if (maxProbabilidad >= 80) return '/img/precipitacion-100.png';

    return '';
  }
}
