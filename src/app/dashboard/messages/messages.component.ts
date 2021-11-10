import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-user-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  @ViewChild('messages') messages!: ElementRef;

  subscriptions: Subscription = new Subscription();

  newMessage = '';

  conversationInit = false;
  messageInit = false;
  allConversations = [];

  selectedConversation: any = {};

  userId = this.helperService.currentUserInfo.id;

  constructor(
    private router: Router,
    private userService: UserService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService,
    private database: AngularFireDatabase,
    private auth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.getConversations();
    this.initSubscriptions();
  }

  initSubscriptions() {
    const addConversationSub = this.database
      .list(`conversations/${this.userId}`)
      .stateChanges(['child_added'])
      .subscribe(
        (snapshot: any) => {
          if (!this.conversationInit) {
            return;
          }

          const newConversation = snapshot.payload.val();
          newConversation.messages = [];
          newConversation.messagesLoaded = false;

          this.allConversations.unshift(newConversation);
        },
        (error) => {
          this.spinnerService.hide();
        }
      );

    const changeConversationSub = this.database
      .list(`conversations/${this.userId}`)
      .stateChanges(['child_changed'])
      .subscribe(
        (snapshot: any) => {
          if (!this.conversationInit) {
            return;
          }

          const changedConversation = snapshot.payload.val();

          const conversation = this.allConversations.find((conversation) => conversation.id === changedConversation.id);
          Object.assign(conversation, changedConversation);

          this.allConversations.sort((a, b) => b.timestamp - a.timestamp);
        },
        (error) => {
          this.spinnerService.hide();
        }
      );

    this.subscriptions.add(addConversationSub);
    this.subscriptions.add(changeConversationSub);
  }

  loadConversation(conversation) {
    this.getMessages(conversation);
    this.selectedConversation = conversation;
  }

  processConversationData(conversations: any[]) {
    if (!conversations) {
      return [];
    }

    const processedConversation = [];
    for (const conversation of Object.values(conversations)) {
      conversation.messages = [];
      conversation.messagesLoaded = false;

      processedConversation.push(conversation);
    }

    return processedConversation;
  }

  processMessageData(messages: any[]) {
    if (!messages) {
      return [];
    }

    return Object.values(messages);
  }

  getFirstConversationMessage() {
    this.getMessages(this.allConversations[0]);
  }

  getConversations() {
    this.spinnerService.show();

    const getConversationsSub = this.database
      .list(`conversations/${this.userId}`)
      .valueChanges()
      .subscribe(
        (snapshot) => {
          getConversationsSub.unsubscribe();

          this.spinnerService.hide();

          this.conversationInit = true;

          this.allConversations = this.processConversationData(Object.values(snapshot));

          if (this.allConversations.length) {
            this.allConversations.sort((a, b) => b.timestamp - a.timestamp);

            this.getFirstConversationMessage();
            this.selectedConversation = this.allConversations[0];

            this.getUsersInformation();
          }
        },
        (error) => {
          this.spinnerService.hide();
          this.snackbar.openSnackBar('Something went wrong! Please logout and login.', 'Close', 'warn');
        }
      );
  }

  getUsersInformation() {
    const userIds = [];

    for (const conversation of this.allConversations) {
      const ids = conversation.id;

      const id1 = parseInt(ids.split('_')[0]);
      const id2 = parseInt(ids.split('_')[1]);

      userIds.push(id1 === this.userId ? id2 : id1);
    }

    this.spinnerService.show();
    const subscription = this.userService.getUsers(userIds).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        for (const user of result.data) {
          const conversation = this.allConversations.find(
            (conversation) => user.id === this.getConversationUserId(conversation.id)
          );

          if (conversation) {
            conversation.name = user.display_name || user.username;
            conversation.image = this.getUserProfilePicture(user.profile_photo);
          }
        }
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getMessages(conversation: any) {
    if (!conversation) {
      return;
    }

    if (parseInt(conversation.lastMessageSenderId) !== this.userId) {
      const id1 = conversation.id.split('_')[0];
      const id2 = conversation.id.split('_')[1];

      this.database
        .object(`conversations/${id1}/${conversation.id}`)
        .update({ seen: true })
        .catch((error) => {
          this.spinnerService.hide();
        });
      this.database
        .object(`conversations/${id2}/${conversation.id}`)
        .update({ seen: true })
        .catch((error) => {
          this.spinnerService.hide();
        });
    }

    if (conversation.messages?.length) {
      return;
    }

    const getMessagesSub = this.database
      .list(`messages/${conversation.id}`)
      .valueChanges()
      .subscribe(
        (snapshot) => {
          getMessagesSub.unsubscribe();

          const values = Object.values(snapshot);
          if (!values) {
            conversation.messages = [];
          }

          conversation.messages = this.processMessageData(values);
          conversation.messages.sort((a, b) => a.timestamp - b.timestamp);

          conversation.messagesLoaded = true;
          this.scrollToNewMessage();
        },
        (error) => {
          this.spinnerService.hide();
        }
      );

    const addMessageSub = this.database
      .list(`messages/${conversation.id}`)
      .stateChanges(['child_added'])
      .subscribe(
        (snapshot: any) => {
          if (!conversation.messagesLoaded) {
            return;
          }

          const newMessage = snapshot.payload.val();
          conversation.messages.push(newMessage);

          if (conversation.id === this.selectedConversation.id && newMessage.sender !== this.userId) {
            const id1 = conversation.id.split('_')[0];
            const id2 = conversation.id.split('_')[1];

            this.database
              .object(`conversations/${id1}/${conversation.id}`)
              .update({ seen: true })
              .catch((error) => {
                this.spinnerService.hide();
              });
            this.database
              .object(`conversations/${id2}/${conversation.id}`)
              .update({ seen: true })
              .catch((error) => {
                this.spinnerService.hide();
              });
          }

          this.scrollToNewMessage();
        },
        (error) => {
          this.spinnerService.hide();
        }
      );

    this.subscriptions.add(addMessageSub);
  }

  sendMessage() {
    const conversationId = this.selectedConversation.id;
    const time = Date.now();

    const message = {
      message: this.newMessage,
      sender: this.userId,
      timestamp: time,
    };

    this.database
      .list(`messages/${conversationId}`)
      .push(message)
      .catch((error) => {
        this.spinnerService.hide();
      });

    const updates = {
      lastMessage: this.newMessage,
      timestamp: time,
      lastMessageSenderId: this.userId,
      seen: false,
    };

    const id1 = conversationId.split('_')[0];
    const id2 = conversationId.split('_')[1];

    this.database
      .object(`conversations/${id1}/${conversationId}`)
      .update(updates)
      .catch((error) => {
        this.spinnerService.hide();
      });
    this.database
      .object(`conversations/${id2}/${conversationId}`)
      .update(updates)
      .catch((error) => {
        this.spinnerService.hide();
      });

    this.newMessage = '';
  }

  getDate(timestamp) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(timestamp);

    const day = date.getDate();
    const month = months[date.getMonth() + 1];

    return `${month} ${day}`;
  }

  getDateTime(timestamp) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(timestamp);

    const day = date.getDate();
    const month = months[date.getMonth() + 1];
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');

    return `${hours}:${minutes} | ${month} ${day}`;
  }

  getConversationUserId(conversationId: string) {
    const id1 = parseInt(conversationId.split('_')[0]);
    const id2 = parseInt(conversationId.split('_')[1]);

    return id1 === this.userId ? id2 : id1;
  }

  scrollToNewMessage() {
    setTimeout(() => {
      this.messages.nativeElement.scrollTo(0, this.messages.nativeElement.scrollHeight);
    }, 0);
  }

  getUserProfilePicture(imageSrc: any) {
    if (imageSrc) {
      return this.helperService.getImageUrl(imageSrc, 'users', 'thumb');
    }

    return 'assets/img/avatar-default.png';
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
