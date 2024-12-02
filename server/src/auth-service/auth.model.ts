/** Database operations for user registration/authentication/authorization */
import { getDB } from "../database/db";
import { NewUser, Permissions, Role, Roles, User } from "./auth.types";

/**
 * Creates user table with schema:
 * id: identifier for a user row
 * username: username creds for login
 * password: encrypted password for login
 * role_id: used to define users permission and what operations they can perform
 */
export function createUserTable() {
  const db = getDB();
  db.run(`CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role_id INTEGER
  );`);
}

/**
 * Creates role table with schema:
 * id: identifier for a role row
 * title: title of the role like admin/learner
 */
export function createRoleTable() {
  const db = getDB();
  db.run(`CREATE TABLE roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(50) UNIQUE NOT NULL
);`);
}

/**
 * Creates permission table with schema:
 * id: identifier for a permission row
 * title: specifies the operation like create_quiz/take_quiz
 */
export function createPermissionTable() {
  const db = getDB();
  db.run(`CREATE TABLE permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(50) UNIQUE NOT NULL
);
`);
}

/**
 * Creates role_permission table with schema:
 * id: identifier for a row
 * role_id: role which will be provided with a permission, like admin - Foreign key with roles table
 * permission_id: permission provided to the role like create quiz to admin - Foreign key with permissions table
 * Both above ids together act as primary key
 */
export function createRolePermissionTable() {
  const db = getDB();
  db.run(`CREATE TABLE role_permissions (
  role_id INTEGER,
  permission_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id),
  PRIMARY KEY (role_id, permission_id)
);
`);
}

export function addRoles() {
  const db = getDB();

  // Insert roles - Admin and learner
  db.run(`INSERT INTO roles (title) VALUES (?)`, [Roles.ADMIN], (err) => {
    if (err) console.log("Error inserting ADMIN role:", err);
  });
  db.run(`INSERT INTO roles (title) VALUES (?)`, [Roles.LEARNER], (err) => {
    if (err) console.log("Error inserting LEARNER role:", err);
  });

  // Insert permissions - Create quiz/edit quiz/ delete quiz/ take quiz/ create question
  db.run(
    `INSERT INTO permissions (title) VALUES (?)`,
    [Permissions.CREATE_QUIZ],
    (err) => {
      if (err) console.log("Error inserting CREATE_QUIZ permission:", err);
    }
  );
  db.run(
    `INSERT INTO permissions (title) VALUES (?)`,
    [Permissions.EDIT_QUIZ],
    (err) => {
      if (err) console.log("Error inserting EDIT_QUIZ permission:", err);
    }
  );
  db.run(
    `INSERT INTO permissions (title) VALUES (?)`,
    [Permissions.DELETE_QUIZ],
    (err) => {
      if (err) console.log("Error inserting DELETE_QUIZ permission:", err);
    }
  );
  db.run(
    `INSERT INTO permissions (title) VALUES (?)`,
    [Permissions.TAKE_QUIZ],
    (err) => {
      if (err) console.log("Error inserting TAKE_QUIZ permission:", err);
    }
  );
  db.run(
    `INSERT INTO permissions (title) VALUES (?)`,
    [Permissions.CREATE_QUESTION],
    (err) => {
      if (err) console.log("Error inserting CREATE_QUESTION permission:", err);
    }
  );

  /** Insert role_permissions mapping
   * Admin - Create quiz
   * Admin - Create question
   * Learner - take quiz
   * Admin - take quiz
   */
  db.run(
    `
    INSERT INTO role_permissions (role_id, permission_id)
    VALUES ((SELECT id FROM roles WHERE title = ?), (SELECT id FROM permissions WHERE title = ?));
  `,
    [Roles.ADMIN, Permissions.CREATE_QUIZ]
  );
  db.run(
    `
    INSERT INTO role_permissions (role_id, permission_id)
    VALUES ((SELECT id FROM roles WHERE title = ?), (SELECT id FROM permissions WHERE title = ?));
  `,
    [Roles.ADMIN, Permissions.CREATE_QUESTION]
  );

  db.run(
    `
    INSERT INTO role_permissions (role_id, permission_id)
    VALUES ((SELECT id FROM roles WHERE title = ?), (SELECT id FROM permissions WHERE title = ?));
  `,
    [Roles.ADMIN, Permissions.TAKE_QUIZ]
  );

  db.run(
    `
    INSERT INTO role_permissions (role_id, permission_id)
    VALUES ((SELECT id FROM roles WHERE title = ?), (SELECT id FROM permissions WHERE title = ?));
  `,
    [Roles.LEARNER, Permissions.TAKE_QUIZ]
  );
}

/** Get user details which matching user name. If not founds sends error */
export async function getUserByUserName(username: string): Promise<User> {
  const db = getDB();
  return new Promise((res, rej) => {
    db.get(
      "Select * from users where username = ?",
      [username],
      (err, user) => {
        if (err) {
          rej(err);
        } else {
          res(user as User);
        }
      }
    );
  });
}

/** Creates and inserts a new user in the table. Used for registeration for a new admin/learner user */
export async function addNewUser(user: NewUser): Promise<User> {
  const db = getDB();
  return new Promise((res, rej) => {
    db.get(
      "Insert into users (username,password,role_id) Values (?,?,?)",
      [user.username, user.password, user.role_id],
      (err, user) => {
        if (err) {
          rej(`Error adding a new user: ${err}`);
        } else {
          res(user as User);
        }
      }
    );
  });
}

/** Checks if a role has a specific permission. */
export async function checkPermission(
  roleId: number,
  permission: string
): Promise<boolean> {
  const db = getDB();
  return new Promise((res, rej) => {
    db.get(
      `SELECT * FROM role_permissions rp
        JOIN roles r ON rp.role_id = r.id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE r.id = ? AND p.title = ?`,
      [roleId, permission],
      (err, row) => {
        if (err) {
          rej(`Error checking permission: ${err}`);
        } else {
          if (!row) {
            res(false);
          }
          res(true);
        }
      }
    );
  });
}

/** Get role details which matching title. If not founds sends error */
export async function getRoleByTitle(title: string): Promise<Role> {
  const db = getDB();
  return new Promise((res, rej) => {
    db.get("Select * from roles where title = ?", [title], (err, role) => {
      if (err) {
        rej(err);
      } else {
        res(role as Role);
      }
    });
  });
}
