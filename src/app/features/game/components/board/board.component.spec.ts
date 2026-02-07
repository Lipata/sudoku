import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BoardComponent } from './board.component';
import { Board } from '../../../../models';
import { apiBoardToBoard } from '../../../../utils/board.util';

@Component({
  standalone: true,
  imports: [BoardComponent],
  template: `<app-board [board]="testBoard" />`,
})
class TestHostComponent {
  testBoard: Board = apiBoardToBoard([
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ]);
}

describe('BoardComponent', () => {
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

  it('should render 81 cells (9x9 grid)', () => {
    const cells = fixture.nativeElement.querySelectorAll('app-cell');
    expect(cells.length).toBe(81);
  });

  it('should display prefilled cell values', () => {
    const cells = fixture.nativeElement.querySelectorAll('app-cell');
    // First cell should show 5
    expect(cells[0].textContent.trim()).toBe('5');
    // Second cell should show 3
    expect(cells[1].textContent.trim()).toBe('3');
  });

  it('should not display value for empty cells', () => {
    const cells = fixture.nativeElement.querySelectorAll('app-cell');
    // Third cell (index 2) is 0, should be empty
    expect(cells[2].textContent.trim()).toBe('');
  });

  it('should apply prefilled styling to non-zero cells', () => {
    const cellContents = fixture.nativeElement.querySelectorAll('app-cell > div');
    // First cell is prefilled (value 5)
    expect(cellContents[0].classList.contains('bg-gray-100')).toBe(true);
    expect(cellContents[0].classList.contains('font-bold')).toBe(true);
  });

  it('should not apply prefilled styling to empty cells', () => {
    const cellContents = fixture.nativeElement.querySelectorAll('app-cell > div');
    // Third cell is empty (value 0)
    expect(cellContents[2].classList.contains('bg-gray-100')).toBe(false);
    expect(cellContents[2].classList.contains('font-bold')).toBe(false);
  });

});
