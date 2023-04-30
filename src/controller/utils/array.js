const chp = require("child_process");

// Array of objects
const changeObjectKeyIdentificator = (
  array = [],
  keysToChangeIdentificators = []
) => {
  try {    
    array.forEach((object) => {
      keysToChangeIdentificators[0].originalKeysIdentificators.forEach((keyToChangeIdentificator, index) => {
        for (const key in object) {
          const i = index;
          if (Object.hasOwnProperty.call(object, key)) {
            if (key === keyToChangeIdentificator) {
              object[keysToChangeIdentificators[1].newKeysIdentificators[i]] = object[key];
              delete object[key];
            }
          }
        }
      });
    });
    return array;
  } catch (error) {
    console.error(error);
  }
};

const removeObjectByKeyValue = (
  arrayOfObjects = [],
  keyValue = [],
  logicalOperator = "or"
) => {
  if (logicalOperator !== "or" && logicalOperator !== "and") {
    throw new Error("Not a valid logical operator parameter");
  }

  return arrayOfObjects.filter((obj) => {
    const matchCounts = keyValue.map((keyValPair) => {
      return Object.entries(keyValPair).filter(([key, value]) => {
        return obj.hasOwnProperty(key) && obj[key] === value;
      }).length;
    });

    const totalMatches = matchCounts.reduce((acc, count) => acc + count, 0);

    if (logicalOperator === "or") {
      return totalMatches === 0;
    } else if (logicalOperator === "and") {
      return totalMatches !== keyValue.length;
    }
  });
};

const removeObjectByKeyIdentificator = (array = [], keyIdentificator = []) => {
  try {
    keyIdentificator.map((key) => {
      delete array[key];
    });
    return array;
  } catch (error) {
    console.error(error);
  }
};

const keepObjectPropertyByKeyIdentificator = (array = [], keyIdentificators = []) => {
  try {
    const newArray = [];
    array.forEach((object) => {
      const objectTemp = {};
      for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
          const element = object[key];
          keyIdentificators.forEach((keyIdentificator) => {
            if (key === keyIdentificator) {
              objectTemp[keyIdentificator] = element;
            }
          });
        }
      }
      newArray.push(objectTemp);
    });
    return newArray;
  } catch (error) {
    console.error(error);
  }
};

const keepObjectByKeyValue = (
  arrayOfObjects = [],
  keyValue = [],
  logicalOperator = "or"
) => {
  if (logicalOperator !== "or" && logicalOperator !== "and") {
    throw new Error("Not a valid logical operator parameter");
  }

  return arrayOfObjects.filter((obj) => {
    const matchCounts = keyValue.map((keyValPair) => {
      return Object.entries(keyValPair).filter(([key, value]) => {
        return obj.hasOwnProperty(key) && obj[key] === value;
      }).length;
    });

    const totalMatches = matchCounts.reduce((acc, count) => acc + count, 0);

    if (logicalOperator === "or") {
      return totalMatches > 0;
    } else if (logicalOperator === "and") {
      return totalMatches === keyValue.length;
    }
  });
};

const matchObjectsByKeyValueAndAddKeysToMerge = (
  arrayThatIsChanged,
  arrayThatChanges,
  keyValuesToMatch,
  keysToMerge,
  logicalOperator = "AND"
) => {
  const result = [];

  arrayThatIsChanged.forEach((obj1) => {
    arrayThatChanges.forEach((obj2) => {
      if (logicalOperator.toUpperCase() === "AND") {
        keyValuesToMatch.every((key) => {
          if (key.dataFormat) {
            switch (key.dataFormat.option) {
              case 'substring':
                if (obj1[key.originalIdentificator].substring(key.dataFormat.start, key.dataFormat.end) === obj2[key.originalIdentificator].substring(key.dataFormat.start, key.dataFormat.end)) {                  
                  const mergedObj = { ...obj1 };
                  
                  keysToMerge.forEach((key) => {
                    mergedObj[key.newIdentificator] = obj2[key.originalIdentificator];
                  });

                  result.push(mergedObj);
                }
                break;
            
              default:
                if (obj1[key.originalIdentificator] === obj2[key.originalIdentificator]) {
                  const mergedObj = { ...obj1 };

                  keysToMerge.forEach((key) => {
                    mergedObj[key.newIdentificator] = obj2[key.originalIdentificator];
                  });

                  result.push(mergedObj);
                }
                break;
            }
          }

          if (!key.dataFormat) {
            obj1[key.originalIdentificator] === obj2[key.originalIdentificator]
          }
        });
      } else if (logicalOperator.toUpperCase() === "OR") {
        keyValuesToMatch.some((key) => {
          if (key.dataFormat) {
            switch (key.dataFormat.option) {
              case 'substring':
                if (obj1[key.originalIdentificator].substring(key.dataFormat.start, key.dataFormat.end) === obj2[key.originalIdentificator].substring(key.dataFormat.start, key.dataFormat.end)) {                  
                  const mergedObj = { ...obj1 };

                  keysToMerge.forEach((key) => {
                    mergedObj[key.newIdentificator] = obj2[key];
                  });

                  result.push(mergedObj);
                }
                break;
            
              default:
                if (obj1[key.originalIdentificator] === obj2[key.originalIdentificator]) {
                  const mergedObj = { ...obj1 };

                  keysToMerge.forEach((key) => {
                    mergedObj[key.newIdentificator] = obj2[key];
                  });

                  result.push(mergedObj);
                }
                break;
            }
          }

          if (!key.dataFormat) {
            if (obj1[key.originalIdentificator] === obj2[key.originalIdentificator]) {
              const mergedObj = { ...obj1 };

              keysToMerge.forEach((key) => {
                mergedObj[key.newIdentificator] = obj2[key];
              });

              result.push(mergedObj);
            }
          }
        });
      } else {
        throw new Error("Invalid logical operator. Supported values: AND, OR");
      }
    });
  });

  return result;
};

