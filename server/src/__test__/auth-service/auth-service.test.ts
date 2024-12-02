import request from "supertest";
import app from "../../app";
import {
  addNewUser,
  checkPermission,
  getRoleByTitle,
  getUserByUserName,
} from "../../auth-service/auth.model";
import {
  NewUser,
  Permissions,
  Role,
  Roles,
} from "../../auth-service/auth.types";
import bcrypt from "bcryptjs";
import jwt from "jwt-simple";
import { NextFunction, Request, Response } from "express";
import {
  authorizePermission,
  verifyToken,
} from "../../auth-service/auth.middleware";

jest.mock(`../../auth-service/auth.model`);
jest.mock("bcryptjs");
jest.mock("jwt-simple", () => ({
  encode: jest.fn(),
  decode: jest.fn(),
}));

let adminUser: NewUser = {
  username: "adminUser",
  password: "adminPassword",
  role_id: 1,
};

let learner: NewUser = {
  username: "learnerUser",
  password: "learnerPassword",
  role_id: 2,
};

let adminRole: Role = {
  id: 1,
  title: Roles.ADMIN,
};

let learnerRole: Role = {
  id: 2,
  title: Roles.LEARNER,
};

describe("Register User", () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  // username password not provided - 204
  // succ register - 201
  // error while getting role from title - 500 invalid role
  // error hashing password - 500\
  // error while adding new user - 500

  test("Given an admin user with proper values, then it should register an admin user successfully", async () => {
    bcrypt.hashSync.mockReturnValue("adminPassword");

    (addNewUser as jest.Mock).mockResolvedValue(adminUser);
    (getRoleByTitle as jest.Mock).mockResolvedValue(adminRole);

    const response = await request(app)
      .post("/auth/admin/register")
      .send(adminUser);

    expect(response.status).toBe(201);
    expect(response.body.username).toBe("adminUser");
  });

  test("Given an learner user with proper values, then it should register an learner user successfully", async () => {
    bcrypt.hashSync.mockReturnValue("learnerPassword");

    (addNewUser as jest.Mock).mockResolvedValue(learner);
    (getRoleByTitle as jest.Mock).mockResolvedValue(learnerRole);

    const response = await request(app).post("/auth/register").send(learner);

    expect(response.status).toBe(201);
    expect(response.body.username).toBe("learnerUser");
  });

  test("Given an admin user with no username provided, then it should not register an admin user", async () => {
    const response = await request(app).post("/auth/admin/register").send({
      password: "adminPassword",
      roleId: 1,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details- username and password, for registering a new user`
    );
  });

  test("Given an learner user with no username provided, then it should not register a learner user", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ password: "learnerPassword", roleId: 2 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details - username and password, for registering a new user`
    );
  });

  test("Given an admin user with no password provided, then it should not register an admin user", async () => {
    const response = await request(app)
      .post("/auth/admin/register")
      .send({ username: "adminUser", roleId: 1 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details- username and password, for registering a new user`
    );
  });

  test("Given an learner user with no password provided, then it should not register a learner user", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ username: "learnerUser", roleId: 2 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details - username and password, for registering a new user`
    );
  });

  test("Given error occurs while getting role from title for admin user, then it should not register an admin user", async () => {
    (getRoleByTitle as jest.Mock).mockRejectedValue(`Error while getting role`);

    const response = await request(app)
      .post("/auth/admin/register")
      .send(adminUser);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      `Error occurred while registering an admin user`
    );
  });

  test("Given error occurs while getting role from title for learner user, then it should not register a learner user", async () => {
    (getRoleByTitle as jest.Mock).mockRejectedValue(`Error while getting role`);
    const response = await request(app).post("/auth/register").send(learner);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      `Error occurred while registering a user`
    );
  });

  test("Given error occurs while hashing password for admin user, then it should not register an admin user", async () => {
    (getRoleByTitle as jest.Mock).mockResolvedValue(adminRole);
    bcrypt.hashSync.mockImplementation(() => {
      throw new Error(`Error occurred while hashing password`);
    });

    const response = await request(app)
      .post("/auth/admin/register")
      .send(adminUser);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      `Error occurred while registering an admin user`
    );
  });

  test("Given error occurs while hashing password for learner user, then it should not register a learner user", async () => {
    (getRoleByTitle as jest.Mock).mockResolvedValue(learnerRole);
    bcrypt.hashSync.mockImplementation(() => {
      throw new Error(`Error occurred while hashing password`);
    });

    const response = await request(app).post("/auth/register").send(learner);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      `Error occurred while registering a user`
    );
  });

  test("Given database error occurs while adding new user for admin user, then it should not register an admin user", async () => {
    (getRoleByTitle as jest.Mock).mockResolvedValue(adminRole);
    bcrypt.hashSync.mockReturnValue("adminPassword");
    (addNewUser as jest.Mock).mockRejectedValue(
      `Error occurred while adding new user`
    );

    const response = await request(app)
      .post("/auth/admin/register")
      .send(adminUser);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      `Error occurred while registering an admin user`
    );
  });

  test("Given database error occurs while adding new user for learner user, then it should not register a learner user", async () => {
    (getRoleByTitle as jest.Mock).mockResolvedValue(learnerRole);
    bcrypt.hashSync.mockReturnValue("learnerPassword");
    (addNewUser as jest.Mock).mockRejectedValue(
      `Error occurred while adding new user`
    );

    const response = await request(app).post("/auth/register").send(learner);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      `Error occurred while registering a user`
    );
  });
});

