import { body } from 'express-validator';

export const postValidaton = [
    body('title', 'Введіть заголовок').isLength({min: 3}).isString(),
    body('text', 'Введіть текст статі').isLength({min: 3}).isString(),
    body('tags', `невірний формат тегів`).optional().isString(),
    body('imageUrl', 'не вірне посилання на зображення').optional().isString()
];