const matchObjectsByKeyValueAndMerge = (
  arrayThatIsOverwrited,
  arrayThatOverwrites,
  keyValuesToMatch,
  logicalOperator = "AND"
) => {
  try {    
    const result = [];
  
    arrayThatIsOverwrited.forEach((obj1) => {
      arrayThatOverwrites.forEach((obj2) => {
        let match;
  
        if (logicalOperator.toUpperCase() === "AND") {
          match = keyValuesToMatch.every((key) => obj1[key] === obj2[key]);
        } else if (logicalOperator.toUpperCase() === "OR") {
          match = keyValuesToMatch.some((key) => obj1[key] === obj2[key]);
        } else {
          throw new Error("Invalid logical operator. Supported values: AND, OR");
        }
  
        if (match) {
          const mergedObj = { ...obj1, ...obj2 };
          result.push(mergedObj);
        }
      });
    });
  
    return result;
  } catch (error) {
    console.error(error);
  }
};

const matchObjectsByKeyValueAndCreateNewArray = (
  arrayToMatch,
  arrayToBecomeTheNew,
  keyValuesToMatch,
  logicalOperator = "AND"
) => {
  const result = [];

  arrayToBecomeTheNew.forEach((obj1) => {
    let match;
    arrayToMatch.forEach((obj2) => {
      if (logicalOperator.toUpperCase() === "AND") {
        match = keyValuesToMatch.every((key) => obj1[key] === obj2[key]);
      } else if (logicalOperator.toUpperCase() === "OR") {
        match = keyValuesToMatch.some((key) => obj1[key] === obj2[key]);
      } else {
        throw new Error("Invalid logical operator. Supported values: AND, OR");
      }
    });
    if (match) {
      result.push({ ...obj1 });
    }
  });

  return result;
};

const unmatchObjectsByKeyValueAndMerge = (
  arrayThatIsOverwrited,
  arrayThatOverwrites,
  keyValuesToMatch,
  logicalOperator = "AND"
) => {
  const result = [];

  arrayThatIsOverwrited.forEach((obj1) => {
    arrayThatOverwrites.forEach((obj2) => {
      let match;

      if (logicalOperator.toUpperCase() === "AND") {
        match = keyValuesToMatch.every((key) => obj1[key] === obj2[key]);
      } else if (logicalOperator.toUpperCase() === "OR") {
        match = keyValuesToMatch.some((key) => obj1[key] === obj2[key]);
      } else {
        throw new Error("Invalid logical operator. Supported values: AND, OR");
      }

      if (!match) {
        const mergedObj = { ...obj1, ...obj2 };
        result.push(mergedObj);
      }
    });
  });

  return result;
};

const unmatchObjectsByKeyValueAndCreateNewArray = (
  arrayToMatch,
  arrayToBecomeTheNew,
  keyValuesToMatch,
  logicalOperator = "AND"
) => {
  const result = [];

  arrayToBecomeTheNew.forEach((obj1) => {
    let match;
    arrayToMatch.forEach((obj2) => {
      if (logicalOperator.toUpperCase() === "AND") {
        match = keyValuesToMatch.every((key) => obj1[key] === obj2[key]);
      } else if (logicalOperator.toUpperCase() === "OR") {
        match = keyValuesToMatch.some((key) => obj1[key] === obj2[key]);
      } else {
        throw new Error("Invalid logical operator. Supported values: AND, OR");
      }
    });
    if (!match) {
      result.push({ ...obj1 });
    }
  });

  return result;
};
// Simple arrays
const removeByValue = (array = [], value = []) => {
  return array.filter((element) => !value.includes(element));
};

const removeRepeatedValues = (array = []) => {
  return array.filter((element, index) => array.indexOf(element) === index);
};

const createArrayOverFolderFiles = (folderPath) => {
  try {
    const result = chp.execSync(`ls`, { cwd: folderPath });

    return result.toString().split(/\n/);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  changeObjectKeyIdentificator,
  removeByValue,
  removeObjectByKeyValue,
  removeRepeatedValues,
  removeObjectByKeyIdentificator,
  keepObjectByKeyValue,
  keepObjectPropertyByKeyIdentificator,
  matchObjectsByKeyValueAndAddKeysToMerge,
  matchObjectsByKeyValueAndMerge,
  matchObjectsByKeyValueAndCreateNewArray,
  unmatchObjectsByKeyValueAndMerge,
  unmatchObjectsByKeyValueAndCreateNewArray,
  createArrayOverFolderFiles,
};
