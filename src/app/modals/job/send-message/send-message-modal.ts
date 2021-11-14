import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'send-message-modal',
  templateUrl: 'send-message-modal.html',
  styleUrls: ['send-message-modal.scss'],
})
export class SendMessageModalComponent implements OnInit {
  messageForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SendMessageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private messageService: MessageService,
    private snackbar: SnackBarService,
  ) {}

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      message: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.messageService.sendMessage(this.data.fromUser, this.data.toUser, this.messageForm.value.message);

    this.snackbar.openSnackBar('Message Sent');

    this.dialogRef.close();
  }
}
