import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Week9Page } from './week9.page';

describe('Week9Page', () => {
  let component: Week9Page;
  let fixture: ComponentFixture<Week9Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Week9Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Week9Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
