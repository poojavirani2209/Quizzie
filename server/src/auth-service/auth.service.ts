import { addNewUser, getRoleByTitle, getUserByUserName } from "./auth.model";
import bcrypt from "bcryptjs";
import { NewUser, Role, User } from "./auth.types";
import jwt from "jwt-simple";

/**
 * This Secret key is used for encoding/decoding JWT. Thoug it is hardcoded here, it should come from .env file in production.
 */
const SECRET_KEY = "SecretKey";

/**
 * Function to login an existing user. If user with  specific username/password does not exist, proper response is returned.
 * @param username
 * @param password
 * @returns
 */
export async function authenticate(username: string, password: string) {
  return new Promise(async (res, rej) => {
    try {
      const user: User = await getUserByUserName(username);
      if (!user) {
        //If user with specific username is not found.
        return rej({
          statusCode: 401,
          message: "Please provide proper credentials. The user was not found",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        //if provided password does not match for the username.
        return rej({
          statusCode: 401,
          message: "Please provide proper password.",
        });
      }

      const token = generateToken(user); //generates JWT which has userdetails when decoded.
      console.log("Created",token)
      res({ token, role: user.role_id });
    } catch (error: any) {
      console.log(`Error occurred while authrnticating user:${error}`);
      rej(error);
    }
  });
}

/** Generates JWT based on preivate secret key and user details, which can later be user to authorize user when requests something. */
function generateToken(user: User) {
  const payload = {
    id: user.id,
    username: user.username,
    role_id: user.role_id,
  };
  return jwt.encode(payload, SECRET_KEY);
}

/**
 * Function to register a new user with provided username and password, and title specifies the role which user is registering with.
 * @param username
 * @param password
 * @param title
 * @returns
 */
export async function registerNewUser(
  username: string,
  password: string,
  title: string
) {
  return new Promise(async (res, rej) => {
    try {
      const role: Role = await getRoleByTitle(title);
      const hashedPassword = bcrypt.hashSync(password, 10); //password is first encrypted then stored for security
      const newUser: NewUser = {
        username,
        password: hashedPassword,
        role_id: role.id,
      };
      let user = await addNewUser(newUser);
      res(user);
    } catch (error: any) {
      console.log(`Error occurred while registering a new user:${error}`);
      rej(error);
    }
  });
}
