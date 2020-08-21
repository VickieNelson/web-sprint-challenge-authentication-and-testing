const request = require("supertest");
const server = require("./server.js");
const db = require("../database/dbConfig");

describe("server", () => {
  beforeEach(() => db("users").truncate());

  describe("POST /register", () => {
    it("201 OK", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "user1", password: "password" });
      expect(await db("users")).toHaveLength(1);

      await request(server)
        .post("/api/auth/register")
        .send({ username: "user2", password: "password" });
      expect(await db("users")).toHaveLength(2);

      await request(server)
        .post("/api/auth/register")
        .send({ username: "user3", password: "password" });
      expect(await db("users")).toHaveLength(3);

      await request(server)
        .post("/api/auth/register")
        .send({ username: "user4", password: "password" });
      expect(await db("users")).not.toHaveLength(3);
    });

    it("Testing No Username Duplicates", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "user1", password: "password" });
      expect(await db("users")).toHaveLength(1);

      await request(server)
        .post("/api/auth/register")
        .send({ username: "user1", password: "password" });
      expect(await db("users")).toHaveLength(1);
    });
  });

  describe("POST /login", () => {
    it("200 OK", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "user", password: "password" });
      let result = await request(server)
        .post("/api/auth/login")
        .send({ username: "user", password: "password" });
      expect(result.statusCode).toBe(200);
    });

    it("Login Failure - 401", async () => {
      let result = await request(server)
        .post("/api/auth/login")
        .send({ username: "user", password: "password" });
      expect(result.statusCode).toBe(401);
    });
  });
});
