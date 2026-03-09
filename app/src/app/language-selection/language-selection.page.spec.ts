import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { LanguageSelectionPage } from './language-selection.page';

describe('LanguageSelectionPage', () => {
  let component: LanguageSelectionPage;
  let fixture: ComponentFixture<LanguageSelectionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LanguageSelectionPage],
      providers: [provideIonicAngular()],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
