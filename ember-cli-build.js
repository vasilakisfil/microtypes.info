/* eslint-env node */
'use strict';

const StaticSiteJson = require('./broccoli/markdown-to-json');

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

const BroccoliMergeTrees = require('broccoli-merge-trees');

const jsonTree =  new StaticSiteJson('content', {
  contentFolder: 'content'
});

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {});

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  //enable only for dynamic option in ember-remarkable
  //app.import('vendor/ember/ember-template-compiler.js');

  return new BroccoliMergeTrees([app.toTree(), ...[jsonTree]]);
};
