export type ContentItem = {
  id: number;
  title: string;
  subtitle?: string | null;
  content: string;
  category?: string | null;
  theme?: string | null;
  user_id?: number | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id?: number;
    username?: string;
    email?: string;
  } | null;
};