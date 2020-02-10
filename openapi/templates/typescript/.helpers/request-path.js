module.exports = (Handlebars, _) =>{

  /**
   * Build the request path.
   */
  Handlebars.registerHelper('requestPath', (str) => {
    let result = '\'';
    const paths = str.split('/');
    paths.forEach((element, index, array) => {
      if (element.startsWith(':')) {
        result = result.concat('/\' + ' + element.substring(1));
        if(index < array.length - 1) {
          result = result.concat(' + \'');
        }
      }
      else if (element.length > 0) {
        result = result.concat('/' + element);
        if(index == array.length - 1) {
          result = result.concat('\'');
        }
      }
    });
    return result;
  });
}
