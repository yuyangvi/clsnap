/**
 * Module dependencies.
 */
var iconv=require('iconv-lite');
var cheerio=require('cheerio');
var co = require('co');
var request = require('co-request');
var url = require('url');


/**
 * Fetch data from Single Page.
 *
 * @param {Object} [opts] site
 * @param {Object} [opts] rules
 * @param {Object} [opts] page
 * @return {Promise}
 * @api public
 */

var singleFetch = co.wrap(function* (site, rules, page) {
  var a = yield request({uri:site.url});
  var html = a.body;
  //return yield Promise.resolve(html.length);
  var $ = cheerio.load(html);
  var ls = $(site.list);
  var res = ls.map(function(i, n){
    var item = {};
      for (var p in rules){
      var mc = rules[p].match(/@\w+$/)
      if (mc){
        var el = rules[p].slice(0,0 - mc[0].length);
        var attr = mc[0].slice(1);
        var da = $(this).find(el);
        item[p] = $(this).find(el).attr(attr);
      } else {
        item[p] = $(this).find(rules[p]).text().trim();
      }
    }
    return item;
  });
  var r = Array.prototype.slice.call(res, 0);
  if (page){
    var relate = $(page.next).attr('href');
    var abs = url.resolve(site.url, relate);
  }
  return {data: r, next:abs};
});


/**
 * Fetch data from Multi Page.
 *
 * @param {Object} [opts] site
 * @param {Object} [opts] rules
 * @param {Object} [opts] page
 * @return {Array}
 * @api public
 */
var pageNavFetch = co.wrap(function* (siteCfg, rules, page) {
  var res = [];
  var i=page.maxPage;
  while(i>0){
    var d = yield singleFetch(siteCfg, rules, page);
    siteCfg.url=d.next;
    res = res.concat(d.data);
    i--;
  }
  return res;
});

exports = module.exports = pageNavFetch;