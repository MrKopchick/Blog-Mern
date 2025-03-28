import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'не вірний формат почти').isEmail(),
    body('password', 'пароль повинен містити мінімум 5 символів ').isLength({min: 6}),
    body('fullName', `вкажіть ім'я`).isLength({min: 3}),
    body('avatarUrl', 'не вірне посилання на аватар').optional().isURL()
];

export const loginValidation = [
    body('email', 'не вірний формат почти').isEmail(),
    body('password', 'пароль повинен містити мінімум 5 символів ').isLength({min: 5})
];