describe("Login user", () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });
  test("Given a user with proper credentials, then it should login user successfully", async () => {
    bcrypt.compare.mockReturnValue(true);
    (jwt.encode as jest.Mock).mockReturnValue("dummyToken");

    (getUserByUserName as jest.Mock).mockResolvedValue(adminUser);

    const response = await request(app)
      .post("/auth/login")
      .send({ username: adminUser.username, password: adminUser.password });

    expect(response.status).toBe(200);
    expect(response.body.role).toBe(adminUser.role_id);
    expect(response.body.token).toBe("dummyToken");
  });

  test("Given a user with no username in credentials, then it should not login user and specify no content provided error", async () => {
    const response = await request(app).post("/auth/login").send({
      password: "adminPassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details- username and password, for authenticating a user`
    );
  });

  test("Given a user with no password in credentials, then it should not login user and specify no content provided error", async () => {
    const response = await request(app).post("/auth/login").send({
      username: "admin",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details- username and password, for authenticating a user`
    );
  });
  //user not found by username, invalid creds - 401
  test("Given a user not found with given username, then it should not login user and give internal error", async () => {
    (getUserByUserName as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).post("/auth/login").send(adminUser);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "Please provide proper credentials. The user was not found"
    );
  });

  // password invalid, 401
  test("Given a user found but with invalid password, then it should not login user and give internal error", async () => {
    bcrypt.compare.mockReturnValue(false);
    (getUserByUserName as jest.Mock).mockResolvedValue(adminUser);

    const response = await request(app).post("/auth/login").send(adminUser);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Please provide proper password.");
  });
  // succ login - 200
  // erro generating token - 500

  test("Given error occured while generating token, then it should not login user and give internal error", async () => {
    bcrypt.compare.mockReturnValue(true);
    (getUserByUserName as jest.Mock).mockResolvedValue(adminUser);
    (jwt.encode as jest.Mock).mockImplementation(() => {
      throw new Error(`Error occurred while generating token`);
    });

    const response = await request(app).post("/auth/login").send(adminUser);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(`Error occurred while generating token`);
  });

  // db error - 500
  test("Given database error occurred while getting user by username, then it should not login user and give internal error", async () => {
    (getUserByUserName as jest.Mock).mockImplementation(() => {
      throw new Error("Error occurred while getting user by username");
    });
    bcrypt.compare.mockReturnValue(false);

    const response = await request(app)
      .post("/auth/login")
      .send({ username: adminUser.username, password: adminUser.password });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      `Error occurred while getting user by username`
    );
  });
});

describe("Auth Middleware Tests", () => {
  describe("Verify Token", () => {
    test("Given token is missing, when verifying token, then it should return 401 response", async () => {
      const request = { headers: {} } as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await verifyToken(request, response, next);

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({
        message: "Access is denied. Please provide a token",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("Given token is invalid, when verifying token, then it should return 401 response", async () => {
      const request = {
        headers: { authorization: "Bearer invalid-token" },
      } as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      (jwt.decode as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await verifyToken(request, response, next);

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({ message: "Invalid token" });
      expect(next).not.toHaveBeenCalled();
    });

    test("Given token is valid, when verifying token, then it should add user to request and call next middleware.", async () => {
      const request = {
        headers: { authorization: "Bearer valid-token" },
        body:{}
      } as Request;
      const response = {} as Response;
      const next = jest.fn() as NextFunction;

      (jwt.decode as jest.Mock).mockReturnValue(adminUser);

      await verifyToken(request, response, next);

      expect(request.body.user).toEqual(adminUser);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("Authroize Permission", () => {
    test("Given no role is provided in token, when autorizing user, then it should return 401 response", async () => {
      const request = { body: { user: {} } } as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await authorizePermission(Permissions.CREATE_QUIZ)(
        request,
        response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({
        message: "Please provide role. The user was not found",
      });
    });

    test("Given permission(creating quiz) denied for the role(learner) in token, when authorizing user, then should return 403 response", async () => {
      const request = { body: { user: { role_id: 2 } } } as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      (checkPermission as jest.Mock).mockRejectedValue(
        new Error("Permission denied")
      );

      await authorizePermission(Permissions.TAKE_QUIZ)(request, response, next);

      expect(response.status).toHaveBeenCalledWith(403);
      expect(response.json).toHaveBeenCalledWith({
        message: "Permission denied",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("Given role in token (admin) has the permission (create quiz), when authoriing user, then it should call next middleware", async () => {
      const request = { body: { user: { role_id: 1 } } } as Request;
      const response = {} as Response;
      const next = jest.fn() as NextFunction;

      (checkPermission as jest.Mock).mockResolvedValue(true);

      await authorizePermission(Permissions.CREATE_QUIZ)(
        request,
        response,
        next
      );

      expect(next).toHaveBeenCalled();
    });
  });
});
