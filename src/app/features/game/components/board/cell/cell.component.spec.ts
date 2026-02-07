import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CellComponent } from './cell.component';
import { Cell } from '../../../../../models';

@Component({
  standalone: true,
  imports: [CellComponent],
  template: `<app-cell [cell]="testCell" />`,
})
class TestHostComponent {
  testCell: Cell = { value: 0, isPrefilled: false };
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
    hostComponent.testCell = { value: 5, isPrefilled: true };
    fixture.detectChanges();

    const cellDiv = fixture.nativeElement.querySelector('app-cell > div');
    expect(cellDiv.textContent.trim()).toBe('5');
  });

  it('should not display value when zero', () => {
    hostComponent.testCell = { value: 0, isPrefilled: false };
    fixture.detectChanges();

    const cellDiv = fixture.nativeElement.querySelector('app-cell > div');
    expect(cellDiv.textContent.trim()).toBe('');
  });

  it('should apply prefilled styling when isPrefilled is true', () => {
    hostComponent.testCell = { value: 7, isPrefilled: true };
    fixture.detectChanges();

    const cellDiv = fixture.nativeElement.querySelector('app-cell > div');
    expect(cellDiv.classList.contains('bg-gray-100')).toBe(true);
    expect(cellDiv.classList.contains('font-bold')).toBe(true);
  });

  it('should apply editable styling when isPrefilled is false', () => {
    hostComponent.testCell = { value: 3, isPrefilled: false };
    fixture.detectChanges();

    const cellDiv = fixture.nativeElement.querySelector('app-cell > div');
    expect(cellDiv.classList.contains('bg-white')).toBe(true);
    expect(cellDiv.classList.contains('font-bold')).toBe(false);
  });
});
