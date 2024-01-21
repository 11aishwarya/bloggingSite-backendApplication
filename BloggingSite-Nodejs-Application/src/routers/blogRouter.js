const router = require('express')();
const blogController = require('../controllers/blogController');
const middleware = require('../middleware/auth')


router.get('/getAllBlogs', middleware.auth,blogController.getBlogs);
router.post('/createBlog',middleware.auth,blogController.createBlog);
router.patch('/publishedBlog',middleware.auth,blogController.publishedBlog)

module.exports = router;