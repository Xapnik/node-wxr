(function() {
  var Importer, create;

  var { create } = require("xmlbuilder2");

  exports.creator = create;

  exports.Importer = Importer = require("./importer");

}).call(this);
