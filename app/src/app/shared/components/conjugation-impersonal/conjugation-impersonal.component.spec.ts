import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { ConjugationImpersonalComponent } from './conjugation-impersonal.component';

describe('ConjugationImpersonalComponent', () => {
  let component: ConjugationImpersonalComponent;
  let fixture: ComponentFixture<ConjugationImpersonalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ConjugationImpersonalComponent],
      providers: [provideIonicAngular()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConjugationImpersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
