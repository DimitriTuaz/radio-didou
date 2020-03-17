module.exports = (Handlebars, _) =>{

  /**
   * Checks if a string matches a RegExp.
   */
  Handlebars.registerHelper('match', (lvalue, rvalue, options) => {
    if (arguments.length < 3)
      throw new Error('Handlebars Helper match needs 2 parameters');
    if (!lvalue.match(rvalue)) {
      return options.inverse(this);
    }

    return options.fn(this);
  });
}

