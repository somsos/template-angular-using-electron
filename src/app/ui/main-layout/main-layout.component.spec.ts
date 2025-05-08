import { TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';

describe('MainLayoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(MainLayoutComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'mwd_calculator' title`, () => {
    const fixture = TestBed.createComponent(MainLayoutComponent);
    const app = fixture.componentInstance;
    //expect(app.title).toEqual('mwd_calculator');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(MainLayoutComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, mwd_calculator');
  });
});
