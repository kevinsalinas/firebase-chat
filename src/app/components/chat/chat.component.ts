import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatsService } from '../../services/chats.service';
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { User } from "../../interfaces/user.interface";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  chatid:string = "";
  messageArray:any[] = [];
  user:any;

  constructor(private _chatService:ChatsService, private ar:ActivatedRoute, private _as:AuthService) {
    this._as.afAuth.authState.subscribe(user =>{
      this.user = user;

      this.ar.params.subscribe( url => {
        this.chatid = Object.values(url)[0];
        // console.log(this.chatid);
        this._chatService.getChat(this.chatid).subscribe( chat => {
          this.messageArray = chat;
          console.log(chat);
        });
      });
    });   
  }

  ngOnInit() {
    // console.log(this.messageArray[0].message);
  }

  send(val){
    console.log(val);
    this._chatService.addMessage(val,this.user,this.chatid);
  }

}
