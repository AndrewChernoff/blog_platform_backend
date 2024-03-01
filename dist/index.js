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
const registerValidation_1 = require("./validations/registerValidation");
const checkAuth_1 = __importDefault(require("./utils/checkAuth"));
const multer_1 = __importDefault(require("multer"));
const AuthController = __importStar(require("./controllers/auth-controller"));
const PostsController = __importStar(require("./controllers/posts-controller"));
const handleValidationError_1 = __importDefault(require("./utils/handleValidationError"));
mongoose_1.default
    .connect("mongodb+srv://whitedrew538:wwwwwwwwww@cluster0.z6b0ju0.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("DB connected"))
    .catch((error) => console.log("Failed: " + error));
const app = (0, express_1.default)();
const storage = multer_1.default.diskStorage({
    destination: (_, __, cb) => {
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
        return res.json({
            url: `/uploads/${req.file.originalname}`
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
app.get('/posts', checkAuth_1.default, PostsController.getAll);
app.post('/posts', checkAuth_1.default, registerValidation_1.postValidation, handleValidationError_1.default, PostsController.create);
app.get('/posts/:id', checkAuth_1.default, handleValidationError_1.default, PostsController.getOne);
app.patch('/posts/:id', checkAuth_1.default, registerValidation_1.postValidation, handleValidationError_1.default, PostsController.updateOne);
app.listen(4444, () => {
    console.log(`[server]: Server is running at http://localhost:${4444}`);
});
