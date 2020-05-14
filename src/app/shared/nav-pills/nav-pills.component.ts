import { Component, Input, OnInit } from '@angular/core';
import { NavPill } from '@app/interfaces/nav-pill';

@Component({
  selector: 'app-nav-pills',
  templateUrl: './nav-pills.component.html',
  styleUrls: ['./nav-pills.component.scss'],
})
export class NavPillsComponent implements OnInit {

  @Input() navPills: NavPill[];

  ngOnInit() {
  }

}
