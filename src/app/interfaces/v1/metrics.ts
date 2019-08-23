export interface Metrics {
  dolphin: {
    file_count: number;
    used_storage: number;
    used_storage_percentage: number;
    available_storage: number;
    available_storage_percentage: number;
    updated: Date;
  };
  comment_count: number;
  active_comment_count: number;
  hidden_comment_count: number;
  pending_comment_count: number;
  entry_count: number;
  published_entry_count: number;
  draft_entry_count: number;
  team_member_count: number;
  pending_team_member_count: number;
  subscriber_count: number;
  updated: Date;
}
