import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-transaction-modal',
  templateUrl: './edit-transaction-modal.component.html',
  styleUrls: ['./edit-transaction-modal.component.scss']
})
export class EditTransactionModalComponent implements OnInit {
  form = new FormGroup({
    cardHolderHash: new FormControl('', Validators.required),
    datetime: new FormControl('', Validators.required),
    amount: new FormControl('', [Validators.required, Validators.min(0.01)])
  });
  constructor(
    public dialogRef: MatDialogRef<EditTransactionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.form.patchValue(this.data.form);
  }

}
