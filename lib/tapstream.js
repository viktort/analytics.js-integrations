
var callback = require('callback');
var integration = require('integration');
var load = require('load-script');
var slug = require('slug');
var push = require('global-queue')('_tsq');


/**
 * Expose plugin.
 */

module.exports = exports = function (analytics) {
  analytics.addIntegration(Tapstream);
};


/**
 * Expose `Tapstream` integration.
 */

var Tapstream = exports.Integration = integration('Tapstream')
  .assumesPageview()
  .readyOnInitialize()
  .global('_tsq')
  .option('accountName', '')
  .option('trackAllPages', true)
  .option('trackNamedPages', true)
  .option('trackCategorizedPages', true);


/**
 * Initialize.
 *
 * @param {Object} page
 */

Tapstream.prototype.initialize = function (page) {
  window._tsq = window._tsq || [];
  push('setAccountName', this.options.accountName);
  this.load();
};


/**
 * Loaded?
 *
 * @return {Boolean}
 */

Tapstream.prototype.loaded = function () {
  return !! (window._tsq && window._tsq.push !== Array.prototype.push);
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Tapstream.prototype.load = function (callback) {
  load('//cdn.tapstream.com/static/js/tapstream.js', callback);
};


/**
 * Page.
 *
 * @param {String} category (optional)
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Tapstream.prototype.page = function (category, name, properties, options) {
  var opts = this.options;

  // all pages
  if (opts.trackAllPages) {
    this.track('Loaded a Page', properties);
  }

  // named pages
  if (name && opts.trackNamedPages) {
    if (name && category) name = category + ' ' + name;
    this.track('Viewed ' + name + ' Page', properties);
  }

  // categorized pages
  if (category && opts.trackCategorizedPages) {
    this.track('Viewed ' + category + ' Page', properties);
  }
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Tapstream.prototype.track = function (event, properties, options) {
  properties = properties || {};
  push('fireHit', slug(event), [properties.url]); // needs events as slugs
};