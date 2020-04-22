import { ElementRef } from '@angular/core';
import { EmbedDirective } from 'src/app/shared/embed/embed.directive';

describe('EmbedDirective', () => {
  it('should create an instance', () => {
    const directive = new EmbedDirective(new ElementRef<any>());
    expect(directive).toBeTruthy();
  });
});
