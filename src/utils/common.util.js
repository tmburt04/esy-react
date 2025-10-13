/**
 * Converts a string to kebab-case
 * Example: "fooBar" -> "foo-bar"
 */
export function kebabCase(str) {
    return str
      // Handle camelCase by adding space before capitals
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Replace non-alphanumeric chars with spaces
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      // Convert to lowercase and join with hyphens
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');
  }
  
  /**
   * Converts the first character of a string to uppercase
   * Example: "fred" -> "Fred"
   */
  export function upperFirst(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  /**
   * Gets the value at path of object. If path doesn't exist, returns defaultValue
   * Example: get(object, 'a.b.c', 'default')
   */
  export function get(
    obj, 
    path, 
    defaultValue
  ) {
    // Convert string path to array (handles both 'a.b.c' and ['a', 'b', 'c'])
    const keys = Array.isArray(path) 
      ? path 
      : path.split('.');
  
    let result = obj;
    
    for (const key of keys) {
      result = result?.[key];
      
      if (result === undefined) {
        return defaultValue;
      }
    }
    
    return result;
  }