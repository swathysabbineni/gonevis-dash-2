import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Media } from '@app/interfaces/media';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit, OnChanges {

  /**
   * User's name to generate color from it.
   */
  @Input() name: string;

  /**
   * Class list for the avatar container.
   */
  @Input() classList: string[] = ['rounded-circle'];

  /**
   * User's media object.
   */
  @Input() media: Media;

  /**
   * Size of the avatar in pixels (px).
   */
  @Input() size = 48;

  /**
   * Resolution of the media based on {@link size}.
   */
  resolution: string;

  /**
   * Acronym of given name.
   */
  acronym: string;

  /**
   * Color generated from {@link name}.
   */
  backgroundColor: string;

  /**
   * Contrast color based on {@link backgroundColor}.
   */
  color: string;

  constructor() {
  }

  ngOnInit(): void {
    this.classList = ['d-flex', 'align-items-center', 'justify-content-center', 'text-uppercase']
      .concat(this.classList);
    /**
     * Change {@link media} resolution based on given {@link size}.
     */
    if (this.size <= 48) {
      this.resolution = 'thumbnail_48x48';
    } else if (this.size > 48 && this.size <= 128) {
      this.resolution = 'thumbnail_128x128';
    } else if (this.size > 128 && this.size <= 256) {
      this.resolution = 'thumbnail_256x256';
    }
  }

  /**
   * Generate a color based on given name.
   *
   * @param name Name to generate color from.
   */
  stringToColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color: string = (hash & 0x00FFFFFF).toString(16).toUpperCase();

    return `#${'00000'.substring(0, 6 - color.length)}${color}`;
  }

  /**
   * Get the contrast color from given HEX color.
   *
   * @param hexColor A hex color value.
   */
  getContrast(hexColor: string): string {
    const red: number = parseInt(hexColor.substr(0, 2), 16);
    const green: number = parseInt(hexColor.substr(2, 2), 16);
    const blue: number = parseInt(hexColor.substr(4, 2), 16);
    const yiq: number = ((red * 299) + (green * 587) + (blue * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.backgroundColor = this.stringToColor(this.name);
    this.color = this.getContrast(this.backgroundColor);
    this.acronym = this.name.match(/\b(\w)/g).join('');
  }
}
