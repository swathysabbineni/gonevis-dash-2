import { Component, Input, OnChanges } from '@angular/core';
import { PasswordStrength } from '@app/interfaces/password-strength';

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss'],
})
export class PasswordStrengthComponent implements OnChanges {

  /**
   * Minimum password length
   */
  private static readonly minLength: number = 6;

  /**
   * Password strength levels
   * @todo Add translation
   */
  private static readonly strengthLevels: PasswordStrength[] = [{
    label: null,
    color: 'danger',
    percentage: 0,
  }, {
    label: 'Short',
    color: 'danger',
    percentage: 20,
  }, {
    label: 'Week',
    color: 'warning',
    percentage: 40,
  }, {
    label: 'Good',
    percentage: 60,
  }, {
    label: 'Strong',
    color: 'info',
    percentage: 80,
  }, {
    label: 'Excellent',
    color: 'success',
    percentage: 100,
  }];

  /**
   * Password to check strength
   */
  @Input() password: string;

  /**
   * Current password's strength
   */
  strength: PasswordStrength = PasswordStrengthComponent.strengthLevels[0];

  /**
   * Update strength based on password
   *
   * @return Calculated strength
   */
  private async updateStrength(): Promise<number> {
    let strength = 0;
    // Check password
    if (!this.password) {
      this.password = '';
    }
    // Is it long enough
    if (this.password.length >= PasswordStrengthComponent.minLength) {
      strength += 1;
    }
    // Contains at least 1 number
    if (this.password.search(/\d/) !== -1) {
      strength += 1;
    }
    // Contains at least 1 letter
    if (this.password.search(/[a-zA-Z]/) !== -1) {
      strength += 1;
    }
    // Contains at least 1 uppercase letter
    if (this.password.search(/[A-Z]/) !== -1) {
      strength += 1;
    }
    // Contains at least 1 special character
    if (this.password.search(/[^\w\s]/gi) !== -1) {
      strength += 1;
    }

    return strength;
  }

  ngOnChanges(): void {
    this.updateStrength().then((strength: number): void => {
      this.strength = PasswordStrengthComponent.strengthLevels[strength];
    });
  }
}
