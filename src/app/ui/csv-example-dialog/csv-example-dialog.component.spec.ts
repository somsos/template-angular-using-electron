import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvExampleDialogComponent } from './csv-example-dialog.component';

describe('CsvExampleDialogComponent', () => {
  let component: CsvExampleDialogComponent;
  let fixture: ComponentFixture<CsvExampleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsvExampleDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvExampleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
