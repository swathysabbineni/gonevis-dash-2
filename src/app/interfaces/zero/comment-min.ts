export interface CommentMin {
  id: string;
  comment: string;
  entry: {
    id: string;
    title: string;
  };
  site: {
    id: string;
    title: string;
  };
  created: string;
}
