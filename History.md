0.2.0 / 2018-03-16
==================

  * Documentation!
  * New build process which supports custom builds
  * `sort` with a key now confirms both inputs are objects before comparing keys.
  * `isnt` and `isntLike` are now renamed to `isNot` and `isNotLike`
  * `is`, `isLike`, `isNot` and `isNotLike` now support multiple matching arguments.
  * `any`, `all`, `and, `or`, and `default` now evaluate keys with empty arrays as falsy.
  * `compare` now supports !typeof and !% operators.
  * `and` and `or` now return/scope with the final value that results from the comparison.
  * `first` now supports objects and strings
  * Removed `has`; use `inArray` or `contains` instead.
  * Fixed global state pollution on several handlers
  * Fixed bugs in `padLeft`, `padCenter` and `padRight` when using named arguments

0.1.3 / 2014-09-12
==================

  * Fixes for changes in Handlebars 2.0

0.1.2 / 2014-09-12
==================

  * humanSeconds: Round up or down the smallest unit for the remaining time
  * date and fromNow no longer trigger Moment.js deprecation notice

0.1.1 / 2014-03-18
==================

  * Added humanMilliseconds helper
  * Fixed a global state pollution on humanSeconds

0.1.0 / 2014-01-16
==================

Initial release