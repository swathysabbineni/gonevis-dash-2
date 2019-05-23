export interface UserBlog {
  id: string;
  media: {
    logo: {
      thumbnail_48x48: string
    }
  };
  role: number;
  title: string;
  url: string;
}
