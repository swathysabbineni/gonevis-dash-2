import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import { Heading } from '@app/components/dash/builder/shared/classes/heading';
import { DashUiStatus } from '@app/enums/dash-ui-status';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faCube } from '@fortawesome/free-solid-svg-icons/faCube';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';

import { Button } from './shared/classes/button';
import { Card } from './shared/classes/card';
import { Container } from './shared/classes/container';
import { Space } from './shared/classes/space';
import { Widget } from './shared/classes/widget';
import { WidgetID } from './shared/enums/widget-id';
import { WidgetReference } from './shared/interfaces/widget-reference';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent implements OnInit, OnDestroy {

  /**
   * List of available widgets to choose from and build the page
   */
  static readonly WIDGETS: Record<WidgetID, typeof Widget> = {
    [WidgetID.BUTTON]: Button,
    [WidgetID.CARD]: Card,
    [WidgetID.CONTAINER]: Container,
    [WidgetID.SPACE]: Space,
    [WidgetID.HEADING]: Heading,
  };

  readonly faWidget: IconDefinition = faCube;
  readonly faBack: IconDefinition = faArrowLeft;
  readonly faAdd: IconDefinition = faPlus;
  readonly faPath: IconDefinition = faChevronRight;

  readonly widgets = BuilderComponent.WIDGETS;

  /**
   * List of selected widgets for the page
   */
  widgetReferences: WidgetReference[] = [
    {
      widget: WidgetID.CONTAINER,
      children: [
        {
          widget: WidgetID.HEADING,
          config: {
            text: 'Hello World!',
          },
        },
        {
          widget: WidgetID.BUTTON,
          config: {
            label: 'Go Main',
            type: 'primary',
            link: '/',
            openInNewTab: 'yes',
          },
        },
        {
          widget: WidgetID.BUTTON,
          config: {
            label: 'Go Main',
            type: 'primary',
            link: '/',
            openInNewTab: 'yes',
          },
        },
        {
          widget: WidgetID.SPACE,
        },
        {
          widget: WidgetID.CARD,
          children: [
            {
              widget: WidgetID.HEADING,
              config: {
                text: 'Another Button Goes Here',
                type: '2',
              },
            },
            {
              widget: WidgetID.BUTTON,
              config: {
                label: 'This is an info button',
                type: 'info',
                link: '/',
              },
            },
            {
              widget: WidgetID.SPACE,
            },
            {
              widget: WidgetID.HEADING,
              config: {
                text: 'Let\'s Another Card',
                type: '2',
              },
            },
            {
              widget: WidgetID.CARD,
              children: [
                {
                  widget: WidgetID.HEADING,
                  config: {
                    text: 'Some Buttons',
                    type: '3',
                  },
                },
                {
                  widget: WidgetID.BUTTON,
                  config: {
                    label: 'Sample Button',
                    type: 'dark',
                    link: '/',
                  },
                },
                {
                  widget: WidgetID.BUTTON,
                  config: {
                    label: 'Sample Button',
                    type: 'link',
                    link: '/',
                  },
                },
                {
                  widget: WidgetID.BUTTON,
                  config: {
                    label: 'Sample Button',
                    type: 'link',
                    link: '/',
                  },
                },
                {
                  widget: WidgetID.SPACE,
                },
                {
                  widget: WidgetID.HEADING,
                  config: {
                    text: 'Last Button',
                    type: '3',
                  },
                },
                {
                  widget: WidgetID.BUTTON,
                  config: {
                    label: 'Sample Button',
                    type: 'danger',
                    link: '/',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  /**
   * Rendered HTML to preview the page
   */
  preview: SafeHtml;

  sidebarView: 'structure' | 'widgets' = 'structure';

  selectedWidgetReference: WidgetReference;

  selectedWidgetReferenceParents: WidgetReference[] = [];

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    /**
     * Hide dashboard navbar and sidebar
     */
    AppComponent.UI_STATUS.emit(DashUiStatus.NONE);
    /**
     * Update the preview initially
     */
    this.updatePreview();
  }

  ngOnDestroy(): void {
    /**
     * Show navbar and sidebar back
     */
    AppComponent.UI_STATUS.emit(DashUiStatus.ALL);
  }

  /**
   * Use widget references and render them to preview as HTML
   */
  updatePreview(): void {
    /**
     * Collect the widgets from the widget refrences
     */
    const getWidgets = (references: WidgetReference[]): Widget[] => {
      const widgets: Widget[] = [];
      for (const reference of references) {
        widgets.push(new this.widgets[reference.widget]({
          values: reference.config,
          children: getWidgets(reference.children || []),
        }));
      }
      return widgets;
    };
    /**
     * Render and sanitize them to {@see preview}
     */
    this.preview = this.sanitizer.bypassSecurityTrustHtml(Widget.render(getWidgets(this.widgetReferences)));
  }

  selectWidgetReference(widget?: WidgetReference): void {
    if (widget) {
      if (widget.children) {
        const index = this.selectedWidgetReferenceParents.indexOf(widget);
        if (index !== -1) {
          this.selectedWidgetReferenceParents.splice(index, this.selectedWidgetReferenceParents.length);
        }
        this.selectedWidgetReference = widget;
        this.selectedWidgetReferenceParents.push(this.selectedWidgetReference);
      }
    } else {
      this.selectedWidgetReference = null;
      this.selectedWidgetReferenceParents = [];
    }
  }

  addWidget(id: WidgetID): void {
    const widgetReference: WidgetReference = {
      widget: id,
      config: {},
    };
    if (!this.selectedWidgetReference) {
      this.widgetReferences.push(widgetReference);
    } else if (this.selectedWidgetReference.children) {
      this.selectedWidgetReference.children.push(widgetReference);
    }
    this.updatePreview();
  }
}
