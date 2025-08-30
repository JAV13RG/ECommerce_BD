const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 }, // 10 MB maximo
    fileFilter: (req, file, cb) => {
      const allowed = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
      if (allowed.includes(file.mimetype)) cb(null, true);
      else cb(new Error('Tipo de archivo no permitido'), false);
  }
});

module.exports = upload;