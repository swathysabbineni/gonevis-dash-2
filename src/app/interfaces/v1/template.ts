import { TemplateConfig } from '@app/interfaces/v1/template-config';

export interface Template {
  id: string;
  name: string;
  config: TemplateConfig;
  media: {
    screen_shot: string;
    thumbnail_512x512: string;
    thumbnail_256x256: string;
    thumbnail_128x128: string;
    thumbnail_48x48: string;
  };
}
