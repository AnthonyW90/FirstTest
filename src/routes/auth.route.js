const { AsyncRouter } = require("express-async-router");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
// const jwt = require("jsonwebtoken");

const User = require("../models/User");
// const jwtMiddleware = require("../helpers/jwt-middleware");

// const controller = AsyncRouter();


