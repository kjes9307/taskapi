const multer = require('multer');
const upload = multer({
    limits: {
        // 限制上傳檔案的大小為 1MB
        fileSize: 1*1024*1024
    },
    fileFilter(req, file, cb) {
        // 只接受三種圖片格式
        if (!file.originalname.toLocaleLowerCase().match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('只接受jpg,jpeg,png等格式'))
        }
        cb(null, true)
    }
}).any();


module.exports = upload;
