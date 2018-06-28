import { Component, OnInit } from '@angular/core';

import * as M from "node_modules/materialize-css/dist/js/materialize.js";

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  el:any = {};
  instance:any = {};

  constructor() {
    setTimeout(() => {
      var el = document.querySelector(".tabs");
      var instance = M.Tabs.init(el);
    }, 100);
  }

  ngOnInit() {
  }


}
