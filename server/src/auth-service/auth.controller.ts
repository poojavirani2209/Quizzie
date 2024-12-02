import { Request, Response } from "express";
import { authenticate, registerNewUser } from "./auth.service";
import { Roles } from "./auth.types";

/**
 * Method to login already existing user.
 * The username and password is accepted as input from request body.
 * By default internal server error is there, if not specified by inner methods.
 */
export async function login(request: Request, response: Response) {
  try {
    const { username, password } = request.body;
    if (!username || !password) {
      response.status(400).json({
        message: `Provide required details- username and password, for authenticating a user`,
      });
    } else {
      const loginResponse = await authenticate(username, password);
      response.status(200).json(loginResponse);
    }
  } catch (error: any) {
    console.log(`Error occurred while logging in user:${error}`);
    response
      .status(error.statusCode || 500)
      .json({ message: error.message || `Internal Server error` });
  }
}

/**
 * Method to register a new learner user based on the userdetails given
 * The username and password is accepted as input from request body.
 * By default internal server error is there, if not specified by inner methods.
 */
export async function registerLearnerUser(
  request: Request,
  response: Response
) {
  try {
    const { username, password } = request.body;
    if (!username || !password) {
      response.status(400).json({
        message: `Provide required details - username and password, for registering a new user`,
      });
    } else {
      const registerResponse = await registerNewUser(
        username,
        password,
        Roles.LEARNER
      );
      console.log(`Registered user with username ${username} successfully.`);
      response.status(201).json(registerResponse);
    }
  } catch (error: any) {
    console.log(`Error occurred while registering a new learner user:${error}`);
    response
      .status(500)
      .json({ message: `Error occurred while registering a user` });
  }
}

/**
 * Method to register a new admin user based on the userdetails given
 * The username and password is accepted as input from request body.
 * By default internal server error is there, if not specified by inner methods.
 */
export async function registerAdminUser(request: Request, response: Response) {
  try {
    const { username, password } = request.body;
    if (!username || !password) {
      response.status(400).json({
        message: `Provide required details- username and password, for registering a new user`,
      });
    } else {
      const registerResponse = await registerNewUser(
        username,
        password,
        Roles.ADMIN
      );
      console.log(`Registered user with username ${username} successfully.`);
      response.status(201).json(registerResponse);
    }
  } catch (error: any) {
    console.log(`Error occurred while registering a new admin user:${error}`);
    response
      .status(500)
      .json({ message: `Error occurred while registering an admin user` });
  }
}
