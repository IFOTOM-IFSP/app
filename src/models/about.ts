export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photoUrl: string;
  social: {
    linkedin?: string;
    github?: string;
  };}