import { Component, OnInit } from '@angular/core';
import { ChatsService } from '../../services/chats.service';
import { Observable } from 'rxjs';

import * as M from "node_modules/materialize-css/dist/js/materialize.js";

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

  constructor(private _chatsService:ChatsService) {
    setTimeout(() => {
      var el = document.querySelector(".tabs");
      var instance = M.Tabs.init(el);
    }, 100);  
    _chatsService.getUsers().subscribe( data => {
      this.users = data;
      console.log("Users here");
      console.log(this.users);
      this.chats = _chatsService.getChats(this.users[0].key);
    });

    
    
  }

  ngOnInit() {
  }


}
