/**
 * This function takes an object and a list of properties with their new types, 
 * and changes the value types of the specified properties within the object.
 *
 * @async
 * @param {Object} objectToChange - The object containing the properties to be changed.
 * @param {Object[]} propertiesTypesToChange - An array of objects, where each object contains the property name and its new type.
 * @param {string} propertiesTypesToChange[].property - The name of the property to change.
 * @param {string} propertiesTypesToChange[].newType - The new type of the property. Supported values: "number", "boolean", "string".
 * @returns {Promise<Object>} A Promise that resolves to the updated object with the changed value types.
 * @throws {Error} If any error occurs during the operation, it logs the error message to the console.
 * 
 * @example
 * const obj = {
 *   age: "30",
 *   name: "Alice",
 *   isActive: "true"
 * };
 *
 * const propertiesTypesToChange = [
 *   { property: "age", newType: "number" },
 *   { property: "isActive", newType: "boolean" }
 * ];
 *
 * (async () => {
 *   const result = await changePropertiesValueType(obj, propertiesTypesToChange);
 *   console.log(result); // Output: { age: 30, name: 'Alice', isActive: true }
 * })();
 */
const changePropertiesValueType = async (objectToChange, propertiesTypesToChange) => {
  try {
    for (const keyToChange in objectToChange) {
      if (Object.hasOwnProperty.call(objectToChange, keyToChange)) {
        const elementToChange = objectToChange[keyToChange];
        propertiesTypesToChange.forEach(objectParam => {
          if (objectToChange[objectParam.property]) {
            switch (objectParam.newType) {
              case "number":
                if (typeof objectToChange[objectParam.property] === "string") {                  
                  objectToChange[objectParam.property] = objectToChange[objectParam.property].replace(",", ".");
                  objectToChange[objectParam.property] = Number(objectToChange[objectParam.property]);
                }
                break;
              
              case "boolean":
                if (
                  typeof objectToChange[objectParam.property] !== "boolean"
                  && objectParam.property !== "hasLeaflet"
                ) {
                  objectToChange[objectParam.property] = 
                  (
                    objectToChange[objectParam.property] === "true" 
                    || objectToChange[objectParam.property] === "True" 
                    || objectToChange[objectParam.property] === "Sim" 
                    || objectToChange[objectParam.property] === "sim" 
                    || objectToChange[objectParam.property] === 1
                  ) 
                  ? true : false;
                }
                
                if (
                  typeof objectToChange[objectParam.property] !== "boolean"
                  && objectParam.property === "hasLeaflet"
                  && typeof objectToChange[objectParam.property] === "string"
                ) {
                  objectToChange[objectParam.property] = true;
                }
                break;

              case "string":
                objectToChange[objectParam.property] = objectToChange[objectParam.property].toString();
                break;
            
              default:
                break;
            }
          }
        });
      }
      
      return objectToChange;
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  changePropertiesValueType 
}