'use strict';

var Backbone = require('../shims/backbone');
var View = Backbone.View;
var templates = require('templates');

module.exports = View.extend({
  pageTitle: 'Learn Forward | About Us',
  template: templates.pages.demo,
  render: function () {
    this.$el.html(this.template());
    return this;
  }
});
