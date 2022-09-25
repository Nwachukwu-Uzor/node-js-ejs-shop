import multer from "multer";

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// 
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
// const upload = multer({ dest: "uploads/" });

export default upload;
