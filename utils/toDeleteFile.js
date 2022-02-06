const fs = require('fs')
const path = require('path')
const appDir = path.dirname(require.main.filename)// Путь до index.js
module.exports = function (filePath) {
  return new Promise((resolve, reject) => {
    if (filePath) {
      const fullPath = appDir + '/public' + filePath
      try {
        if (fs.existsSync(fullPath)) {
          fs.unlink(fullPath,()=>{
          console.log("Файл успешно удален");
          })
        } else {
          console.log("Отсутствует файл по указанному пути");
        }
        resolve()
      } catch (error) {
        console.log("Ошибка при удалении файла");
        console.log(error);
        reject()
      }
    }
  })

}