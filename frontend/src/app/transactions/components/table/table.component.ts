import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTable, MatDialog } from '@angular/material';
import { TableDataSource } from './table-datasource';
import { TransactionService } from 'src/app/services/transaction.service';
import { Transaction } from 'src/app/interfaces/transaction';
import { ConfirmComponent } from '../confirm/confirm.component';
import { SelectionModel } from '@angular/cdk/collections';
import { randomString, randomNumber } from 'src/utils/helpers';
import { EditTransactionModalComponent } from '../edit-transaction-modal/edit-transaction-modal.component';

function createRandomTransaction(): Transaction {
  const randBool = randomNumber(0, 1);
  const year = 1000 * 60 * 24 * 365;
  const randDateRange = randomNumber(0, year);
  const randomTimestamp = randBool ? randDateRange : -randDateRange;
  return {
    id: randomNumber(1, Number.MAX_SAFE_INTEGER),
    cardHolderHash: randomString(),
    datetime: new Date(Date.now() + randomTimestamp),
    amount: parseFloat(randomNumber(0, 1000000) + '.' + randomNumber(0, 99))
  };
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<Transaction>;
  dataSource: TableDataSource;
  selection = new SelectionModel<Transaction>(true, []);
  get selectedIds() {
    return this.selection.selected.map(s => s.id);
  }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select', 'id', 'cardHolderHash', 'datetime', 'amount', 'actions'];
  file;
  constructor(
    private transactionService: TransactionService,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    this.dataSource = new TableDataSource(this.transactionService);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.selection = this.selection;
    this.table.dataSource = this.dataSource;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  chooseCSV($event) {
    const [file] = $event.target.files;
    this.file = file;
  }
  uploadCSV() {
    if (this.file) {
      this.dataSource.doAction('upload', this.file);
      this.file = null;
    }
  }
  removeTransaction(ids) {
    const modal = this.dialog.open(ConfirmComponent, {
      data: {
        name: 'Confirmation',
        question: 'Do you want to delete this transaction?'
      }
    });
    modal.afterClosed().subscribe({
      next: answer => {
        if (answer) {
          this.dataSource.doAction('remove', ids);
        }
      },
      complete: () => {}
    });
  }

  addRandomTransaction() {
    this.dataSource.doAction('create', createRandomTransaction());
  }

  updateTransaction(transaction) {
    const modal = this.dialog.open(EditTransactionModalComponent, {
      data: {
        form: transaction
      }
    });
    modal.afterClosed().subscribe({
      next: updated => {
        if (updated) {
          this.dataSource.doAction('update', {...transaction, ...updated});
        }
      },
      complete: () => {}
    });
  }
}
