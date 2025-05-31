process.env.MONGODB_URI = 'mongodb://localhost:27017/blog-app';
process.env.JWT_SECRET = 'test_secret_key_123';
process.env.PORT = '5000';
 
require('./server.js'); 