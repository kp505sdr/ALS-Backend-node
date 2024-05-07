import express from 'express';
import serverless from 'serverless-http';
const app = express();
const router = express.Router();
router.get('/', (req, res) => {
res.send('App is running..');
});
app.use('/.netlify/functions/api/v1', router);
module.exports.handler = serverless(app);
const port = 8080;
app.listen(process.env.PORT || port, () => {
	console.log(`Listening on port ${port}`);
});