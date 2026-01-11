import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./prediccion-municipio/pages/prediccion-municipio').then(m => m.PrediccionMunicipio)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
