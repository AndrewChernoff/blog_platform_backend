import { body } from 'express-validator'


export const registerValidation = [
    body ('email').isEmail(),
    body('password').isLength({min: 5}),
    body('fullName').isLength({min: 3}),
    body('avatarUrl').optional().isURL(),
]

export const logInValidation = [
    body ('email').isEmail(),
    body('password').isLength({min: 5}),
]

export const postValidation = [
    body('title').isLength({min: 3}),
    body('text').isLength({min: 3}),
    body('tags').isArray(),
    body('imageUrl').optional().isURL(),
]