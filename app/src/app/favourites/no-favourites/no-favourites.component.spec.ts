import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NoFavouritesComponent } from './no-favourites.component';

describe('NoFavouritesComponent', () => {
  let component: NoFavouritesComponent;
  let fixture: ComponentFixture<NoFavouritesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), NoFavouritesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoFavouritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
