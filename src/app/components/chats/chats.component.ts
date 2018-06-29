import { Component, OnInit } from '@angular/core';
import { ChatsService } from '../../services/chats.service';
import { Observable } from 'rxjs';

import * as M from "node_modules/materialize-css/dist/js/materialize.js";
import { User } from '../../interfaces/user.interface';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  el:any = {};
  instance:any = {};
  users:any[];
  chats:Observable<any[]>[] = [];
  misChats:string[] = [];
  user:any;

  constructor(private _chatsService:ChatsService, private _as:AuthService) {
    this._as.afAuth.authState.subscribe(user =>{
      // own user
      this.user = user;
    });
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

    
    
  }

  ngOnInit() {
  }

  newChat (user:User){
    console.log(user);
    // user: foreign user
    this._chatsService.newChat(this.user,user);
  }

}
