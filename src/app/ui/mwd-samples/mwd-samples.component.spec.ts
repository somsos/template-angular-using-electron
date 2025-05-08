import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MwdSamplesComponent } from './mwd-samples.component';

describe('MwdSamplesComponent', () => {
  let component: MwdSamplesComponent;
  let fixture: ComponentFixture<MwdSamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MwdSamplesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MwdSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
