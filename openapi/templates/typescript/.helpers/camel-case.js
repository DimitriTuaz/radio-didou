module.exports = (Handlebars, _) =>{

  /**
   * Converts a string to its camel-cased version.
   */
  Handlebars.registerHelper('camelCase', (str) => {
    return _.camelCase(str);
  });

}
