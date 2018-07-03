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
  contacts: Observable<{}>;

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

  }

  createChat = function( loggedUser:User, contactUser:User){
    return new Promise( (resolve,reject) => {
      // console.log(contactUser.uid);
      let contacts:string[] = [];
      let chatid;
      const userDocument = this.afs.collection('users/'+loggedUser.uid+'/contactos');
      userDocument.valueChanges().subscribe(data=>{
        // console.log("valuechanges");
        for(let d in data[0]){
          contacts.push(d);
        }
        if (contacts.indexOf(contactUser.uid) === -1) {
          // console.log("if");
          this.afs.collection('users/'+loggedUser.uid+'/contactos').doc('userContacts').set({[contactUser.uid]:true},{merge:true}).then(contactUserRegistered => {
            let chat = {
              partacipants: {
                [loggedUser.uid]:true,
                [contactUser.uid]:true
              }
            };
            this.afs.collection('chats').add(chat).then( chatId => {
              chatid = chatId['id'];
              let chats = {
                chats: {
                  [chatId['id']]:true
                }
              };
              this.afs.doc('users/'+loggedUser.uid).set(chats,{merge:true}).then( registered => {
                
                // console.log("algo");
                // console.log(chatId['id']);
                resolve(chatId['id']);
  
              }).catch(err => {
                console.log("No se pudo registrar el chatId en mi lista de chats");
                reject(err);
              });
            }).catch( err => {
              console.log("error al crear el chat en la coleccion de chats");
              reject(err);
            });
          }).catch( err => {
            console.log("Error registrando el contacto en la lista de contactos");
            reject(err);
          });
        }else{
          // el usuario ya esta en la lista de contactos del usuario logueado.
          // console.log("else");
          // console.log("chatid");
          // console.log(chatid);
          if (chatid != undefined) {
            resolve(chatid);
          }
        }
      })
    });
  }

  // getContacts(userId){
  //   this.contacts = this.afs.collection('users/'+userId+'/contactos').doc('userContacts').valueChanges();
  //   return this.contacts;
  // }

  // getContactsDetail(contacts:string[]){
  //   let contactss:Observable<any>[] = [];
  //   contacts.forEach(element => {
  //     contactss.push(this.afs.doc('users/'+element).valueChanges());
  //   });
  //   return contactss;
  // }

}
