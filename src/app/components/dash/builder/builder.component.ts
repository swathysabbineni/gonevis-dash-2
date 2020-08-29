import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent implements OnInit {

  dataJson = [{
    kind: 'block',
    type: 'paragraph',
    children: [{
      kind: '',
    }],
  }];

  constructor() {
  }

  ngOnInit(): void {
  }
}
