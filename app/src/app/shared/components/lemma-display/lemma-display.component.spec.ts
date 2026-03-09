import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LemmaDisplayComponent } from './lemma-display.component';

describe('LemmaDisplayComponent', () => {
  let component: LemmaDisplayComponent;
  let fixture: ComponentFixture<LemmaDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), LemmaDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LemmaDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
