import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrediccionMunicipio } from './prediccion-municipio';

describe('PrediccionMunicipio', () => {
  let component: PrediccionMunicipio;
  let fixture: ComponentFixture<PrediccionMunicipio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrediccionMunicipio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrediccionMunicipio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
