import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../interfaces/transaction';

const ENDPOINT = '/api/transactions';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private http: HttpClient) { }
  upload(data): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(`${ENDPOINT}/upload`, data);
  }
  create(transaction: Transaction): Observable<Transaction> {
    return this.http.post(ENDPOINT, transaction);
  }
  getMany(page = '', pageSize = '', sortBy = '', sortDir = ''): Observable<any> {
    const params = new HttpParams({fromObject: {
      page: page + '',
      pageSize: pageSize + '',
      sortBy,
      sortDir
    }});
    return this.http.get<Transaction[]>(ENDPOINT, {params});
  }
  getOne(id: string | number): Observable<Transaction> {
    return this.http.get<Transaction>(`${ENDPOINT}/${id}`);
  }
  update(id: string | number, transaction: Transaction): Observable<Transaction> {
    return this.http.patch<Transaction>(`${ENDPOINT}/${id}`, transaction);
  }
  removeOne(id: string | number): Observable<any> {
    return this.http.delete<any>(`${ENDPOINT}/${id}`);
  }
  removeMany(ids: string[] | number[]): Observable<any> {
    return this.http.request<any>('delete', ENDPOINT, {body: {ids}});
  }
}
