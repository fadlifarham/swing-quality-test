import multer from "multer";
import path from "path";

// upload file path
const FILE_PATH = "uploads";

const generateFileName = (file: Express.Multer.File): string => {
  const filename: string = file.originalname;
  const arrFilename = filename.split(".");
  return `file-${Date.now()}.${arrFilename[arrFilename.length - 1]}`;
};

const storageInvitation = multer.diskStorage({
  destination: path.normalize(`${FILE_PATH}/invitation`),
  filename: (req, file, cb) => {
    const filename = generateFileName(file);
    cb(null, filename);
  }
});

const storageWishcard = multer.diskStorage({
  destination: path.normalize(`${FILE_PATH}/wish-card`),
  filename: (req, file, cb) => {
    const filename = generateFileName(file);
    cb(null, filename);
  }
});

const storageWishcardTemplate = multer.diskStorage({
  destination: path.normalize(`${FILE_PATH}/wishcard-template`),
  filename: (req, file, cb) => {
    const filename = generateFileName(file);
    cb(null, filename);
  }
});

export const upload = {
  uploadInvitation: multer({ storage: storageInvitation }),
  uploadWishcard: multer({ storage: storageWishcard }),
  uploadWishcardTemplate: multer({ storage: storageWishcardTemplate }),
  handlePhotobooth: multer({ storage: multer.memoryStorage() })
};
