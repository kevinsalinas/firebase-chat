import { Injectable } from '@angular/core';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

// Interfaces
import { User } from "../interfaces/user.interface";

import { Router } from "@angular/router";



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private itemDoc: AngularFirestoreCollection<any>;
  item: Observable<any>;
  user: User = {nombre:"",image:""};
  
  constructor(public afAuth: AngularFireAuth, private _db:AngularFirestore, private router:Router) {
    this.afAuth.authState.subscribe( user => {
      if(!user) {return;}
      else{
        this.user.nombre = user.displayName;
        this.user.image = user.photoURL;

        this.itemDoc = _db.collection('users');
        this.itemDoc.doc(String(user.uid)).set(this.user);

        // console.log(this.user);
      }
    })
  }
  login() {
    let provider = new auth.GoogleAuthProvider();    
    this.afAuth.auth.signInWithPopup(provider).then( user => {
      // console.log(user);
      this.router.navigate(['/chats']);
    }).catch( error => {
      console.log(error);
    });
  }
  logout() {
    this.afAuth.auth.signOut();
  }
}
