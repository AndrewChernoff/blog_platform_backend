"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const registerValidation_1 = require("./validations/registerValidation");
const checkAuth_1 = __importDefault(require("./utils/checkAuth"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const AuthController = __importStar(require("./controllers/auth-controller"));
const PostsController = __importStar(require("./controllers/posts-controller"));
const CommentsController = __importStar(require("./controllers/comments-controller"));
const handleValidationError_1 = __importDefault(require("./utils/handleValidationError"));
dotenv_1.default.config();
const DB_adress = process.env.MONGO_DBCONNECT_URI;
mongoose_1.default
    .connect(DB_adress)
    .then(() => console.log("DB connected"))
    .catch((error) => console.log("Failed: " + error));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const storage = multer_1.default.diskStorage({
    destination: (_, __, cb) => {
        if (!fs_1.default.existsSync('uploads')) {
            fs_1.default.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: false,
}));
app.use('/uploads', express_1.default.static('uploads'));
app.post("/upload", upload.single('image'), (req, res) => {
    if (req.file) {
        return res.status(200).json({
            url: `/${req.file.path}` /* `/uploads/${req.file.originalname}` */
        });
    }
    else {
        return res.status(500);
    }
});
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server is running");
});
app.post("/auth/register", registerValidation_1.registerValidation, handleValidationError_1.default, AuthController.register);
app.post("/auth/login", registerValidation_1.logInValidation, handleValidationError_1.default, AuthController.login);
app.get('/auth/me', checkAuth_1.default, AuthController.getMe);
app.get('/posts', PostsController.getAll);
app.post('/posts', checkAuth_1.default, registerValidation_1.postValidation, handleValidationError_1.default, PostsController.create);
app.get('/posts/:id', handleValidationError_1.default, PostsController.getOne);
app.get('/posts/tag/:tagName', handleValidationError_1.default, PostsController.getByTagName);
app.delete('/posts/:id', checkAuth_1.default, handleValidationError_1.default, PostsController.deleteOne);
app.patch('/posts/:id', checkAuth_1.default, registerValidation_1.postValidation, handleValidationError_1.default, PostsController.updateOne);
app.get('/tags', PostsController.getLastTags);
app.get('/comments/:postId', CommentsController.getAll);
app.post('/comments/:postId', checkAuth_1.default, CommentsController.create);
app.delete('/comments/:commentId', checkAuth_1.default, CommentsController.deleteComment);
const port = process.env.PORT || 4444;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
