import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentsService } from '@app/components/dash/comments/comments.service';
import { EntryService } from '@app/components/dash/entry/entry.service';
import { TeamService } from '@app/components/dash/team/team.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { Comment } from '@app/interfaces/v1/comment';
import { Entry } from '@app/interfaces/v1/entry';
import { Team } from '@app/interfaces/v1/team';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  /**
   * Is showing posts or pages
   * @see DashRoutingModule
   */
  readonly isPages: boolean = this.route.snapshot.data.pages === true;

  /**
   * List of comments
   */
  comments: Comment[];

  /**
   * List of entries
   */
  entries: Entry[];

  /**
   * Team members
   */
  team: Team;

  /**
   * Comments count
   */
  commentsCount = 0;

  /**
   * Entries count
   */
  entriesCount = 0;

  /**
   * Members count
   */
  teamMembersCount = 0;

  /**
   * Members count
   */
  pendingTeamMembersCount = 0;

  constructor(private commentsService: CommentsService,
              private entryService: EntryService,
              private teamService: TeamService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    /**
     * Get comments
     */
    this.commentsService.getComments().subscribe((response: ApiResponse<Comment>): void => {
      this.comments = response.results;
      this.commentsCount = response.count;
    });
    /**
     * Load entries
     */
    this.entryService.getEntries({
      is_page: this.isPages,
    }).subscribe((response: ApiResponse<Entry>): void => {
      this.entries = response.results;
      this.entriesCount = response.count;
    });
    /**
     * Get teams
     */
    this.teamService.getTeams().subscribe((data: Team): void => {
      this.team = data;
      this.teamMembersCount = data.team.length;
      this.pendingTeamMembersCount = data.team_pending.length;
    });
  }
}
