module.exports.register = function (Handlebars, options) {
    'use strict';

    var options = options || {};

    Handlebars.registerHelper('webfont', function (context) {

        var name = (context.webfont || options.webfont || '').replace(/\s/g, '+');

        if(name) {
            return new Handlebars.SafeString('<link href="//fonts.googleapis.com/css?family='+ name +'" rel="stylesheet" type="text/css">');
        }

        return name;
    });
};