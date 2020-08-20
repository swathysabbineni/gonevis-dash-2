import { Component, OnInit, Input } from '@angular/core';
import { Media } from '@app/interfaces/media';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {

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
   * Acronym of given name.
   */
  acronym: string;

  /**
   * Color generated from {@link name}.
   */
  color: string;

  constructor() {
  }

  ngOnInit(): void {
    this.color = this.stringToColor(this.name);
    this.classList = ['d-flex', 'align-items-center', 'justify-content-center'].concat(this.classList);
    this.acronym = this.name.match(/\b(\w)/g).join('');
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
}
