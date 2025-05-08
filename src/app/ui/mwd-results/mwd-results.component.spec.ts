import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MwdResultsComponent } from './mwd-results.component';

describe('MwdResultsComponent', () => {
  let component: MwdResultsComponent;
  let fixture: ComponentFixture<MwdResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MwdResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MwdResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
