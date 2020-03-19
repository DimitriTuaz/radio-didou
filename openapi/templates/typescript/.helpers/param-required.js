module.exports = (Handlebars, _) =>{

  Handlebars.registerHelper('paramRequired', (obj) => {
    if (obj.required !== undefined && !obj.required) return '?';
    return ('');
  });
}
