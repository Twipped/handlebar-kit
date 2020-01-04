
import tap from 'tap';
import Handlebars from 'handlebars';
import Kit from './index';

import { test as add }          from './kit/add';
import { test as after }        from './kit/after';
import { test as all }          from './kit/all';
import { test as any }          from './kit/any';
import { test as ceil }         from './kit/ceil';
import { test as compare }      from './kit/compare';
import { test as date }         from './kit/date';
import { test as div }          from './kit/div';
import { test as empty }        from './kit/empty';
import { test as endsWith }     from './kit/endsWith';
import { test as filter }       from './kit/filter';
import { test as first }        from './kit/first';
import { test as floor }        from './kit/floor';
import { test as fromNow }      from './kit/fromNow';
import { test as gt }           from './kit/gt';
import { test as gte }          from './kit/gte';
import { test as humanBytes }   from './kit/humanBytes';
import { test as humanNumber }  from './kit/humanNumber';
import { test as humanSeconds } from './kit/humanSeconds';
import { test as humanTime }    from './kit/humanTime';
import { test as includes }     from './kit/includes';
import { test as inject }       from './kit/inject';
import { test as is }           from './kit/is';
import { test as isLike }       from './kit/isLike';
import { test as isNot }        from './kit/isNot';
import { test as isNotLike }    from './kit/isNotLike';
import { test as join }         from './kit/join';
import { test as keys }         from './kit/keys';
import { test as last }         from './kit/last';
import { test as length }       from './kit/length';
import { test as lowercase }    from './kit/lowercase';
import { test as lt }           from './kit/lt';
import { test as lte }          from './kit/lte';
import { test as max }          from './kit/max';
import { test as mean }         from './kit/mean';
import { test as min }          from './kit/min';
import { test as mul }          from './kit/mul';
import { test as notEmpty }     from './kit/notEmpty';
import { test as numberFormat } from './kit/numberFormat';
import { test as ordinalize }   from './kit/ordinalize';
import { test as padEnd }       from './kit/padEnd';
import { test as padStart }     from './kit/padStart';
import { test as phone }        from './kit/phone';
import { test as pow }          from './kit/pow';
import { test as random }       from './kit/random';
import { test as replace }      from './kit/replace';
import { test as reverse }      from './kit/reverse';
import { test as round }        from './kit/round';
import { test as slice }        from './kit/slice';
import { test as slugify }      from './kit/slugify';
import { test as sort }         from './kit/sort';
import { test as split }        from './kit/split';
import { test as startsWith }   from './kit/startsWith';
import { test as stringify }    from './kit/stringify';
import { test as sub }          from './kit/sub';
import { test as ucfirst }      from './kit/ucfirst';
import { test as ucsentences }  from './kit/ucsentences';
import { test as ucwords }      from './kit/ucwords';
import { test as uppercase }    from './kit/uppercase';
import { test as urldecode }    from './kit/urldecode';
import { test as urlencode }    from './kit/urlencode';
import { test as values }       from './kit/values';

const tests = {
	add,
	after,
	all,
	any,
	ceil,
	compare,
	date,
	div,
	empty,
	endsWith,
	filter,
	first,
	floor,
	fromNow,
	gt,
	gte,
	humanBytes,
	humanNumber,
	humanSeconds,
	humanTime,
	includes,
	inject,
	is,
	isLike,
	isNot,
	isNotLike,
	join,
	keys,
	last,
	length,
	lowercase,
	lt,
	lte,
	max,
	mean,
	min,
	mul,
	notEmpty,
	numberFormat,
	ordinalize,
	padEnd,
	padStart,
	phone,
	pow,
	random,
	replace,
	reverse,
	round,
	slice,
	slugify,
	sort,
	split,
	startsWith,
	stringify,
	sub,
	ucfirst,
	ucsentences,
	ucwords,
	uppercase,
	urldecode,
	urlencode,
	values,
};

Kit.load(Handlebars);

for (const [ name, test ] of Object.entries(tests)) {
	tap.test(name, (ts) => {
		if (!test) {
			ts.skip(name);
			ts.end();
			return;
		}

		let i = 1;
		ts.simple = ({ template, input, output }) => {
			ts.test(`${name}#${i++}: ${template}`, (t) => {
				var actual = Handlebars.compile(template)(input);
				var expected = output;

				t.strictEqual(actual, expected);
				t.end();
			});
		};
		test(ts, name);
		ts.end();
	});
}