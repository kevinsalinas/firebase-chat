import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import { User } from "../interfaces/user.interface";

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  private itemsCollection: AngularFirestoreCollection;
  users: Observable<any[]>;
  chats: Observable<Object>;

  constructor(private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<any>('users');
    this.users = this.itemsCollection.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ uid: c.payload.doc.id, ...c.payload.doc.data() }))
      )
    );
    //console.log(this.users);
  }

  getUsers() {
    return this.users;
  }

  getChats(userId:string) {
    const userDocument = this.afs.doc('users/' + userId);    
    return userDocument.valueChanges();
  }

  getChatsDetails(chatsIds:string[]) {
    let chats:Observable<any>[] = [];
    chatsIds.forEach(element => {
      chats.push(this.afs.doc('chats/'+element).valueChanges());
    });
    return chats;
  }

  newChat(loggedUser:User,contactUser:User) {
    console.log(contactUser.uid);
    let contacts:string[] = [];
    const userDocument = this.afs.collection<any>('users/'+loggedUser.uid+'/contactos');
    userDocument.valueChanges().subscribe(data=>{
      for(let d in data[0]){
        contacts.push(d);
      }
      if (contacts.indexOf(contactUser.uid) > -1) {
        // TODO: regresar true == el usuario ya tiene una conversacion con el contactUser
      }else{
        let c = contactUser.uid.toString();
        this.afs.collection<any>('users/'+loggedUser.uid+'/contactos').doc('userContacts').set({[c]:true},{merge:true});
        // TODO: crear la estructura del chat y guardarlo en la coleccion de chats
        this.afs.collection('chats').add({[c]:true});
        // TODO: COn el ID del chat agregarlo al objecto chats del usuario
      }
    })
  }

}
