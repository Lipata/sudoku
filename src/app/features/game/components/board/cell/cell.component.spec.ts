import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { CellComponent } from './cell.component';
import { Cell } from '../../../../../models';

@Component({
  standalone: true,
  imports: [CellComponent],
  template: `<app-cell [cell]="testCell()" [row]="row()" [col]="col()" />`,
})
class TestHostComponent {
  testCell = signal<Cell>({ value: 0, isPrefilled: false });
  row = signal(0);
  col = signal(0);
}

describe('CellComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should display value when not zero', () => {
    hostComponent.testCell.set({ value: 5, isPrefilled: true });
    fixture.detectChanges();

    const cellDiv = fixture.nativeElement.querySelector('app-cell > div');
    expect(cellDiv.textContent.trim()).toBe('5');
  });

  it('should not display value when zero', () => {
    hostComponent.testCell.set({ value: 0, isPrefilled: false });
    fixture.detectChanges();

    const cellDiv = fixture.nativeElement.querySelector('app-cell > div');
    expect(cellDiv.textContent.trim()).toBe('');
  });

  it('should apply prefilled styling when isPrefilled is true', () => {
    hostComponent.testCell.set({ value: 7, isPrefilled: true });
    fixture.detectChanges();

    const cellDiv = fixture.nativeElement.querySelector('app-cell > div');
    expect(cellDiv.classList.contains('bg-gray-100')).toBe(true);
    expect(cellDiv.classList.contains('font-bold')).toBe(true);
  });

  it('should apply editable styling when isPrefilled is false', () => {
    hostComponent.testCell.set({ value: 3, isPrefilled: false });
    fixture.detectChanges();

    const cellDiv = fixture.nativeElement.querySelector('app-cell > div');
    expect(cellDiv.classList.contains('bg-white')).toBe(true);
    expect(cellDiv.classList.contains('font-bold')).toBe(false);
  });

  it('should apply thick right border at column 2 (3rd column)', () => {
    hostComponent.col.set(2);
    fixture.detectChanges();

    const cellDiv = fixture.nativeElement.querySelector('app-cell > div');
    expect(cellDiv.classList.contains('border-r-2')).toBe(true);
  });

  it('should apply thick bottom border at row 2 (3rd row)', () => {
    hostComponent.row.set(2);
    fixture.detectChanges();

    const cellDiv = fixture.nativeElement.querySelector('app-cell > div');
    expect(cellDiv.classList.contains('border-b-2')).toBe(true);
  });

  it('should not apply thick right border at last column', () => {
    hostComponent.col.set(8);
    fixture.detectChanges();

    const cellDiv = fixture.nativeElement.querySelector('app-cell > div');
    expect(cellDiv.classList.contains('border-r-2')).toBe(false);
  });

  it('should not apply thick bottom border at last row', () => {
    hostComponent.row.set(8);
    fixture.detectChanges();

    const cellDiv = fixture.nativeElement.querySelector('app-cell > div');
    expect(cellDiv.classList.contains('border-b-2')).toBe(false);
  });
});
