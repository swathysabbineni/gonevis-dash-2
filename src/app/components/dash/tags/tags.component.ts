import { Component, OnInit } from '@angular/core';
import { TagsService } from '@app/components/dash/tags/tags.service';
import { Tag } from '@app/interfaces/v1/tag';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {

  tags: Tag[];

  constructor(private tag: TagsService) {
  }

  ngOnInit(): void {
    /**
     * Load tags
     */
    this.tag.getTags().subscribe(response => {
      this.tags = response.results;
    });
  }
}
