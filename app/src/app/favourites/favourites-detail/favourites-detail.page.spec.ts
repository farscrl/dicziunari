import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { FavouritesDetailPage } from './favourites-detail.page';

describe('FavouritesDetailPage', () => {
  let component: FavouritesDetailPage;
  let fixture: ComponentFixture<FavouritesDetailPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FavouritesDetailPage],
      providers: [provideIonicAngular()],
    }).compileComponents();

    fixture = TestBed.createComponent(FavouritesDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
