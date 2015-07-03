# clsnap
  an addon base on co to snap list data from pages which is mainly used to fetch topics from forums.

## Platform Compatibility
  `clsnap` requires `co@4+`, `cheerio`
  For versions of node `< 0.11` and for many older browsers,
  you should/must include your own `Promise` polyfill.

  When using node 0.11.x or greater, you must use the `--harmony-generators`
  flag or just `--harmony` to get access to generators.

  When using node 0.10.x and lower or browsers without generator support,
  you must use [gnode](https://github.com/TooTallNate/gnode) and/or [regenerator](http://facebook.github.io/regenerator/).

  io.js is also supported

## Installation
```
$ npm install co
```

## Examples
```
var clsnap = require('clsnap');
var siteCfg = {
	"url": "http://example.com/forum.php?&orderby=dateline",
	"list": "#forum table tbody:nth-last-child(-n+50)"
};

var rules= {
	"title": ".title",
	"author": ".by .author",
	"createTime": ".by time",
	"link": ".title@href"
};

var pageInfo: {
	"next":".nxt",
	"maxPage": 5
}


clsnap(siteCfg, rules, pageInfo).then(function(res){
	console.log(res);
}).catch(function(e){
	console.log(e);
});

```