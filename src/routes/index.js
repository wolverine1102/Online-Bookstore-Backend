const { Router } = require('express');
const token = require('../middlewares/token');
const checkPermission = require('../middlewares/checkPermission');
const authController = require('../controllers/authController');
const bookController = require('../controllers/bookController');

const router = Router();
const authenticateToken = token.authenticateToken;

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/books/', bookController.getAllBooks);
router.post('/books/', authenticateToken, checkPermission.isAdmin, bookController.createBook);
router.get('/books/:id', bookController.getBook);
router.put('/books/:id', authenticateToken, checkPermission.isAdmin, bookController.updateBook);
router.delete('/books/:id', authenticateToken, checkPermission.isAdmin, bookController.deleteBook);

module.exports.router = router;