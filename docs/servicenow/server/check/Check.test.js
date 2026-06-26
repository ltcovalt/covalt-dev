// docs/servicenow/server/check/Check.test.js
(function () {
	var passCount = 0;
	var failCount = 0;

	function assert(name, condition) {
		if (condition) {
			passCount++;
			typeof gs !== 'undefined' ? gs.info('[PASS] ' + name) : console.log('✓ PASS: ' + name);
		} else {
			failCount++;
			typeof gs !== 'undefined' ? gs.error('[FAIL] ' + name) : console.error('✗ FAIL: ' + name);
		}
	}

	function runTests() {
		// --- BEGIN ASSERTIONS ---

		// 1. Core / Builder Factory
		assert('Check factory returns Checker instance', Check('test') instanceof Checker);
		assert('Check factory extracts name from single-prop object', Check({ myVal: 'test' }).name === 'myVal');

		// 2. Required & Optional
		assert('required() passes for non-nil', Check('test').required().ok());
		assert('required() fails for null', !Check(null).required().ok());
		assert('optional() passes for null and skips next checks', Check(null).optional().string().ok());
		assert('optional() evaluates next checks if not null', !Check(123).optional().string().ok());
		assert('opt() is alias for optional', Check(null).opt().string().ok());

		// 3. Basic Types
		assert('string() checks type string', Check('hello').is.string().ok());
		assert('number() checks type number', Check(123).is.number().ok());
		assert('bigint() checks type bigint', Check(10n).is.bigint().ok());
		assert('boolean() checks type boolean', Check(true).is.boolean().ok());
		assert(
			'function() checks type function',
			Check(function () {})
				.is.function()
				.ok(),
		);
		assert('object() checks type object', Check({}).is.object().ok());
		assert('null() checks detailed null', Check(null).is.null().ok());
		assert('undefined() checks type undefined', Check(undefined).is.undefined().ok());
		assert('nil() checks null/undefined', Check(null).is.nil().ok() && Check(undefined).is.nil().ok());
		assert('symbol() checks type symbol', Check(Symbol('s')).is.symbol().ok());
		assert('integer() checks detailed integer', Check(123).is.integer().ok() && !Check(1.2).is.integer().ok());
		assert('float() checks detailed float', Check(1.2).is.float().ok() && !Check(123).is.float().ok());
		assert('nan() checks detailed NaN', Check(NaN).is.nan().ok());
		assert('infinity() checks detailed Infinity', Check(Infinity).is.infinity().ok());

		// 4. Complex Objects & Instances
		assert('array() checks detailed Array', Check([]).is.array().ok());
		assert('regex() checks detailed RegExp', Check(/abc/).is.regex().ok());
		assert('date() checks detailed Date', Check(new Date()).is.date().ok());
		assert(
			'plainObject() checks vanilla JS objects',
			Check({}).is.plainObject().ok() && !Check(new Date()).is.plainObject().ok(),
		);
		assert('instanceOf() checks class constructor prototype', Check(new Date()).is.instanceOf(Date).ok());
		assert(
			'property() checks key presence',
			Check({ id: 1 }, 'obj').has.property('id').ok() && !Check({}, 'obj').has.property('id').ok(),
		);
		assert('hasProperty() is alias for property', Check({ id: 1 }, 'obj').hasProperty('id').ok());

		// 5. Emptiness & Presence
		assert(
			'empty() checks empty string/array/object',
			Check('').is.empty().ok() && Check([]).is.empty().ok() && Check({}).is.empty().ok(),
		);
		assert('empty() passes for nil values', Check(null).is.empty().ok());
		assert('blank() is alias for empty', Check('').is.blank().ok());

		// 6. Truthy / Falsy / Boolean
		assert('truthy() checks truthy values', Check('hello').is.truthy().ok() && !Check(0).is.truthy().ok());
		assert('falsy() checks falsy values', Check(0).is.falsy().ok() && !Check('hello').is.falsy().ok());
		assert('true() checks strict boolean true', Check(true).is.true().ok() && !Check('true').is.true().ok());
		assert('false() checks strict boolean false', Check(false).is.false().ok() && !Check(0).is.false().ok());

		// 7. String/Array content matchers
		assert('match() validates regex matching', Check('hello').is.match(/^h/).ok());
		assert('matches() is alias for match', Check('hello').matches(/^h/).ok());
		assert('includes() validates substrings in string', Check('hello').is.includes('ell').ok());
		assert('includes() validates elements in array', Check([1, 2, 3]).is.includes(2).ok());
		assert(
			'contains() is alias for includes',
			Check('hello').contains('ell').ok() && Check([1, 2, 3]).contains(2).ok(),
		);
		assert('startsWith() validates prefix', Check('hello').is.startsWith('he').ok());
		assert('endsWith() validates suffix', Check('hello').is.endsWith('lo').ok());

		// 8. Equality & Ranges
		assert('equal() compares strictly', Check(5).is.equal(5).ok() && !Check(5).is.equal('5').ok());
		assert('equals() is alias for equal', Check(5).equals(5).ok());
		assert('oneOf() checks element presence in array list', Check(2).is.oneOf([1, 2, 3]).ok());
		assert('noneOf() checks element absence in array list', Check(4).is.noneOf([1, 2, 3]).ok());
		assert('between() checks bounds', Check(5).is.between(1, 10).ok() && !Check(11).is.between(1, 10).ok());
		assert(
			'lessThan() / less() / lt() check lower bounds',
			Check(4).is.lessThan(5).ok() && Check(4).less(5).ok() && Check(4).lt(5).ok(),
		);
		assert(
			'lessThanOrEqual() / lessOrEqual() / lte() check lower bounds inclusive',
			Check(5).is.lessThanOrEqual(5).ok() && Check(5).lessOrEqual(5).ok() && Check(5).lte(5).ok(),
		);
		assert(
			'greaterThan() / greater() / gt() check upper bounds',
			Check(6).is.greaterThan(5).ok() && Check(6).greater(5).ok() && Check(6).gt(5).ok(),
		);
		assert(
			'greaterThanOrEqual() / greaterOrEqual() / gte() check upper bounds inclusive',
			Check(5).is.greaterThanOrEqual(5).ok() && Check(5).greaterOrEqual(5).ok() && Check(5).gte(5).ok(),
		);
		assert('multipleOf() checks multiples', Check(10).is.multipleOf(5).ok() && !Check(12).is.multipleOf(5).ok());

		// 9. ServiceNow Glide predicates
		assert(
			'validTable() checks GlideRecord table validity',
			Check('sys_user').is.validTable().ok() && !Check('invalid_table').is.validTable().ok(),
		);
		assert('validRecord() checks GlideRecord validity', Check(new GlideRecord('sys_user')).is.validRecord().ok());
		assert('glideDate() asserts GlideDate class', Check(new GlideDate()).is.glideDate().ok());
		assert('glideDateTime() asserts GlideDateTime class', Check(new GlideDateTime()).is.glideDateTime().ok());
		assert('glideDuration() asserts GlideDuration class', Check(new GlideDuration()).is.glideDuration().ok());
		assert('glideSchedule() asserts GlideSchedule class', Check(new GlideSchedule()).is.glideSchedule().ok());
		assert('glideSession() asserts GlideSession class', Check(new GlideSession()).is.glideSession().ok());
		assert('glideUser() asserts GlideUser class', Check(new GlideUser()).is.glideUser().ok());

		// 10. Chaining & Modifiers
		assert('not inverts assertions', Check(5).not.string().ok());
		assert('Multiple no-ops pass through correctly', Check('str').is.to.be.a.string().ok());

		// 11. Error message overrides
		var msgCheck = Check('hello', 'val').is.number().message('Custom static error message');
		assert('message() overrides error message string', msgCheck.errors[0] === 'val: Custom static error message');

		var msgFuncCheck = Check(10, 'val')
			.is.string()
			.msg((d) => 'Expected type ' + d.expected);
		assert(
			'msg() overrides error message using callback function',
			msgFuncCheck.errors[0] === 'val: Expected type string',
		);

		// 12. custom satisfies
		assert(
			'satisfies() evaluates callback inline',
			Check(6)
				.is.satisfies((v) => v % 2 === 0)
				.ok(),
		);

		// 13. Terminal operators
		var res = Check('hello', 'val').is.number().result();
		assert(
			'result() returns structured output',
			res.ok === false && res.errors.length === 1 && res.checks.length === 1,
		);

		try {
			Check('hello', 'val').is.number().guard();
			assert('guard() throws when validation fails', false);
		} catch (ex) {
			assert('guard() throws when validation fails', ex instanceof TypeError);
		}

		// --- SUMMARY ---
		var summary = 'Tests completed. Passed: ' + passCount + ', Failed: ' + failCount;
		typeof gs !== 'undefined' ? gs.info(summary) : console.log('\n' + summary);
	}

	// --- Node.js Offline Compatibility Setup ---
	if (typeof process !== 'undefined') {
		// Mock ServiceNow gs logging global
		global.gs = {
			info: function (msg) {
				console.log('INFO: ' + msg);
			},
			error: function (msg) {
				console.error('ERROR: ' + msg);
			},
		};

		// Mock Glide Classes for local execution
		global.GlideRecord = class {
			constructor(tableName) {
				this.tableName = tableName;
			}
			isValid() {
				return this.tableName === 'sys_user' || this.tableName === 'incident';
			}
			isValidRecord() {
				return true;
			}
			get [Symbol.toStringTag]() {
				return 'GlideRecord';
			}
		};

		global.GlideRecordSecure = class {
			constructor(tableName) {
				this.tableName = tableName;
			}
			isValid() {
				return true;
			}
			isValidRecord() {
				return true;
			}
			get [Symbol.toStringTag]() {
				return 'GlideRecordSecure';
			}
		};

		global.GlideDate = class {
			get [Symbol.toStringTag]() {
				return 'JavaObject';
			}
		};
		global.GlideDateTime = class {
			get [Symbol.toStringTag]() {
				return 'JavaObject';
			}
		};
		global.GlideDuration = class {
			get [Symbol.toStringTag]() {
				return 'JavaObject';
			}
		};
		global.GlideSchedule = class {
			get [Symbol.toStringTag]() {
				return 'JavaObject';
			}
		};
		global.GlideSession = class {
			get [Symbol.toStringTag]() {
				return 'JavaObject';
			}
		};
		global.GlideUser = class {
			get [Symbol.toStringTag]() {
				return 'JavaObject';
			}
		};

		if (typeof require !== 'undefined') {
			var fs = require('node:fs');
			var path = require('node:path');
			var vm = require('node:vm');

			var typeCode = fs.readFileSync(path.resolve(__dirname, '../type/Type.js'), 'utf8');
			var checkCode = fs.readFileSync(path.resolve(__dirname, './Check.js'), 'utf8');

			vm.runInThisContext(typeCode);
			vm.runInThisContext(checkCode);

			runTests();
		} else {
			// Node.js ES Module environment (wrapped in new Function to prevent static import syntax errors in ServiceNow Rhino)
			var loadESM;
			try {
				loadESM = new Function(
					"return Promise.all([import('node:fs'), import('node:path'), import('node:vm')])",
				);
			} catch (e) {
				console.error('Dynamic import not supported:', e);
				return;
			}

			loadESM()
				.then(function (modules) {
					var fs = modules[0];
					var path = modules[1];
					var vm = modules[2];

					// Resolve paths relative to process.cwd()
					var baseDir = path.resolve('docs/servicenow/server/check');
					var typeCode = fs.readFileSync(path.resolve(baseDir, '../type/Type.js'), 'utf8');
					var checkCode = fs.readFileSync(path.resolve(baseDir, './Check.js'), 'utf8');

					vm.runInThisContext(typeCode);
					vm.runInThisContext(checkCode);

					runTests();
				})
				.catch(function (err) {
					console.error('Failed to load Node.js ES Module dependencies:', err);
				});
		}
	} else {
		// ServiceNow Environment
		runTests();
	}
})();
