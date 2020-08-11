import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

@Component({
  selector: 'app-info-banner',
  templateUrl: './info-banner.component.html',
  styleUrls: ['./info-banner.component.scss'],
})
export class InfoBannerComponent implements OnInit {

  private static readonly STORAGE_KEY_PREFIX = 'info-banner-';

  /**
   * Storage key with prefix
   */
  private storageKey: string;

  /**
   * Close icon
   */
  readonly faClose: IconDefinition = faTimes;

  /**
   * Show the info banner or not
   */
  visibility = true;

  /**
   * Info banner title (translation key)
   */
  @Input() title?: string;

  /**
   * Info banner detail (translation key)
   */
  @Input() detail?: string;

  /**
   * Info banner storage key used to not show if user dismissed it
   */
  @Input() key?: string;

  /**
   * Info banner icon
   */
  @Input() icon?: IconDefinition;

  /**
   * Event that triggers when user dismisses the info banner.
   * Also called when automatically dismissed by loading storage.
   */
  @Output() dismiss = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.key) {
      this.storageKey = `${InfoBannerComponent.STORAGE_KEY_PREFIX}${this.key}`;
      if (localStorage.getItem(this.storageKey)) {
        this.close();
      }
    }
  }

  /**
   * Dismiss the info banner
   */
  close(): void {
    this.dismiss.emit();
    this.visibility = false;
    if (this.key) {
      localStorage.setItem(this.storageKey, String(true));
    }
  }
}
