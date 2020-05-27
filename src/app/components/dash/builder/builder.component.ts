import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import { DashUiStatus } from '@app/enums/dash-ui-status';
import { Widget } from '@builder/shared/classes/widget';
import { WidgetReference } from '@builder/shared/classes/widget-reference';
import { widgets } from '@builder/shared/consts/widgets';
import { WidgetConfigType } from '@builder/shared/enums/widget-config-type';
import { WidgetID } from '@builder/shared/enums/widget-id';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faClone } from '@fortawesome/free-regular-svg-icons/faClone';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent implements OnInit, OnDestroy {

  readonly faBack: IconDefinition = faArrowLeft;
  readonly faAdd: IconDefinition = faPlus;
  readonly faPath: IconDefinition = faChevronRight;
  readonly faDropdown: IconDefinition = faChevronDown;
  readonly faTrash: IconDefinition = faTrashAlt;
  readonly faModify: IconDefinition = faCog;
  readonly faDuplicate: IconDefinition = faClone;

  readonly widgets = widgets;
  readonly widgetConfigType = WidgetConfigType;

  widgetList: Widget[] = [];

  /**
   * List of selected widgets for the page
   */
  widgetReferences: WidgetReference[] = [
    new WidgetReference({
      id: WidgetID.BUTTON,
    }),
    new WidgetReference({
      id: WidgetID.HEADING,
    }),
    new WidgetReference({
      id: WidgetID.BUTTON,
    }),
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
    /**
     * Generate a list from widgets dict
     */
    for (const widget of Object.values(widgets)) {
      this.widgetList.push(new widget({}));
    }
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
     * Collect the widgets from the widget references
     */
    const getWidgets = (references: WidgetReference[]): Widget[] => {
      const output: Widget[] = [];
      for (const reference of references) {
        output.push(new this.widgets[reference.id]({
          values: reference.values,
          children: getWidgets(reference.children || []),
        }));
      }
      return output;
    };
    /**
     * Render and sanitize them to {@see preview}
     */
    this.preview = this.sanitizer.bypassSecurityTrustHtml(Widget.render(getWidgets(this.widgetReferences)));
  }

  /**
   * Select a widget reference and update the path
   * @param widget Widget reference to select (null to clear selection)
   */
  selectWidgetReference(widget?: WidgetReference): void {
    if (!widget) {
      this.selectedWidgetReference = null;
      this.selectedWidgetReferenceParents = [];
    } else {
      const index = this.selectedWidgetReferenceParents.indexOf(widget);
      if (index !== -1) {
        this.selectedWidgetReferenceParents.splice(index, this.selectedWidgetReferenceParents.length);
      }
      this.selectedWidgetReference = widget;
      this.selectedWidgetReferenceParents.push(this.selectedWidgetReference);
    }
  }

  /**
   * Add a widget reference from a structure widget ID as a selected widget reference child
   * @param id Widget ID
   */
  addWidget(id: WidgetID): void {
    const widgetReference = new WidgetReference({ id });
    if (!this.selectedWidgetReference) {
      this.widgetReferences.push(widgetReference);
    } else if (this.selectedWidgetReference.widget.canHaveChildren) {
      this.selectedWidgetReference.addChild(widgetReference);
    }
    this.updatePreview();
    this.sidebarView = 'structure';
  }

  /**
   * Duplicate/clone a widget
   */
  duplicateWidgetReference(widget: WidgetReference, index: number) {
    widget = new WidgetReference({
      id: JSON.parse(JSON.stringify(widget.id)),
      values: JSON.parse(JSON.stringify(widget.values)),
      children: JSON.parse(JSON.stringify(widget.children)),
    });
    if (this.selectedWidgetReference) {
      this.selectedWidgetReference.addChild(widget, index);
    } else {
      this.widgetReferences.splice(index, 0, widget);
    }
    this.updatePreview();
  }

  /**
   * Delete a referenced widget
   */
  deleteWidgetReference(widget: WidgetReference) {
    if (this.selectedWidgetReference) {
      this.selectedWidgetReference.removeChild(widget);
    } else {
      this.widgetReferences.splice(this.widgetReferences.indexOf(widget), 1);
    }
    this.updatePreview();
  }

  /**
   * On widget reference drag-dropped
   */
  drop(event: CdkDragDrop<WidgetReference>): void {
    let list: WidgetReference[] = this.widgetReferences;
    if (this.selectedWidgetReference) {
      list = this.selectedWidgetReference.children;
    }
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    this.updatePreview();
  }
}
