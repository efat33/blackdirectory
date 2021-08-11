import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() totalItems = 0;
  @Input() currentPage = 1;
  @Input() pageSize = 10;

  @Output() pageChange = new EventEmitter<number>();

  pages = [];
  totalPages = 0;
  startPage = 0;
  endPage = 0;

  initialized = false;

  constructor() {}

  ngOnInit() {
    this.setPagination();

    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.initialized) {
      this.setPagination();
    }
  }

  setPagination() {
    // calculate total pages
    const totalPages = Math.ceil(this.totalItems / this.pageSize);

    // ensure current page isn't out of range
    if (this.currentPage < 1) {
      this.currentPage = 1;
    } else if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }

    let startPage: number;
    let endPage: number;

    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (this.currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (this.currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = this.currentPage - 5;
        endPage = this.currentPage + 4;
      }
    }

    // create an array of pages to ng-repeat in the pager control
    const pages = Array.from(Array(endPage + 1 - startPage).keys()).map((i) => startPage + i);

    this.totalItems = this.totalItems;
    this.currentPage = this.currentPage;
    this.totalPages = totalPages;
    this.startPage = startPage;
    this.endPage = endPage;
    this.pages = pages;
  }

  onClickPagination(page: number) {
    this.pageChange.emit(page);
  }
}
