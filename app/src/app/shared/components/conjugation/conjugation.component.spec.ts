import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConjugationComponent } from './conjugation.component';

describe('ConjugationComponent', () => {
  let component: ConjugationComponent;
  let fixture: ComponentFixture<ConjugationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ConjugationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConjugationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
