import {
  Component,
  OnInit,
  OnDestroy,
  ContentChildren,
  QueryList,
  AfterViewInit,
  ViewChildren,
  ComponentFactoryResolver, ComponentFactory, ViewContainerRef, ViewChild, Injector, ReflectiveInjector,
} from '@angular/core';
import { AppComponent } from '@app/app.component';
import { LayoutComponent } from '@app/components/dash/builder/shared/components/layout/layout.component';
import { DashUiStatus } from '@app/enums/dash-ui-status';
import { Element } from './shared/classes/element';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent implements OnInit, OnDestroy, AfterViewInit {


  output: string;

  elements: Element[] = [
    new Element({ tag: 'p', text: 'I am a paragraph.' }),
    new Element({ tag: 'button', text: 'I am a button.' }),
  ];

  added = [
    {
      ref: this.elements[0],
    },
    {
      ref: this.elements[1],
    },
    {
      ref: this.elements[0],
      children: [
        this.elements[1],
        this.elements[1],
        this.elements[1],
      ]
    },
  ];


  ngOnInit(): void {

    AppComponent.UI_STATUS.emit(DashUiStatus.NONE);

    this.output = Element.render([
      new Element({
        tag: 'div',
        attributes: {
          class: ['container', 'my-3'],
        },
        children: [
          new Element({
            tag: 'h1',
            text: 'Hello world',
          }),
          new Element({
            tag: 'p',
            children: [
              new Element({
                tag: 'span',
                text: 'Click here to download: ',
              }),
              new Element({
                tag: 'a',
                text: 'Download',
                attributes: {
                  href: 'https://gonevis.com',
                  target: '_blank',
                  class: 'btn btn-primary btn-sm',
                },
              }),
            ],
          }),
          new Element({
            tag: 'h2',
            text: 'The List',
          }),
          new Element({
            tag: 'p',
            text: 'Here\'s the list to check:',
          }),
          new Element({
            tag: 'ul',
            children: [
              new Element({
                tag: 'li',
                text: 'This is item number 1',
              }),
              new Element({
                tag: 'li',
                text: 'This is item number 2',
              }),
              new Element({
                tag: 'li',
                text: 'This is item number 3',
              }),
            ],
          }),
        ],
      }),
    ]);
  }

  ngOnDestroy(): void {
    AppComponent.UI_STATUS.emit(DashUiStatus.ALL);
  }
}
