import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { ConjugationPersonalComponent } from './conjugation-personal.component';

describe('ConjugationPersonalComponent', () => {
  let component: ConjugationPersonalComponent;
  let fixture: ComponentFixture<ConjugationPersonalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ConjugationPersonalComponent],
      providers: [provideIonicAngular()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConjugationPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
