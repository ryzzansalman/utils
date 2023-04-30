const fs = require("fs");
/**
 * 
 * @param {string} stringToFile - Content to file that is gonna be created
 * @param {string} filePath - Eg.: /home/user/folder/fileName.ext
 */
const writeFile = (stringToFile, filePath) => {
  try {
    fs.rmSync(filePath);
    fs.writeFileSync(filePath, stringToFile);
  } catch (error) {
    fs.writeFileSync(filePath, stringToFile);
  }
}

module.exports = {
  writeFile
}