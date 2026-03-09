import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DictionaryModalComponent } from './dictionary-modal.component';

describe('DictionaryModalComponent', () => {
  let component: DictionaryModalComponent;
  let fixture: ComponentFixture<DictionaryModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), DictionaryModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DictionaryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
