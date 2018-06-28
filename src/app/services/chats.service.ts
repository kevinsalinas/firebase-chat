import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  private itemsCollection: AngularFirestoreCollection;
  users: Observable<any[]>;
  chats: Observable<any[]>;

  constructor(private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<any>('users');
    this.users = this.itemsCollection.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.doc.id, ...c.payload.doc.data() }))
      )
    );
    //console.log(this.users);
  }

  getUsers() {
    return this.users;
  }

  getChats(userId:string) {
    const userDocument = this.afs.doc('users/' + userId);
    let chats:Observable<any[]>[] = [];
    userDocument.valueChanges().subscribe( data => {
      console.log("USER DOCUMENT");
      console.log(data["chats"]);
      chats = this.getChatsDetails(data["chats"]);
    });
    return chats;
  }

  getChatsDetails(chatsIds:Object) {
    let chats:Observable<any[]>[] = [];
    console.log("CHATSSSSSS");
    for (let key in chatsIds) {
      let value = chatsIds[key];
      console.log(key);
      chats.push(this.afs.collection('chats/' + key).valueChanges());
    }
    return chats;
  }
}
