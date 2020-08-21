const server = require("./server");
const express = require("express");
const supertest = require("supertest");
const db = require("../database/dbConfig");

describe("server", () => {
  beforeEach(() => db("suers").truncate);
});

describe("Get request", () => {
  it("returns 401 if no session is found", async () => {
    const res = await supertest(server).get("/api/jokes");
    expect(res.statusCode).toBe(401);
  });
  it("returns a JSON object", async () => {
    const res = await supertest(server).get("/api/jokes");
    expect(res.type).toBe("application/json");
  });
});
