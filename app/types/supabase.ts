export type Profile = {
  id: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
};

export type Advertisement = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
};