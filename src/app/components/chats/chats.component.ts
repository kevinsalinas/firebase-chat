import { Component, OnInit } from '@angular/core';
import { ChatsService } from '../../services/chats.service';
import { Observable } from 'rxjs';

import * as M from "node_modules/materialize-css/dist/js/materialize.js";
import { User } from '../../interfaces/user.interface';
import { AuthService } from "../../services/auth.service";

import { Router } from "@angular/router";

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  contacts:any[];
  el:any = {};
  instance:any = {};
  users:any[];
  chats:Observable<any[]>[] = [];
  misChats:string[] = [];
  user:any = {};
  misContactos:Observable<any[]>[] = [];
  contactsArray:User[] = [];

  constructor(private _chatsService:ChatsService, private _as:AuthService, private r:Router) {
    this._as.afAuth.authState.subscribe(user =>{
      // own user
      this.user = user;
      setTimeout(() => {
        var el = document.querySelector(".tabs");
        var instance = M.Tabs.init(el);
      }, 100);  
      _chatsService.getUsers().subscribe( data => {
        this.users = data;
        // TODO: users.key = user.uid 
        _chatsService.getChats(this.user.uid).subscribe(data => {
          for (let d in data["chats"]){
            this.misChats.push(d);
          }
          this.chats = this._chatsService.getChatsDetails(this.misChats);
          for( let c of this.chats){
            c.subscribe(data => {
              // console.log(data);
            })
          }
          // this._chatsService.getChatsDetails(data["chats"])
        });
      });
    });    
  }

  ngOnInit() {
    console.log("oninit");
  }

  logOut(){
    this._as.logout();
  }

  newChat (user:User){
    let result:any;
    this._chatsService.createChat(this.user,user).then( chatid => {
      this.r.navigate(['/chat',chatid]);
      console.log(chatid);
    }).catch( err => console.log(err));
    // user: foreign user
    // result = this._chatsService.newChat(this.user,user);
    // console.log(result);
    // this._chatsService.createChat(this.user,user).then( data => {
    //   this.r.navigate(['/chat',data]);
    // });
  }

  getChats(){
    this._chatsService.getContacts(this.user.uid).subscribe( contacts => {
      console.log(contacts);
      var keysArray = Object.keys(contacts);
      this.misContactos = this._chatsService.getContactsDetail(keysArray);
      this.contactsArray = [];
      for( let c of this.misContactos){
        c.subscribe(data => {
          let user:User = {
            nombre: data["nombre"],
            image: data["image"]
          }
          this.contactsArray.push(user);
        })
      }
    });
  }

}
