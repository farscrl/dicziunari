import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchModeModalComponent } from './search-mode-modal.component';

describe('SearchModeModalComponent', () => {
  let component: SearchModeModalComponent;
  let fixture: ComponentFixture<SearchModeModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), SearchModeModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchModeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
