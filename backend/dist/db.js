"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
});
exports.pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL"))
    .catch((err) => console.error("❌ DB connection error:", err));
