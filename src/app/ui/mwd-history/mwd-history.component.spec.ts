import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MwdHistoryComponent } from './mwd-history.component';

describe('MwdHistoryComponent', () => {
  let component: MwdHistoryComponent;
  let fixture: ComponentFixture<MwdHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MwdHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MwdHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
