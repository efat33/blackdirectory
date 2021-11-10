import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import { SnackBarService } from 'src/app/shared/snackbar.service';

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
    private database: AngularFireDatabase,
    private snackbar: SnackBarService,
  ) {}

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      message: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    let conversationId = '';
    if (this.data.candidateId < this.data.employerId) {
      conversationId = `${this.data.candidateId}_${this.data.employerId}`;
    } else {
      conversationId = `${this.data.employerId}_${this.data.candidateId}`;
    }

    const time = Date.now();

    const message = {
      message: this.messageForm.value.message,
      sender: this.data.employerId,
      timestamp: time,
    };

    this.database.list(`messages/${conversationId}`).push(message);

    const updates = {
      id: conversationId,
      lastMessage: this.messageForm.value.message,
      timestamp: time,
      lastMessageSenderId: this.data.employerId,
      seen: false,
    };

    const id1 = parseInt(conversationId.split('_')[0]);
    const id2 = parseInt(conversationId.split('_')[1]);

    const updates1 = {otherUser: id2, ...updates};
    const updates2 = {otherUser: id1, ...updates};

    this.database.object(`conversations/${id1}/${conversationId}`).update(updates1);
    this.database.object(`conversations/${id2}/${conversationId}`).update(updates2);

    this.snackbar.openSnackBar('Message Sent');

    this.dialogRef.close();
  }
}
