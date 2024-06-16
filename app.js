import express from 'express';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import advertisementRoutes from './routes/advertisements.js';
import uploadRoutes from './routes/uploads.js';
import searchRoutes from './routes/search.js';
import indexRoutes from './routes/index.js';
import signupRoute from './routes/signup.js';
import loginRoute from './routes/login.js';
import logoutRoute from './routes/logout.js';
import userRoutes from './routes/user.js';
import likedAdvertisementsRouter from './routes/likedAdvertisements.js';
import unlikedAdvertisementsRouter from './routes/unlikedAdvertisements.js';
import privateMessagesRouter from './routes/privatemessages.js';

const app = express();
const PORT = 5000;
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(dirname, 'views'));

app.use(cookieParser());

const uploadDir = path.join(dirname, 'uploadDir');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

app.use(express.urlencoded({ extended: true }));

app.use('/', indexRoutes);
app.use('/ad', advertisementRoutes);
app.use('/upload', uploadRoutes);
app.use('/search', searchRoutes);
app.use('/advertisement', advertisementRoutes);
app.use('/signup', signupRoute);
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/user', userRoutes);
app.use('/liked', likedAdvertisementsRouter);
app.use('/unliked', unlikedAdvertisementsRouter);
app.use('/privatemessages', privateMessagesRouter);

app.use(express.static(path.join(dirname, '/public')));
app.use('/uploadDir', express.static(uploadDir));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
