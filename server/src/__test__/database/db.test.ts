/** Test file for Database operations */

import { createInMemoryDB, getDB } from "../../database/db";

/** mock sqlite3 database, as we dont want actual db queries to be hit during unit tests. */
jest.mock("sqlite3", () => {
  return { Database: jest.fn() };
});

/** reset the mocks before each test written below. This is specific to each test file. */
beforeEach(() => {
  jest.clearAllMocks();
});

describe(`Database Setup Operations`, () => {
  test(`Given database, then it should create in memory database`, () => {
    createInMemoryDB();
    expect(require("sqlite3").Database).toHaveBeenCalledWith(":memory:");
  });

  test(`Given database has already been created, then it should return same db instance whenever called, because we want to work with the same DB in different services`, () => {
    createInMemoryDB();

    const firstCall = getDB();
    const secondCall = getDB();

    expect(firstCall).toEqual(secondCall);
  });

  test(`Given database has not been created, when trying to fetch DB instance, then it should create and  return db instance whenever called`, () => {
    const firstCall = getDB();
    const secondCall = getDB();

    expect(firstCall).toEqual(secondCall);
  });
});
