import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Week8Page } from './week8.page';

describe('Week8Page', () => {
  let component: Week8Page;
  let fixture: ComponentFixture<Week8Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Week8Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Week8Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
