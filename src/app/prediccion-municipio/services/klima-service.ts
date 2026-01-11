import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Municipio } from '../interfaces/Municipio';
import { Prediccion } from '../interfaces/Prediccion';

@Injectable({
  providedIn: 'root',
})
export class KlimaService {

  private readonly HOST: string = 'http://localhost:8080'
  private readonly MUNICIPIOS_PATH: string = '/municipios';
  private readonly PREDICCIONES_PATH: string = '/predicciones';

  constructor(
    private http: HttpClient
  ) {}

  getMatchMunicipios(municipio: string): Observable<Municipio[]> {

    const params = new HttpParams().set('municipio', municipio);

    return this.http.get<Municipio[]>(`${this.HOST}${this.MUNICIPIOS_PATH}`, { params });
  }

  getPrediccionMananaMunicipio(municipioId: string, unitTemperature: string): Observable<Prediccion> {

    const params = new HttpParams()
      .set('municipioId', municipioId)
      .set('unitTemperature', unitTemperature);

    return this.http.get<Prediccion>(`${this.HOST}${this.PREDICCIONES_PATH}`, { params });
  }


}
