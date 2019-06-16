import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map, tap, switchMap, skip, catchError } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject, of } from 'rxjs';
import { Transaction } from 'src/app/interfaces/transaction';
import { TransactionService } from 'src/app/services/transaction.service';


function getAmountStats(data) {
  const total = data
  ?
  data
  .map(transaction => transaction.amount)
  .reduce((prev, next) => +(prev + next).toFixed(10), 0)
  :
  0;
  const avarage = total && data.length ? total / data.length : 0;
  return {total, avarage: avarage.toFixed(2)};
}

/**
 * Data source for the Table view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TableDataSource extends DataSource<Transaction> {
  data: Transaction[] = [];
  totalAmount = '0';
  avarageAmount = '0';
  paginator: MatPaginator;
  sort: MatSort;
  selection: SelectionModel<Transaction>;
  actionSubject = new BehaviorSubject({action: null, data: null});
  action$ = this.actionSubject.asObservable();
  constructor(private transactionService: TransactionService) {
    super();
  }

  doAction(name, data) {
    this.actionSubject.next({action: name, data});
  }

  updateStats() {
    const {total, avarage} = getAmountStats(this.data);
    this.avarageAmount = avarage;
    this.totalAmount = total;
  }

  removeTransaction(id): Observable<Transaction[]> {
    return this.transactionService.removeMany(id).pipe(
      map(() => {
        this.selection.clear();
        return this.data.filter(transaction => {
          if (Array.isArray(id)) {
            return !id.includes(transaction.id);
          } else {
            return transaction.id !== id;
          }
        })
      })
    );
  }
  uploadTransactions(file): Observable<Transaction[]> {
    const formData = new FormData();
    formData.set('file', file, file.name);
    return this.transactionService.upload(formData).pipe(
      map(res => this.data.concat(res)),
      catchError(() => observableOf(this.data))
    );
  }

  createTransaction(data): Observable<Transaction[]> {
    return this.transactionService.create(data).pipe(
      map(res => this.data.concat(res))
    );
  }

  updateTransaction(data: Transaction): Observable<Transaction[]> {
    return this.transactionService.update(data.id, data).pipe(
      map(res => this.data.map(transaction => transaction.id === data.id ? data : transaction))
    );
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Transaction[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      this.action$.pipe(
        switchMap(payload => {
          let request: Observable<Transaction[]>;
          switch (payload.action) {
            case 'remove':
              request = this.removeTransaction(payload.data);
              break;
            case 'upload':
              request = this.uploadTransactions(payload.data);
              break;
            case 'create':
              request = this.createTransaction(payload.data);
              break;
            case 'update':
              request = this.updateTransaction(payload.data);
              break;
            default:
              return observableOf([]);
          }
          return request.pipe(
            tap(data => {
              this.data = data;
              this.updateStats();
            })
          );
        })
      ),
      this.transactionService.getMany().pipe(
        tap(({docs}) => {
          this.data = docs;
          this.updateStats();
        })
      ),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(
      map(() => {
        return this.getPagedData(this.getSortedData([...this.data]));
      })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Transaction[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Transaction[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      return compare(a[this.sort.active], b[this.sort.active], isAsc);
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
