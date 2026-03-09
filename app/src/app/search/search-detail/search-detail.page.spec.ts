import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { SearchDetailPage } from './search-detail.page';

describe('SearchDetailPage', () => {
  let component: SearchDetailPage;
  let fixture: ComponentFixture<SearchDetailPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SearchDetailPage],
      providers: [provideIonicAngular()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
