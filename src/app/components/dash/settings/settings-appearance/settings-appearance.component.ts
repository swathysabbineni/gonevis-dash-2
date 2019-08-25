import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { Domain } from '@app/interfaces/v1/domain';
import { BlogService } from '@app/services/blog/blog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings-appearance',
  templateUrl: './settings-appearance.component.html',
  styleUrls: ['./settings-appearance.component.scss'],
})
export class SettingsAppearanceComponent implements OnInit {


  /**
   * Blog settings data
   */
  settings: BlogSettings;

  constructor(private formBuilder: FormBuilder,
              private blogService: BlogService) {
  }

  ngOnInit(): void {
    this.getSettings();
  }

  /**
   * Get blog settings
   */
  getSettings(): void {
    this.blogService.getSettings(BlogService.currentBlog.id).subscribe((data: BlogSettings): void => {
      this.settings = data;
    });
  }
}
