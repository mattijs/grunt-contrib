/**
 * Task: jst
 * Description: Compile underscore templates to JST file
 * Dependencies: underscore
 * Contributor: @tbranyen
 */

module.exports = function(grunt) {
  var _ = grunt.util._;

  grunt.registerMultiTask("jst", "Compile underscore templates to JST file", function() {
    var options = this.options({
      namespace: "JST",
      templateSettings: {}
    });

    var data = this.data;

    Object.keys(data.files).forEach(function(dest) {
      var src = data.files[dest];
      var srcFiles = grunt.file.expandFiles(src);

      dest = grunt.template.process(dest);

      var jstOutput = [];
      var jstNamespace = "this['" + options.namespace + "']";

      jstOutput.push(jstNamespace + " = " + jstNamespace + " || {};");

      srcFiles.forEach(function(srcFile) {
        var jstSource = grunt.file.read(srcFile);

        jstOutput.push(grunt.helper("jst", jstSource, srcFile, jstNamespace, options.templateSettings));
      });

      if (jstOutput.length > 0) {
        grunt.file.write(dest, jstOutput.join("\n\n"));
        grunt.log.writeln("File '" + dest + "' created.");
      }
    });
  });

  grunt.registerHelper("jst", function(source, filepath, namespace, templateSettings) {
    try {
      return namespace + "['" + filepath + "'] = " + _.template(source, false, templateSettings).source + ";";
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn("JST failed to compile.");
    }
  });
};