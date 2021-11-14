import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private database: AngularFireDatabase) {}

  async sendMessage(from: any, to: any, messageText: string, conversationId: string = null) {
    if (conversationId == null) {
      conversationId = this.getConversationId(from, to);
    }

    const time = Date.now();

    const updates = {
      id: conversationId,
      lastMessage: messageText,
      timestamp: time,
      lastMessageSenderId: from,
      seen: false,
    };

    const id1 = parseInt(conversationId.split('_')[0]);
    const id2 = parseInt(conversationId.split('_')[1]);

    const updates1 = { otherUser: id2, ...updates };
    const updates2 = { otherUser: id1, ...updates };

    await this.database.object(`conversations/${id1}/${conversationId}`).update(updates1);
    await this.database.object(`conversations/${id2}/${conversationId}`).update(updates2);

    const message = {
      message: messageText,
      sender: from,
      timestamp: time,
    };

    this.database.list(`messages/${conversationId}`).push(message);
  }

  private getConversationId(from: any, to: any): string {
    let conversationId: string;

    from = parseInt(from);
    to = parseInt(to);

    if (to < from) {
      conversationId = `${to}_${from}`;
    } else {
      conversationId = `${from}_${to}`;
    }

    return conversationId;
  }
}
