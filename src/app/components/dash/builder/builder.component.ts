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
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faCube } from '@fortawesome/free-solid-svg-icons/faCube';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent implements OnInit, OnDestroy {

  readonly faWidget: IconDefinition = faCube;
  readonly faBack: IconDefinition = faArrowLeft;
  readonly faAdd: IconDefinition = faPlus;
  readonly faPath: IconDefinition = faChevronRight;
  readonly faTrash: IconDefinition = faTrash;

  readonly widgets = widgets;
  readonly widgetConfigType = WidgetConfigType;

  /**
   * List of selected widgets for the page
   */
  widgetReferences: WidgetReference[] = [
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
}
