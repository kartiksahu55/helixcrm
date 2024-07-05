import multer from "multer";
import path from "path";
import AppError from "../Utils/errorUtils";

// Multer Config
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, next) => {
    const allowedFileType = [".jpg", ".png", ".jpeg"];

    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedFileType.includes(ext)) {
      next(null, true);
    } else {
      return next(new AppError("File type is not supported."));
    }
  },
});

export default upload;
