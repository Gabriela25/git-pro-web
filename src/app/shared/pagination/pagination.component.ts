import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    
    TranslateModule
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})

export class PaginationComponent implements OnChanges {
  @Input() page: number = 1;
  @Input() lastPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();  

  paginationRange: (number | string)[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.paginationRange = this.calculateRange(this.page, this.lastPage);
  }

  private calculateRange(current: number, last: number): (number | string)[] {

    const range: (number | string)[] = [];

    range.push(current);

    if (current < last - 1) {
      range.push('...');
    }

    if (current !== last) {
      range.push(last);
    }

    return range;
  }


  goToPage(page: number) {
    if (page >= 1 && page <= this.lastPage && page !== this.page) {
      this.pageChange.emit(page);
    }
  }
}

