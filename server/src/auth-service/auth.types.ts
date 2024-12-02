/** Types used for ensuring that overall model for each artifact is consistent, if not then give error at compile time it self.  */
export interface User extends NewUser {
  id: number;
}

export interface NewUser {
  username: string;
  password: string;
  role_id: number;
}

export interface Role {
  id: number;
  title: string;
}

export interface Permission {
  id: number;
  title: string;
}

export enum Roles {
  ADMIN = "Admin",
  LEARNER = "Learner",
}

export enum Permissions {
  CREATE_QUIZ = "CREATE_QUIZ",
  EDIT_QUIZ = "EDIT_QUIZ",
  DELETE_QUIZ = "DELETE_QUIZ",
  TAKE_QUIZ = "TAKE_QUIZ",
  CREATE_QUESTION = "CREATE_QUESTION",
}
