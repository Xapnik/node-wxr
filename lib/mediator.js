(function() {
  var Importer, builder, create;

  exports.builder = builder = require("xmlbuilder");

  var { create } = require("xmlbuilder2");

  exports.creator = create;

  exports.Importer = Importer = require("./importer");

}).call(this);
