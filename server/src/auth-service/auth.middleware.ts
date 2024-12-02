import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jwt-simple";
import { checkPermission } from "./auth.model";

/**
 * This Secret key is used for encoding/decoding JWT. Thoug it is hardcoded here, it should come from .env file in production.
 */
const SECRET_KEY = "SecretKey";

/**
 * Method to verify token sent in request to ensure no attack has happened.
 * The token is obtained from the authorization header, which is required in the request.
 */
export async function verifyToken(request, response, next) {
  const token = request.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    return response
      .status(401)
      .json({ message: "Access is denied. Please provide a token" });
  }

  try {
    //The JWT has user details, which help to authorize and for userId in further operations.
    const user = jwt.decode(token, SECRET_KEY);
    request.body.user = user;
    next();
  } catch (error) {
    console.log(`Error occurred while verifying the token provided:${error}`);
    return response.status(401).json({ message: "Invalid token" });
  }
}

/**
 * Method to authorize if the current user who provided the token in request, has the permission to perform the operations.
 * The userDetails are available in request body, added by the veritytoken method.
 */
export function authorizePermission(permission: string): RequestHandler {
  return async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    const { role_id } = request.body.user;

    //If there is no role, it means the user isnt authorized to perform the operation.
    if (!role_id) {
      response.status(401).json({
        message: "Please provide role. The user was not found",
      });
    }

    try {
      if(!await checkPermission(role_id, permission)){
        throw new Error(`Access is denied`)
      }
      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.log(`Error occurred while authorizing user:${error}`);
      response.status(403).json({ message: "Permission denied" });
    }
  };
}
