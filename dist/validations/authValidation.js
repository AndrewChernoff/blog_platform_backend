"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const registerValidation = [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 5 }),
    (0, express_validator_1.body)('fullName').isLength({ min: 3 }),
    (0, express_validator_1.body)('avatarUrl').optional().isURL(),
];
