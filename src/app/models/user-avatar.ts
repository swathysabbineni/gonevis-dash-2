class UserAvatar {
  /**
   * Generate a color based on given name.
   *
   * @param name Name to generate color from.
   * @param saturation The saturation of returned color which is a number between `0` and `100`.
   * @param lightness The lightness of returned color which is a number between `0` and `100`.
   */
  stringToHslColor(name: string, saturation: number, lightness: number): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash * 32) - hash);
    }
    const h: number = hash % 360;
    return `hsl(${h}, ${saturation}%, ${lightness}%)`;
  }
}
