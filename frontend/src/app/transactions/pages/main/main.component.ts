import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  transactions$ = this.transactionService.getMany();
  constructor(private transactionService: TransactionService) { }

  ngOnInit() {
  }
  uploadCsv($event) {
    const [file] = $event.target.files;
    if (file) {
      console.log(file);
      const formData = new FormData();
      formData.set('file', file, file.name);
      this.transactionService.upload(formData).subscribe(res => {
        console.log(res);
      });
    }
  }
  deleteTransaction(id, transactions) {
    this.transactions$ = this.transactionService.removeOne(id).pipe(
      map(() => ({...transactions, docs: transactions.docs.filter(t => t.id !== id)}))
    );
  }
}
