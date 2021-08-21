// export class User {
//   _id: string;
//   name: string;
// }

export class CurrentUser {
  address: string;
  auth_type: string;
  cover_photo: string;
  created_at: string;
  description: string;
  display_name: string;
  dob: string;
  email: string;
  featured: string;
  first_name: string;
  id: number;
  job_sectors_id: string;
  last_name: string;
  latitude: string;
  longitude: string;
  phone: string;
  profile_photo: string;
  pubic_view: string;
  role: string;
  updated_at: string;
  username: string;
  verified: number;
  views: string;
  sector?: string;
}

export class Candidate {
  academics?: string;
  age?: string;
  availble_now?: number;
  candidate_cv?: string;
  cover_letter?: any;
  facebook_link?: string;
  gender?: string;
  instagram_link?: string;
  job_industry?: string;
  job_title?: string;
  linkedin_link?: string;
  salary_amount?: string;
  salary_type?: string;
  twitter_link?: string;
}

export class UserAPIReponse {
  status: string;
  data?: any;
  message?: any;
  type?: any;
}
