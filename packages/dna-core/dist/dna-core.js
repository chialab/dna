(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.DNA = global.DNA || {})));
}(this, (function (exports) { 'use strict';

var __cov_Po_oW128pyfg0mFxvPckog = Function('return this')();
if (!__cov_Po_oW128pyfg0mFxvPckog.__coverage__) {
   __cov_Po_oW128pyfg0mFxvPckog.__coverage__ = {};
}
__cov_Po_oW128pyfg0mFxvPckog = __cov_Po_oW128pyfg0mFxvPckog.__coverage__;
if (!__cov_Po_oW128pyfg0mFxvPckog['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/typeof.js']) {
   __cov_Po_oW128pyfg0mFxvPckog['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/typeof.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/typeof.js", "s": { "1": 1, "2": 0, "3": 1, "4": 0, "5": 1, "6": 0, "7": 1, "8": 0, "9": 1, "10": 0 }, "b": {}, "f": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }, "fnMap": { "1": { "name": "isFunction", "line": 10, "loc": { "start": { "line": 10, "column": 7 }, "end": { "line": 10, "column": 32 } } }, "2": { "name": "isString", "line": 22, "loc": { "start": { "line": 22, "column": 7 }, "end": { "line": 22, "column": 30 } } }, "3": { "name": "isObject", "line": 34, "loc": { "start": { "line": 34, "column": 7 }, "end": { "line": 34, "column": 30 } } }, "4": { "name": "isUndefined", "line": 46, "loc": { "start": { "line": 46, "column": 7 }, "end": { "line": 46, "column": 33 } } }, "5": { "name": "isArray", "line": 58, "loc": { "start": { "line": 58, "column": 7 }, "end": { "line": 58, "column": 29 } } } }, "statementMap": { "1": { "start": { "line": 10, "column": 7 }, "end": { "line": 12, "column": 1 } }, "2": { "start": { "line": 11, "column": 4 }, "end": { "line": 11, "column": 37 } }, "3": { "start": { "line": 22, "column": 7 }, "end": { "line": 24, "column": 1 } }, "4": { "start": { "line": 23, "column": 4 }, "end": { "line": 23, "column": 35 } }, "5": { "start": { "line": 34, "column": 7 }, "end": { "line": 36, "column": 1 } }, "6": { "start": { "line": 35, "column": 4 }, "end": { "line": 35, "column": 69 } }, "7": { "start": { "line": 46, "column": 7 }, "end": { "line": 48, "column": 1 } }, "8": { "start": { "line": 47, "column": 4 }, "end": { "line": 47, "column": 38 } }, "9": { "start": { "line": 58, "column": 7 }, "end": { "line": 60, "column": 1 } }, "10": { "start": { "line": 59, "column": 4 }, "end": { "line": 59, "column": 30 } } }, "branchMap": {} };
}
__cov_Po_oW128pyfg0mFxvPckog = __cov_Po_oW128pyfg0mFxvPckog['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/typeof.js'];
function isFunction(obj) {
   __cov_Po_oW128pyfg0mFxvPckog.f['1']++;__cov_Po_oW128pyfg0mFxvPckog.s['2']++;return typeof obj === 'function';
}function isString(obj) {
   __cov_Po_oW128pyfg0mFxvPckog.f['2']++;__cov_Po_oW128pyfg0mFxvPckog.s['4']++;return typeof obj === 'string';
}function isObject(obj) {
   __cov_Po_oW128pyfg0mFxvPckog.f['3']++;__cov_Po_oW128pyfg0mFxvPckog.s['6']++;return Object.prototype.toString.call(obj) === '[object Object]';
}function isUndefined(obj) {
   __cov_Po_oW128pyfg0mFxvPckog.f['4']++;__cov_Po_oW128pyfg0mFxvPckog.s['8']++;return typeof obj === 'undefined';
}function isArray(obj) {
   __cov_Po_oW128pyfg0mFxvPckog.f['5']++;__cov_Po_oW128pyfg0mFxvPckog.s['10']++;return Array.isArray(obj);
}

var __cov_wMe_NElW86S5XGkOqbUzDw = Function('return this')();
if (!__cov_wMe_NElW86S5XGkOqbUzDw.__coverage__) {
   __cov_wMe_NElW86S5XGkOqbUzDw.__coverage__ = {};
}
__cov_wMe_NElW86S5XGkOqbUzDw = __cov_wMe_NElW86S5XGkOqbUzDw.__coverage__;
if (!__cov_wMe_NElW86S5XGkOqbUzDw['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/registry.js']) {
   __cov_wMe_NElW86S5XGkOqbUzDw['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/registry.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/registry.js", "s": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0 }, "b": { "1": [0, 0], "2": [0, 0], "3": [0, 0], "4": [0, 0] }, "f": { "1": 0, "2": 0, "3": 0 }, "fnMap": { "1": { "name": "(anonymous_1)", "line": 23, "loc": { "start": { "line": 23, "column": 10 }, "end": { "line": 23, "column": 35 } } }, "2": { "name": "(anonymous_2)", "line": 36, "loc": { "start": { "line": 36, "column": 17 }, "end": { "line": 36, "column": 24 } } }, "3": { "name": "(anonymous_3)", "line": 53, "loc": { "start": { "line": 53, "column": 7 }, "end": { "line": 53, "column": 14 } } } }, "statementMap": { "1": { "start": { "line": 11, "column": 7 }, "end": { "line": 59, "column": 2 } }, "2": { "start": { "line": 24, "column": 8 }, "end": { "line": 28, "column": 10 } }, "3": { "start": { "line": 37, "column": 8 }, "end": { "line": 46, "column": 9 } }, "4": { "start": { "line": 38, "column": 12 }, "end": { "line": 38, "column": 55 } }, "5": { "start": { "line": 39, "column": 15 }, "end": { "line": 46, "column": 9 } }, "6": { "start": { "line": 40, "column": 12 }, "end": { "line": 45, "column": 13 } }, "7": { "start": { "line": 41, "column": 16 }, "end": { "line": 41, "column": 46 } }, "8": { "start": { "line": 42, "column": 16 }, "end": { "line": 44, "column": 17 } }, "9": { "start": { "line": 43, "column": 20 }, "end": { "line": 43, "column": 32 } }, "10": { "start": { "line": 54, "column": 8 }, "end": { "line": 54, "column": 44 } }, "11": { "start": { "line": 55, "column": 8 }, "end": { "line": 57, "column": 9 } }, "12": { "start": { "line": 56, "column": 12 }, "end": { "line": 56, "column": 28 } } }, "branchMap": { "1": { "line": 37, "type": "if", "locations": [{ "start": { "line": 37, "column": 8 }, "end": { "line": 37, "column": 8 } }, { "start": { "line": 37, "column": 8 }, "end": { "line": 37, "column": 8 } }] }, "2": { "line": 39, "type": "if", "locations": [{ "start": { "line": 39, "column": 15 }, "end": { "line": 39, "column": 15 } }, { "start": { "line": 39, "column": 15 }, "end": { "line": 39, "column": 15 } }] }, "3": { "line": 42, "type": "if", "locations": [{ "start": { "line": 42, "column": 16 }, "end": { "line": 42, "column": 16 } }, { "start": { "line": 42, "column": 16 }, "end": { "line": 42, "column": 16 } }] }, "4": { "line": 55, "type": "if", "locations": [{ "start": { "line": 55, "column": 8 }, "end": { "line": 55, "column": 8 } }, { "start": { "line": 55, "column": 8 }, "end": { "line": 55, "column": 8 } }] } } };
}
__cov_wMe_NElW86S5XGkOqbUzDw = __cov_wMe_NElW86S5XGkOqbUzDw['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/registry.js'];
__cov_wMe_NElW86S5XGkOqbUzDw.s['1']++;var registry = { components: {}, define: function define(name, Ctr) {
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      __cov_wMe_NElW86S5XGkOqbUzDw.f['1']++;__cov_wMe_NElW86S5XGkOqbUzDw.s['2']++;this.components[name.toLowerCase()] = { is: name, Ctr: Ctr, config: config };
   },
   getDescriptor: function getDescriptor(name) {
      __cov_wMe_NElW86S5XGkOqbUzDw.f['2']++;__cov_wMe_NElW86S5XGkOqbUzDw.s['3']++;if (isString(name)) {
         __cov_wMe_NElW86S5XGkOqbUzDw.b['1'][0]++;__cov_wMe_NElW86S5XGkOqbUzDw.s['4']++;return this.components[name.toLowerCase()];
      } else {
         __cov_wMe_NElW86S5XGkOqbUzDw.b['1'][1]++;__cov_wMe_NElW86S5XGkOqbUzDw.s['5']++;if (isFunction(name)) {
            __cov_wMe_NElW86S5XGkOqbUzDw.b['2'][0]++;__cov_wMe_NElW86S5XGkOqbUzDw.s['6']++;for (var k in this.components) {
               __cov_wMe_NElW86S5XGkOqbUzDw.s['7']++;var desc = this.components[k];__cov_wMe_NElW86S5XGkOqbUzDw.s['8']++;if (desc.Ctr === name) {
                  __cov_wMe_NElW86S5XGkOqbUzDw.b['3'][0]++;__cov_wMe_NElW86S5XGkOqbUzDw.s['9']++;return desc;
               } else {
                  __cov_wMe_NElW86S5XGkOqbUzDw.b['3'][1]++;
               }
            }
         } else {
            __cov_wMe_NElW86S5XGkOqbUzDw.b['2'][1]++;
         }
      }
   },
   get: function get(name) {
      __cov_wMe_NElW86S5XGkOqbUzDw.f['3']++;__cov_wMe_NElW86S5XGkOqbUzDw.s['10']++;var desc = this.getDescriptor(name);__cov_wMe_NElW86S5XGkOqbUzDw.s['11']++;if (desc) {
         __cov_wMe_NElW86S5XGkOqbUzDw.b['4'][0]++;__cov_wMe_NElW86S5XGkOqbUzDw.s['12']++;return desc.Ctr;
      } else {
         __cov_wMe_NElW86S5XGkOqbUzDw.b['4'][1]++;
      }
   }
};

var __cov_LWePYleqpogTdDFb$8MkcQ = Function('return this')();
if (!__cov_LWePYleqpogTdDFb$8MkcQ.__coverage__) {
   __cov_LWePYleqpogTdDFb$8MkcQ.__coverage__ = {};
}
__cov_LWePYleqpogTdDFb$8MkcQ = __cov_LWePYleqpogTdDFb$8MkcQ.__coverage__;
if (!__cov_LWePYleqpogTdDFb$8MkcQ['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/symbols.js']) {
   __cov_LWePYleqpogTdDFb$8MkcQ['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/symbols.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/symbols.js", "s": { "1": 0 }, "b": {}, "f": {}, "fnMap": {}, "statementMap": { "1": { "start": { "line": 1, "column": 7 }, "end": { "line": 1, "column": 46 } } }, "branchMap": {} };
}
__cov_LWePYleqpogTdDFb$8MkcQ = __cov_LWePYleqpogTdDFb$8MkcQ['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/symbols.js'];
__cov_LWePYleqpogTdDFb$8MkcQ.s['1']++;var COMPONENT_SYMBOL = '__component';

var __cov_hUaPMNyeK5AqLa9EK5WEAQ = Function('return this')();
if (!__cov_hUaPMNyeK5AqLa9EK5WEAQ.__coverage__) {
   __cov_hUaPMNyeK5AqLa9EK5WEAQ.__coverage__ = {};
}
__cov_hUaPMNyeK5AqLa9EK5WEAQ = __cov_hUaPMNyeK5AqLa9EK5WEAQ.__coverage__;
if (!__cov_hUaPMNyeK5AqLa9EK5WEAQ['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/dom.js']) {
   __cov_hUaPMNyeK5AqLa9EK5WEAQ['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/dom.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/dom.js", "s": { "1": 0, "2": 0, "3": 0, "4": 1, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 1, "11": 0, "12": 0, "13": 1, "14": 0, "15": 0, "16": 0, "17": 1, "18": 0, "19": 0, "20": 0, "21": 1, "22": 0, "23": 0, "24": 0, "25": 1, "26": 0, "27": 0, "28": 0, "29": 0, "30": 0, "31": 0, "32": 0, "33": 0, "34": 1, "35": 0, "36": 0, "37": 0, "38": 1, "39": 0, "40": 0, "41": 0, "42": 0, "43": 0, "44": 0, "45": 0, "46": 0, "47": 1, "48": 0, "49": 0, "50": 0, "51": 1, "52": 0, "53": 0, "54": 0, "55": 0, "56": 0, "57": 0, "58": 0, "59": 1, "60": 0, "61": 0, "62": 0, "63": 0, "64": 0, "65": 0, "66": 0, "67": 0, "68": 1, "69": 0, "70": 0, "71": 0, "72": 0, "73": 0, "74": 0, "75": 0, "76": 1, "77": 0, "78": 0, "79": 0, "80": 0, "81": 0, "82": 0, "83": 0 }, "b": { "1": [0, 0], "2": [0, 0], "3": [0, 0], "4": [0, 0], "5": [0, 0], "6": [0, 0], "7": [0, 0], "8": [0, 0], "9": [0, 0], "10": [0, 0], "11": [0, 0], "12": [0, 0], "13": [0, 0], "14": [0, 0], "15": [0, 0], "16": [0, 0], "17": [0, 0], "18": [0, 0], "19": [0, 0], "20": [0, 0], "21": [0, 0], "22": [0, 0], "23": [0, 0], "24": [0, 0], "25": [0, 0], "26": [0, 0], "27": [0, 0], "28": [0, 0] }, "f": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0 }, "fnMap": { "1": { "name": "getComponent", "line": 39, "loc": { "start": { "line": 39, "column": 7 }, "end": { "line": 39, "column": 52 } } }, "2": { "name": "isComponent", "line": 57, "loc": { "start": { "line": 57, "column": 7 }, "end": { "line": 57, "column": 37 } } }, "3": { "name": "connect", "line": 70, "loc": { "start": { "line": 70, "column": 7 }, "end": { "line": 70, "column": 33 } } }, "4": { "name": "disconnect", "line": 85, "loc": { "start": { "line": 85, "column": 7 }, "end": { "line": 85, "column": 36 } } }, "5": { "name": "update", "line": 100, "loc": { "start": { "line": 100, "column": 7 }, "end": { "line": 100, "column": 58 } } }, "6": { "name": "bind", "line": 116, "loc": { "start": { "line": 116, "column": 7 }, "end": { "line": 116, "column": 32 } } }, "7": { "name": "createElement", "line": 141, "loc": { "start": { "line": 141, "column": 7 }, "end": { "line": 141, "column": 34 } } }, "8": { "name": "appendChild", "line": 159, "loc": { "start": { "line": 159, "column": 7 }, "end": { "line": 159, "column": 45 } } }, "9": { "name": "removeChild", "line": 182, "loc": { "start": { "line": 182, "column": 7 }, "end": { "line": 182, "column": 45 } } }, "10": { "name": "insertBefore", "line": 201, "loc": { "start": { "line": 201, "column": 7 }, "end": { "line": 201, "column": 55 } } }, "11": { "name": "replaceChild", "line": 227, "loc": { "start": { "line": 227, "column": 7 }, "end": { "line": 227, "column": 55 } } }, "12": { "name": "setAttribute", "line": 251, "loc": { "start": { "line": 251, "column": 7 }, "end": { "line": 251, "column": 51 } } }, "13": { "name": "removeAttribute", "line": 272, "loc": { "start": { "line": 272, "column": 7 }, "end": { "line": 272, "column": 47 } } } }, "statementMap": { "1": { "start": { "line": 12, "column": 0 }, "end": { "line": 12, "column": 38 } }, "2": { "start": { "line": 20, "column": 0 }, "end": { "line": 20, "column": 44 } }, "3": { "start": { "line": 28, "column": 0 }, "end": { "line": 28, "column": 43 } }, "4": { "start": { "line": 39, "column": 7 }, "end": { "line": 47, "column": 1 } }, "5": { "start": { "line": 40, "column": 4 }, "end": { "line": 42, "column": 5 } }, "6": { "start": { "line": 41, "column": 8 }, "end": { "line": 41, "column": 31 } }, "7": { "start": { "line": 43, "column": 4 }, "end": { "line": 45, "column": 5 } }, "8": { "start": { "line": 44, "column": 8 }, "end": { "line": 44, "column": 64 } }, "9": { "start": { "line": 46, "column": 4 }, "end": { "line": 46, "column": 74 } }, "10": { "start": { "line": 57, "column": 7 }, "end": { "line": 60, "column": 1 } }, "11": { "start": { "line": 58, "column": 4 }, "end": { "line": 58, "column": 36 } }, "12": { "start": { "line": 59, "column": 4 }, "end": { "line": 59, "column": 43 } }, "13": { "start": { "line": 70, "column": 7 }, "end": { "line": 75, "column": 1 } }, "14": { "start": { "line": 71, "column": 4 }, "end": { "line": 74, "column": 5 } }, "15": { "start": { "line": 72, "column": 8 }, "end": { "line": 72, "column": 41 } }, "16": { "start": { "line": 73, "column": 8 }, "end": { "line": 73, "column": 20 } }, "17": { "start": { "line": 85, "column": 7 }, "end": { "line": 90, "column": 1 } }, "18": { "start": { "line": 86, "column": 4 }, "end": { "line": 89, "column": 5 } }, "19": { "start": { "line": 87, "column": 8 }, "end": { "line": 87, "column": 44 } }, "20": { "start": { "line": 88, "column": 8 }, "end": { "line": 88, "column": 20 } }, "21": { "start": { "line": 100, "column": 7 }, "end": { "line": 105, "column": 1 } }, "22": { "start": { "line": 101, "column": 4 }, "end": { "line": 104, "column": 5 } }, "23": { "start": { "line": 102, "column": 8 }, "end": { "line": 102, "column": 65 } }, "24": { "start": { "line": 103, "column": 8 }, "end": { "line": 103, "column": 20 } }, "25": { "start": { "line": 116, "column": 7 }, "end": { "line": 131, "column": 1 } }, "26": { "start": { "line": 117, "column": 4 }, "end": { "line": 119, "column": 5 } }, "27": { "start": { "line": 118, "column": 8 }, "end": { "line": 118, "column": 33 } }, "28": { "start": { "line": 120, "column": 4 }, "end": { "line": 129, "column": 5 } }, "29": { "start": { "line": 121, "column": 8 }, "end": { "line": 121, "column": 39 } }, "30": { "start": { "line": 122, "column": 8 }, "end": { "line": 126, "column": 11 } }, "31": { "start": { "line": 127, "column": 8 }, "end": { "line": 127, "column": 23 } }, "32": { "start": { "line": 128, "column": 8 }, "end": { "line": 128, "column": 20 } }, "33": { "start": { "line": 130, "column": 4 }, "end": { "line": 130, "column": 17 } }, "34": { "start": { "line": 141, "column": 7 }, "end": { "line": 146, "column": 1 } }, "35": { "start": { "line": 142, "column": 4 }, "end": { "line": 142, "column": 31 } }, "36": { "start": { "line": 143, "column": 4 }, "end": { "line": 145, "column": 5 } }, "37": { "start": { "line": 144, "column": 8 }, "end": { "line": 144, "column": 25 } }, "38": { "start": { "line": 159, "column": 7 }, "end": { "line": 171, "column": 1 } }, "39": { "start": { "line": 160, "column": 4 }, "end": { "line": 169, "column": 5 } }, "40": { "start": { "line": 161, "column": 8 }, "end": { "line": 161, "column": 32 } }, "41": { "start": { "line": 162, "column": 8 }, "end": { "line": 168, "column": 9 } }, "42": { "start": { "line": 163, "column": 12 }, "end": { "line": 165, "column": 13 } }, "43": { "start": { "line": 164, "column": 16 }, "end": { "line": 164, "column": 54 } }, "44": { "start": { "line": 166, "column": 12 }, "end": { "line": 166, "column": 37 } }, "45": { "start": { "line": 167, "column": 12 }, "end": { "line": 167, "column": 36 } }, "46": { "start": { "line": 170, "column": 4 }, "end": { "line": 170, "column": 17 } }, "47": { "start": { "line": 182, "column": 7 }, "end": { "line": 187, "column": 1 } }, "48": { "start": { "line": 183, "column": 4 }, "end": { "line": 186, "column": 5 } }, "49": { "start": { "line": 184, "column": 8 }, "end": { "line": 184, "column": 41 } }, "50": { "start": { "line": 185, "column": 8 }, "end": { "line": 185, "column": 35 } }, "51": { "start": { "line": 201, "column": 7 }, "end": { "line": 212, "column": 1 } }, "52": { "start": { "line": 202, "column": 4 }, "end": { "line": 211, "column": 5 } }, "53": { "start": { "line": 203, "column": 8 }, "end": { "line": 203, "column": 32 } }, "54": { "start": { "line": 204, "column": 8 }, "end": { "line": 210, "column": 9 } }, "55": { "start": { "line": 205, "column": 12 }, "end": { "line": 207, "column": 13 } }, "56": { "start": { "line": 206, "column": 16 }, "end": { "line": 206, "column": 36 } }, "57": { "start": { "line": 208, "column": 12 }, "end": { "line": 208, "column": 47 } }, "58": { "start": { "line": 209, "column": 12 }, "end": { "line": 209, "column": 36 } }, "59": { "start": { "line": 227, "column": 7 }, "end": { "line": 239, "column": 1 } }, "60": { "start": { "line": 228, "column": 4 }, "end": { "line": 238, "column": 5 } }, "61": { "start": { "line": 229, "column": 8 }, "end": { "line": 229, "column": 32 } }, "62": { "start": { "line": 230, "column": 8 }, "end": { "line": 232, "column": 9 } }, "63": { "start": { "line": 231, "column": 12 }, "end": { "line": 231, "column": 32 } }, "64": { "start": { "line": 233, "column": 8 }, "end": { "line": 233, "column": 43 } }, "65": { "start": { "line": 234, "column": 8 }, "end": { "line": 236, "column": 9 } }, "66": { "start": { "line": 235, "column": 12 }, "end": { "line": 235, "column": 50 } }, "67": { "start": { "line": 237, "column": 8 }, "end": { "line": 237, "column": 29 } }, "68": { "start": { "line": 251, "column": 7 }, "end": { "line": 261, "column": 1 } }, "69": { "start": { "line": 252, "column": 4 }, "end": { "line": 260, "column": 5 } }, "70": { "start": { "line": 253, "column": 8 }, "end": { "line": 253, "column": 32 } }, "71": { "start": { "line": 254, "column": 8 }, "end": { "line": 254, "column": 47 } }, "72": { "start": { "line": 255, "column": 8 }, "end": { "line": 255, "column": 39 } }, "73": { "start": { "line": 256, "column": 8 }, "end": { "line": 256, "column": 65 } }, "74": { "start": { "line": 257, "column": 8 }, "end": { "line": 259, "column": 9 } }, "75": { "start": { "line": 258, "column": 12 }, "end": { "line": 258, "column": 58 } }, "76": { "start": { "line": 272, "column": 7 }, "end": { "line": 282, "column": 1 } }, "77": { "start": { "line": 273, "column": 4 }, "end": { "line": 281, "column": 5 } }, "78": { "start": { "line": 274, "column": 8 }, "end": { "line": 274, "column": 32 } }, "79": { "start": { "line": 275, "column": 8 }, "end": { "line": 275, "column": 47 } }, "80": { "start": { "line": 276, "column": 8 }, "end": { "line": 276, "column": 35 } }, "81": { "start": { "line": 277, "column": 8 }, "end": { "line": 277, "column": 65 } }, "82": { "start": { "line": 278, "column": 8 }, "end": { "line": 280, "column": 9 } }, "83": { "start": { "line": 279, "column": 12 }, "end": { "line": 279, "column": 57 } } }, "branchMap": { "1": { "line": 40, "type": "if", "locations": [{ "start": { "line": 40, "column": 4 }, "end": { "line": 40, "column": 4 } }, { "start": { "line": 40, "column": 4 }, "end": { "line": 40, "column": 4 } }] }, "2": { "line": 43, "type": "if", "locations": [{ "start": { "line": 43, "column": 4 }, "end": { "line": 43, "column": 4 } }, { "start": { "line": 43, "column": 4 }, "end": { "line": 43, "column": 4 } }] }, "3": { "line": 44, "type": "binary-expr", "locations": [{ "start": { "line": 44, "column": 18 }, "end": { "line": 44, "column": 44 } }, { "start": { "line": 44, "column": 48 }, "end": { "line": 44, "column": 63 } }] }, "4": { "line": 46, "type": "cond-expr", "locations": [{ "start": { "line": 46, "column": 18 }, "end": { "line": 46, "column": 49 } }, { "start": { "line": 46, "column": 52 }, "end": { "line": 46, "column": 73 } }] }, "5": { "line": 59, "type": "binary-expr", "locations": [{ "start": { "line": 59, "column": 11 }, "end": { "line": 59, "column": 14 } }, { "start": { "line": 59, "column": 19 }, "end": { "line": 59, "column": 41 } }] }, "6": { "line": 71, "type": "if", "locations": [{ "start": { "line": 71, "column": 4 }, "end": { "line": 71, "column": 4 } }, { "start": { "line": 71, "column": 4 }, "end": { "line": 71, "column": 4 } }] }, "7": { "line": 86, "type": "if", "locations": [{ "start": { "line": 86, "column": 4 }, "end": { "line": 86, "column": 4 } }, { "start": { "line": 86, "column": 4 }, "end": { "line": 86, "column": 4 } }] }, "8": { "line": 101, "type": "if", "locations": [{ "start": { "line": 101, "column": 4 }, "end": { "line": 101, "column": 4 } }, { "start": { "line": 101, "column": 4 }, "end": { "line": 101, "column": 4 } }] }, "9": { "line": 117, "type": "if", "locations": [{ "start": { "line": 117, "column": 4 }, "end": { "line": 117, "column": 4 } }, { "start": { "line": 117, "column": 4 }, "end": { "line": 117, "column": 4 } }] }, "10": { "line": 120, "type": "if", "locations": [{ "start": { "line": 120, "column": 4 }, "end": { "line": 120, "column": 4 } }, { "start": { "line": 120, "column": 4 }, "end": { "line": 120, "column": 4 } }] }, "11": { "line": 143, "type": "if", "locations": [{ "start": { "line": 143, "column": 4 }, "end": { "line": 143, "column": 4 } }, { "start": { "line": 143, "column": 4 }, "end": { "line": 143, "column": 4 } }] }, "12": { "line": 160, "type": "if", "locations": [{ "start": { "line": 160, "column": 4 }, "end": { "line": 160, "column": 4 } }, { "start": { "line": 160, "column": 4 }, "end": { "line": 160, "column": 4 } }] }, "13": { "line": 162, "type": "if", "locations": [{ "start": { "line": 162, "column": 8 }, "end": { "line": 162, "column": 8 } }, { "start": { "line": 162, "column": 8 }, "end": { "line": 162, "column": 8 } }] }, "14": { "line": 162, "type": "binary-expr", "locations": [{ "start": { "line": 162, "column": 12 }, "end": { "line": 162, "column": 38 } }, { "start": { "line": 162, "column": 42 }, "end": { "line": 162, "column": 74 } }] }, "15": { "line": 163, "type": "if", "locations": [{ "start": { "line": 163, "column": 12 }, "end": { "line": 163, "column": 12 } }, { "start": { "line": 163, "column": 12 }, "end": { "line": 163, "column": 12 } }] }, "16": { "line": 183, "type": "if", "locations": [{ "start": { "line": 183, "column": 4 }, "end": { "line": 183, "column": 4 } }, { "start": { "line": 183, "column": 4 }, "end": { "line": 183, "column": 4 } }] }, "17": { "line": 202, "type": "if", "locations": [{ "start": { "line": 202, "column": 4 }, "end": { "line": 202, "column": 4 } }, { "start": { "line": 202, "column": 4 }, "end": { "line": 202, "column": 4 } }] }, "18": { "line": 204, "type": "if", "locations": [{ "start": { "line": 204, "column": 8 }, "end": { "line": 204, "column": 8 } }, { "start": { "line": 204, "column": 8 }, "end": { "line": 204, "column": 8 } }] }, "19": { "line": 205, "type": "if", "locations": [{ "start": { "line": 205, "column": 12 }, "end": { "line": 205, "column": 12 } }, { "start": { "line": 205, "column": 12 }, "end": { "line": 205, "column": 12 } }] }, "20": { "line": 228, "type": "if", "locations": [{ "start": { "line": 228, "column": 4 }, "end": { "line": 228, "column": 4 } }, { "start": { "line": 228, "column": 4 }, "end": { "line": 228, "column": 4 } }] }, "21": { "line": 230, "type": "if", "locations": [{ "start": { "line": 230, "column": 8 }, "end": { "line": 230, "column": 8 } }, { "start": { "line": 230, "column": 8 }, "end": { "line": 230, "column": 8 } }] }, "22": { "line": 234, "type": "if", "locations": [{ "start": { "line": 234, "column": 8 }, "end": { "line": 234, "column": 8 } }, { "start": { "line": 234, "column": 8 }, "end": { "line": 234, "column": 8 } }] }, "23": { "line": 252, "type": "if", "locations": [{ "start": { "line": 252, "column": 4 }, "end": { "line": 252, "column": 4 } }, { "start": { "line": 252, "column": 4 }, "end": { "line": 252, "column": 4 } }] }, "24": { "line": 256, "type": "binary-expr", "locations": [{ "start": { "line": 256, "column": 20 }, "end": { "line": 256, "column": 58 } }, { "start": { "line": 256, "column": 62 }, "end": { "line": 256, "column": 64 } }] }, "25": { "line": 257, "type": "if", "locations": [{ "start": { "line": 257, "column": 8 }, "end": { "line": 257, "column": 8 } }, { "start": { "line": 257, "column": 8 }, "end": { "line": 257, "column": 8 } }] }, "26": { "line": 273, "type": "if", "locations": [{ "start": { "line": 273, "column": 4 }, "end": { "line": 273, "column": 4 } }, { "start": { "line": 273, "column": 4 }, "end": { "line": 273, "column": 4 } }] }, "27": { "line": 277, "type": "binary-expr", "locations": [{ "start": { "line": 277, "column": 20 }, "end": { "line": 277, "column": 58 } }, { "start": { "line": 277, "column": 62 }, "end": { "line": 277, "column": 64 } }] }, "28": { "line": 278, "type": "if", "locations": [{ "start": { "line": 278, "column": 8 }, "end": { "line": 278, "column": 8 } }, { "start": { "line": 278, "column": 8 }, "end": { "line": 278, "column": 8 } }] } } };
}
__cov_hUaPMNyeK5AqLa9EK5WEAQ = __cov_hUaPMNyeK5AqLa9EK5WEAQ['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/dom.js'];
__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['1']++;var CONNECTED = 'connectedCallback';__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['2']++;var DISCONNECTED = 'disconnectedCallback';__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['3']++;var UPDATED = 'attributeChangedCallback';function getComponent(element) {
   var full = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
   __cov_hUaPMNyeK5AqLa9EK5WEAQ.f['1']++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['5']++;if (element.node) {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['1'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['6']++;element = element.node;
   } else {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['1'][1]++;
   }__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['7']++;if (element.nodeType === Node.ELEMENT_NODE) {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['2'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['8']++;element = (__cov_hUaPMNyeK5AqLa9EK5WEAQ.b['3'][0]++, element.getAttribute('is')) || (__cov_hUaPMNyeK5AqLa9EK5WEAQ.b['3'][1]++, element.tagName);
   } else {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['2'][1]++;
   }__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['9']++;return full ? (__cov_hUaPMNyeK5AqLa9EK5WEAQ.b['4'][0]++, registry.getDescriptor(element)) : (__cov_hUaPMNyeK5AqLa9EK5WEAQ.b['4'][1]++, registry.get(element));
}function isComponent(element) {
   __cov_hUaPMNyeK5AqLa9EK5WEAQ.f['2']++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['11']++;var Ctr = getComponent(element);__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['12']++;return (__cov_hUaPMNyeK5AqLa9EK5WEAQ.b['5'][0]++, Ctr) && (__cov_hUaPMNyeK5AqLa9EK5WEAQ.b['5'][1]++, element instanceof Ctr);
}function connect(element) {
   __cov_hUaPMNyeK5AqLa9EK5WEAQ.f['3']++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['14']++;if (isComponent(element)) {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['6'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['15']++;element[CONNECTED].call(element);__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['16']++;return true;
   } else {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['6'][1]++;
   }
}function disconnect(element) {
   __cov_hUaPMNyeK5AqLa9EK5WEAQ.f['4']++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['18']++;if (isComponent(element)) {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['7'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['19']++;element[DISCONNECTED].call(element);__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['20']++;return true;
   } else {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['7'][1]++;
   }
}function update(element, name, oldValue, newValue) {
   __cov_hUaPMNyeK5AqLa9EK5WEAQ.f['5']++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['22']++;if (isComponent(element)) {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['8'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['23']++;element[UPDATED].call(element, name, oldValue, newValue);__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['24']++;return true;
   } else {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['8'][1]++;
   }
}function bind(node, Ctr) {
   __cov_hUaPMNyeK5AqLa9EK5WEAQ.f['6']++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['26']++;if (!isFunction(Ctr)) {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['9'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['27']++;Ctr = getComponent(node);
   } else {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['9'][1]++;
   }__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['28']++;if (isFunction(Ctr)) {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['10'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['29']++;node.__proto__ = Ctr.prototype;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['30']++;Object.defineProperty(node, 'constructor', { value: Ctr, configurable: true, writable: true });__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['31']++;Ctr.call(node);__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['32']++;return true;
   } else {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['10'][1]++;
   }__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['33']++;return false;
}function createElement(is) {
   __cov_hUaPMNyeK5AqLa9EK5WEAQ.f['7']++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['35']++;var Ctr = getComponent(is);__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['36']++;if (Ctr) {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['11'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['37']++;return new Ctr();
   } else {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['11'][1]++;
   }
}function appendChild(parent, element) {
   __cov_hUaPMNyeK5AqLa9EK5WEAQ.f['8']++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['39']++;if (element.node) {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['12'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['40']++;var node = element.node;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['41']++;if ((__cov_hUaPMNyeK5AqLa9EK5WEAQ.b['14'][0]++, parent !== node.parentNode) || (__cov_hUaPMNyeK5AqLa9EK5WEAQ.b['14'][1]++, parent.lastElementChild !== node)) {
         __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['13'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['42']++;if (node.parentNode) {
            __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['15'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['43']++;removeChild(node.parentNode, element);
         } else {
            __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['15'][1]++;
         }__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['44']++;parent.appendChild(node);__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['45']++;return connect(element);
      } else {
         __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['13'][1]++;
      }
   } else {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['12'][1]++;
   }__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['46']++;return false;
}function removeChild(parent, element) {
   __cov_hUaPMNyeK5AqLa9EK5WEAQ.f['9']++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['48']++;if (element.node) {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['16'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['49']++;parent.removeChild(element.node);__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['50']++;return disconnect(element);
   } else {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['16'][1]++;
   }
}function insertBefore(parent, element, refNode) {
   __cov_hUaPMNyeK5AqLa9EK5WEAQ.f['10']++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['52']++;if (element.node) {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['17'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['53']++;var node = element.node;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['54']++;if (node.nextSibling !== refNode) {
         __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['18'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['55']++;if (node.parentNode) {
            __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['19'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['56']++;disconnect(element);
         } else {
            __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['19'][1]++;
         }__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['57']++;parent.insertBefore(node, refNode);__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['58']++;return connect(element);
      } else {
         __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['18'][1]++;
      }
   } else {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['17'][1]++;
   }
}function replaceChild(parent, element, refNode) {
   __cov_hUaPMNyeK5AqLa9EK5WEAQ.f['11']++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['60']++;if (element.node) {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['20'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['61']++;var node = element.node;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['62']++;if (node.parentNode) {
         __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['21'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['63']++;disconnect(element);
      } else {
         __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['21'][1]++;
      }__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['64']++;parent.replaceChild(node, refNode);__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['65']++;if (refNode[COMPONENT_SYMBOL]) {
         __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['22'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['66']++;disconnect(refNode[COMPONENT_SYMBOL]);
      } else {
         __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['22'][1]++;
      }__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['67']++;return connect(node);
   } else {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['20'][1]++;
   }
}function setAttribute(element, name, value) {
   __cov_hUaPMNyeK5AqLa9EK5WEAQ.f['12']++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['69']++;if (element.node) {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['23'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['70']++;var node = element.node;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['71']++;var oldValue = node.getAttribute(name);__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['72']++;node.setAttribute(name, value);__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['73']++;var attrs = (__cov_hUaPMNyeK5AqLa9EK5WEAQ.b['24'][0]++, element.constructor.observedAttributes) || (__cov_hUaPMNyeK5AqLa9EK5WEAQ.b['24'][1]++, []);__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['74']++;if (attrs.indexOf(name) !== -1) {
         __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['25'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['75']++;return update(element, name, oldValue, value);
      } else {
         __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['25'][1]++;
      }
   } else {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['23'][1]++;
   }
}function removeAttribute(element, name) {
   __cov_hUaPMNyeK5AqLa9EK5WEAQ.f['13']++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['77']++;if (element.node) {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['26'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['78']++;var node = element.node;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['79']++;var oldValue = node.getAttribute(name);__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['80']++;node.removeAttribute(name);__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['81']++;var attrs = (__cov_hUaPMNyeK5AqLa9EK5WEAQ.b['27'][0]++, element.constructor.observedAttributes) || (__cov_hUaPMNyeK5AqLa9EK5WEAQ.b['27'][1]++, []);__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['82']++;if (attrs.indexOf(name) !== -1) {
         __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['28'][0]++;__cov_hUaPMNyeK5AqLa9EK5WEAQ.s['83']++;return update(element, name, oldValue, null);
      } else {
         __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['28'][1]++;
      }
   } else {
      __cov_hUaPMNyeK5AqLa9EK5WEAQ.b['26'][1]++;
   }
}

var DOM_HELPERS = Object.freeze({
	getComponent: getComponent,
	isComponent: isComponent,
	connect: connect,
	disconnect: disconnect,
	update: update,
	bind: bind,
	createElement: createElement,
	appendChild: appendChild,
	removeChild: removeChild,
	insertBefore: insertBefore,
	replaceChild: replaceChild,
	setAttribute: setAttribute,
	removeAttribute: removeAttribute
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var __cov_Rv8PK3od0JlZNNewfzNVTw = Function('return this')();
if (!__cov_Rv8PK3od0JlZNNewfzNVTw.__coverage__) {
   __cov_Rv8PK3od0JlZNNewfzNVTw.__coverage__ = {};
}
__cov_Rv8PK3od0JlZNNewfzNVTw = __cov_Rv8PK3od0JlZNNewfzNVTw.__coverage__;
if (!__cov_Rv8PK3od0JlZNNewfzNVTw['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/component.js']) {
   __cov_Rv8PK3od0JlZNNewfzNVTw['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/component.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/component.js", "s": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }, "b": { "1": [0, 0] }, "f": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }, "fnMap": { "1": { "name": "(anonymous_1)", "line": 17, "loc": { "start": { "line": 17, "column": 10 }, "end": { "line": 17, "column": 13 } } }, "2": { "name": "(anonymous_2)", "line": 27, "loc": { "start": { "line": 27, "column": 12 }, "end": { "line": 27, "column": 15 } } }, "3": { "name": "(anonymous_3)", "line": 36, "loc": { "start": { "line": 36, "column": 21 }, "end": { "line": 36, "column": 24 } } }, "4": { "name": "(anonymous_4)", "line": 45, "loc": { "start": { "line": 45, "column": 24 }, "end": { "line": 45, "column": 27 } } }, "5": { "name": "(anonymous_5)", "line": 56, "loc": { "start": { "line": 56, "column": 28 }, "end": { "line": 56, "column": 31 } } } }, "statementMap": { "1": { "start": { "line": 9, "column": 7 }, "end": { "line": 57, "column": 2 } }, "2": { "start": { "line": 9, "column": 46 }, "end": { "line": 57, "column": 1 } }, "3": { "start": { "line": 18, "column": 8 }, "end": { "line": 18, "column": 73 } }, "4": { "start": { "line": 28, "column": 8 }, "end": { "line": 28, "column": 20 } }, "5": { "start": { "line": 37, "column": 8 }, "end": { "line": 37, "column": 43 } } }, "branchMap": { "1": { "line": 18, "type": "binary-expr", "locations": [{ "start": { "line": 18, "column": 16 }, "end": { "line": 18, "column": 39 } }, { "start": { "line": 18, "column": 43 }, "end": { "line": 18, "column": 57 } }] } } };
}
__cov_Rv8PK3od0JlZNNewfzNVTw = __cov_Rv8PK3od0JlZNNewfzNVTw['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/component.js'];
__cov_Rv8PK3od0JlZNNewfzNVTw.s['1']++;var ComponentMixin = function ComponentMixin(SuperClass) {
   __cov_Rv8PK3od0JlZNNewfzNVTw.s['2']++;return function (_SuperClass) {
      inherits(_class, _SuperClass);

      function _class() {
         classCallCheck(this, _class);
         return possibleConstructorReturn(this, _SuperClass.apply(this, arguments));
      }

      _class.prototype.connectedCallback = function connectedCallback() {
         __cov_Rv8PK3od0JlZNNewfzNVTw.f['3']++;__cov_Rv8PK3od0JlZNNewfzNVTw.s['5']++;this.node[COMPONENT_SYMBOL] = this;
      };

      _class.prototype.disconnectedCallback = function disconnectedCallback() {
         __cov_Rv8PK3od0JlZNNewfzNVTw.f['4']++;
      };

      _class.prototype.attributeChangedCallback = function attributeChangedCallback() {
         __cov_Rv8PK3od0JlZNNewfzNVTw.f['5']++;
      };

      createClass(_class, [{
         key: 'is',
         get: function get() {
            __cov_Rv8PK3od0JlZNNewfzNVTw.f['1']++;__cov_Rv8PK3od0JlZNNewfzNVTw.s['3']++;return ((__cov_Rv8PK3od0JlZNNewfzNVTw.b['1'][0]++, this.getAttribute('is')) || (__cov_Rv8PK3od0JlZNNewfzNVTw.b['1'][1]++, this.localName)).toLowerCase();
         }
      }, {
         key: 'node',
         get: function get() {
            __cov_Rv8PK3od0JlZNNewfzNVTw.f['2']++;__cov_Rv8PK3od0JlZNNewfzNVTw.s['4']++;return this;
         }
      }]);
      return _class;
   }(SuperClass);
};

var CustomEvent = void 0;

try {
    // eslint-disable-next-line
    var ev = new self.CustomEvent('test');
    CustomEvent = self.CustomEvent;
} catch (ex) {
    CustomEvent = function CustomEvent(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };
    CustomEvent.prototype = self.CustomEvent.prototype;
}

var __cov_uQZjJvTbWpVwiiVrBvJj4A = Function('return this')();
if (!__cov_uQZjJvTbWpVwiiVrBvJj4A.__coverage__) {
   __cov_uQZjJvTbWpVwiiVrBvJj4A.__coverage__ = {};
}
__cov_uQZjJvTbWpVwiiVrBvJj4A = __cov_uQZjJvTbWpVwiiVrBvJj4A.__coverage__;
if (!__cov_uQZjJvTbWpVwiiVrBvJj4A['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/dispatch.js']) {
   __cov_uQZjJvTbWpVwiiVrBvJj4A['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/dispatch.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/dispatch.js", "s": { "1": 1, "2": 0, "3": 0, "4": 0, "5": 0 }, "b": { "1": [0, 0] }, "f": { "1": 0 }, "fnMap": { "1": { "name": "dispatch", "line": 15, "loc": { "start": { "line": 15, "column": 7 }, "end": { "line": 15, "column": 80 } } } }, "statementMap": { "1": { "start": { "line": 15, "column": 7 }, "end": { "line": 25, "column": 1 } }, "2": { "start": { "line": 16, "column": 4 }, "end": { "line": 18, "column": 5 } }, "3": { "start": { "line": 17, "column": 8 }, "end": { "line": 17, "column": 55 } }, "4": { "start": { "line": 19, "column": 4 }, "end": { "line": 23, "column": 7 } }, "5": { "start": { "line": 24, "column": 4 }, "end": { "line": 24, "column": 34 } } }, "branchMap": { "1": { "line": 16, "type": "if", "locations": [{ "start": { "line": 16, "column": 4 }, "end": { "line": 16, "column": 4 } }, { "start": { "line": 16, "column": 4 }, "end": { "line": 16, "column": 4 } }] } } };
}
__cov_uQZjJvTbWpVwiiVrBvJj4A = __cov_uQZjJvTbWpVwiiVrBvJj4A['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/dispatch.js'];
function dispatch$1(node, evName, data) {
   var bubbles = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
   var cancelable = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
   __cov_uQZjJvTbWpVwiiVrBvJj4A.f['1']++;__cov_uQZjJvTbWpVwiiVrBvJj4A.s['2']++;if (!isString(evName)) {
      __cov_uQZjJvTbWpVwiiVrBvJj4A.b['1'][0]++;__cov_uQZjJvTbWpVwiiVrBvJj4A.s['3']++;throw new TypeError('Event name is undefined');
   } else {
      __cov_uQZjJvTbWpVwiiVrBvJj4A.b['1'][1]++;
   }__cov_uQZjJvTbWpVwiiVrBvJj4A.s['4']++;var ev = new CustomEvent(evName, { detail: data, bubbles: bubbles, cancelable: cancelable });__cov_uQZjJvTbWpVwiiVrBvJj4A.s['5']++;return node.dispatchEvent(ev);
}

var __cov_FZR$$2ac7V3sHdQhM0kwRg = Function('return this')();
if (!__cov_FZR$$2ac7V3sHdQhM0kwRg.__coverage__) {
   __cov_FZR$$2ac7V3sHdQhM0kwRg.__coverage__ = {};
}
__cov_FZR$$2ac7V3sHdQhM0kwRg = __cov_FZR$$2ac7V3sHdQhM0kwRg.__coverage__;
if (!__cov_FZR$$2ac7V3sHdQhM0kwRg['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/property.js']) {
   __cov_FZR$$2ac7V3sHdQhM0kwRg['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/property.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/property.js", "s": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21": 0, "22": 0, "23": 0, "24": 0, "25": 0, "26": 0, "27": 0, "28": 0, "29": 0, "30": 0, "31": 0, "32": 0, "33": 0, "34": 0, "35": 0, "36": 0, "37": 0, "38": 0, "39": 0, "40": 0, "41": 0, "42": 0, "43": 0, "44": 0, "45": 0, "46": 0, "47": 0, "48": 0, "49": 0, "50": 0, "51": 0, "52": 0, "53": 0, "54": 0, "55": 0, "56": 0, "57": 0, "58": 0, "59": 0, "60": 0, "61": 0, "62": 0, "63": 0, "64": 0, "65": 0, "66": 0, "67": 0, "68": 0, "69": 0, "70": 0, "71": 1, "72": 0, "73": 0, "74": 0, "75": 0, "76": 0, "77": 0, "78": 0, "79": 0, "80": 0, "81": 0, "82": 0 }, "b": { "1": [0, 0], "2": [0, 0], "3": [0, 0], "4": [0, 0, 0, 0], "5": [0, 0], "6": [0, 0], "7": [0, 0], "8": [0, 0], "9": [0, 0], "10": [0, 0], "11": [0, 0], "12": [0, 0], "13": [0, 0], "14": [0, 0], "15": [0, 0], "16": [0, 0], "17": [0, 0], "18": [0, 0, 0], "19": [0, 0], "20": [0, 0] }, "f": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0 }, "fnMap": { "1": { "name": "(anonymous_1)", "line": 21, "loc": { "start": { "line": 21, "column": 15 }, "end": { "line": 21, "column": 22 } } }, "2": { "name": "(anonymous_2)", "line": 53, "loc": { "start": { "line": 53, "column": 11 }, "end": { "line": 53, "column": 22 } } }, "3": { "name": "(anonymous_3)", "line": 64, "loc": { "start": { "line": 64, "column": 13 }, "end": { "line": 64, "column": 24 } } }, "4": { "name": "(anonymous_4)", "line": 77, "loc": { "start": { "line": 77, "column": 11 }, "end": { "line": 77, "column": 32 } } }, "5": { "name": "(anonymous_5)", "line": 92, "loc": { "start": { "line": 92, "column": 11 }, "end": { "line": 92, "column": 17 } } }, "6": { "name": "(anonymous_6)", "line": 102, "loc": { "start": { "line": 102, "column": 9 }, "end": { "line": 102, "column": 16 } } }, "7": { "name": "(anonymous_7)", "line": 114, "loc": { "start": { "line": 114, "column": 11 }, "end": { "line": 114, "column": 23 } } }, "8": { "name": "(anonymous_8)", "line": 126, "loc": { "start": { "line": 126, "column": 13 }, "end": { "line": 126, "column": 31 } } }, "9": { "name": "(anonymous_9)", "line": 141, "loc": { "start": { "line": 141, "column": 12 }, "end": { "line": 141, "column": 21 } } }, "10": { "name": "(anonymous_10)", "line": 151, "loc": { "start": { "line": 151, "column": 10 }, "end": { "line": 151, "column": 21 } } }, "11": { "name": "(anonymous_11)", "line": 164, "loc": { "start": { "line": 164, "column": 10 }, "end": { "line": 164, "column": 21 } } }, "12": { "name": "(anonymous_12)", "line": 177, "loc": { "start": { "line": 177, "column": 12 }, "end": { "line": 177, "column": 23 } } }, "13": { "name": "(anonymous_13)", "line": 189, "loc": { "start": { "line": 189, "column": 16 }, "end": { "line": 189, "column": 22 } } }, "14": { "name": "(anonymous_14)", "line": 210, "loc": { "start": { "line": 210, "column": 8 }, "end": { "line": 210, "column": 16 } } }, "15": { "name": "prop", "line": 237, "loc": { "start": { "line": 237, "column": 7 }, "end": { "line": 237, "column": 27 } } }, "16": { "name": "(anonymous_16)", "line": 245, "loc": { "start": { "line": 245, "column": 25 }, "end": { "line": 245, "column": 28 } } }, "17": { "name": "(anonymous_17)", "line": 246, "loc": { "start": { "line": 246, "column": 28 }, "end": { "line": 246, "column": 31 } } }, "18": { "name": "(anonymous_18)", "line": 247, "loc": { "start": { "line": 247, "column": 29 }, "end": { "line": 247, "column": 32 } } }, "19": { "name": "(anonymous_19)", "line": 248, "loc": { "start": { "line": 248, "column": 28 }, "end": { "line": 248, "column": 31 } } } }, "statementMap": { "1": { "start": { "line": 8, "column": 0 }, "end": { "line": 8, "column": 37 } }, "2": { "start": { "line": 22, "column": 8 }, "end": { "line": 22, "column": 20 } }, "3": { "start": { "line": 23, "column": 8 }, "end": { "line": 23, "column": 26 } }, "4": { "start": { "line": 24, "column": 8 }, "end": { "line": 26, "column": 9 } }, "5": { "start": { "line": 25, "column": 12 }, "end": { "line": 25, "column": 26 } }, "6": { "start": { "line": 27, "column": 8 }, "end": { "line": 27, "column": 25 } }, "7": { "start": { "line": 28, "column": 8 }, "end": { "line": 28, "column": 36 } }, "8": { "start": { "line": 28, "column": 31 }, "end": { "line": 28, "column": 35 } }, "9": { "start": { "line": 29, "column": 8 }, "end": { "line": 29, "column": 36 } }, "10": { "start": { "line": 29, "column": 32 }, "end": { "line": 29, "column": 35 } }, "11": { "start": { "line": 30, "column": 8 }, "end": { "line": 30, "column": 41 } }, "12": { "start": { "line": 30, "column": 30 }, "end": { "line": 30, "column": 40 } }, "13": { "start": { "line": 31, "column": 8 }, "end": { "line": 46, "column": 10 } }, "14": { "start": { "line": 32, "column": 12 }, "end": { "line": 32, "column": 36 } }, "15": { "start": { "line": 33, "column": 12 }, "end": { "line": 45, "column": 13 } }, "16": { "start": { "line": 35, "column": 16 }, "end": { "line": 35, "column": 42 } }, "17": { "start": { "line": 36, "column": 16 }, "end": { "line": 39, "column": 17 } }, "18": { "start": { "line": 37, "column": 20 }, "end": { "line": 37, "column": 37 } }, "19": { "start": { "line": 38, "column": 20 }, "end": { "line": 38, "column": 48 } }, "20": { "start": { "line": 42, "column": 16 }, "end": { "line": 44, "column": 18 } }, "21": { "start": { "line": 54, "column": 8 }, "end": { "line": 56, "column": 9 } }, "22": { "start": { "line": 55, "column": 12 }, "end": { "line": 55, "column": 34 } }, "23": { "start": { "line": 57, "column": 8 }, "end": { "line": 57, "column": 20 } }, "24": { "start": { "line": 65, "column": 8 }, "end": { "line": 65, "column": 42 } }, "25": { "start": { "line": 66, "column": 8 }, "end": { "line": 68, "column": 9 } }, "26": { "start": { "line": 67, "column": 12 }, "end": { "line": 67, "column": 33 } }, "27": { "start": { "line": 69, "column": 8 }, "end": { "line": 69, "column": 20 } }, "28": { "start": { "line": 78, "column": 8 }, "end": { "line": 85, "column": 9 } }, "29": { "start": { "line": 79, "column": 12 }, "end": { "line": 79, "column": 32 } }, "30": { "start": { "line": 80, "column": 12 }, "end": { "line": 84, "column": 13 } }, "31": { "start": { "line": 81, "column": 16 }, "end": { "line": 81, "column": 75 } }, "32": { "start": { "line": 83, "column": 16 }, "end": { "line": 83, "column": 46 } }, "33": { "start": { "line": 93, "column": 8 }, "end": { "line": 93, "column": 45 } }, "34": { "start": { "line": 103, "column": 8 }, "end": { "line": 103, "column": 25 } }, "35": { "start": { "line": 104, "column": 8 }, "end": { "line": 106, "column": 9 } }, "36": { "start": { "line": 105, "column": 12 }, "end": { "line": 105, "column": 38 } }, "37": { "start": { "line": 107, "column": 8 }, "end": { "line": 107, "column": 20 } }, "38": { "start": { "line": 115, "column": 8 }, "end": { "line": 117, "column": 22 } }, "39": { "start": { "line": 118, "column": 8 }, "end": { "line": 118, "column": 20 } }, "40": { "start": { "line": 127, "column": 8 }, "end": { "line": 133, "column": 9 } }, "41": { "start": { "line": 128, "column": 12 }, "end": { "line": 128, "column": 39 } }, "42": { "start": { "line": 129, "column": 12 }, "end": { "line": 129, "column": 37 } }, "43": { "start": { "line": 131, "column": 12 }, "end": { "line": 131, "column": 44 } }, "44": { "start": { "line": 132, "column": 12 }, "end": { "line": 132, "column": 38 } }, "45": { "start": { "line": 134, "column": 8 }, "end": { "line": 134, "column": 20 } }, "46": { "start": { "line": 142, "column": 8 }, "end": { "line": 142, "column": 32 } }, "47": { "start": { "line": 143, "column": 8 }, "end": { "line": 143, "column": 20 } }, "48": { "start": { "line": 152, "column": 8 }, "end": { "line": 154, "column": 9 } }, "49": { "start": { "line": 153, "column": 12 }, "end": { "line": 153, "column": 55 } }, "50": { "start": { "line": 153, "column": 34 }, "end": { "line": 153, "column": 54 } }, "51": { "start": { "line": 155, "column": 8 }, "end": { "line": 155, "column": 20 } }, "52": { "start": { "line": 165, "column": 8 }, "end": { "line": 167, "column": 9 } }, "53": { "start": { "line": 166, "column": 12 }, "end": { "line": 166, "column": 36 } }, "54": { "start": { "line": 168, "column": 8 }, "end": { "line": 168, "column": 20 } }, "55": { "start": { "line": 178, "column": 8 }, "end": { "line": 180, "column": 9 } }, "56": { "start": { "line": 179, "column": 12 }, "end": { "line": 179, "column": 38 } }, "57": { "start": { "line": 181, "column": 8 }, "end": { "line": 181, "column": 20 } }, "58": { "start": { "line": 190, "column": 8 }, "end": { "line": 190, "column": 18 } }, "59": { "start": { "line": 191, "column": 8 }, "end": { "line": 191, "column": 29 } }, "60": { "start": { "line": 192, "column": 8 }, "end": { "line": 194, "column": 9 } }, "61": { "start": { "line": 193, "column": 12 }, "end": { "line": 193, "column": 24 } }, "62": { "start": { "line": 195, "column": 8 }, "end": { "line": 202, "column": 9 } }, "63": { "start": { "line": 196, "column": 12 }, "end": { "line": 200, "column": 13 } }, "64": { "start": { "line": 199, "column": 16 }, "end": { "line": 199, "column": 28 } }, "65": { "start": { "line": 201, "column": 12 }, "end": { "line": 201, "column": 16 } }, "66": { "start": { "line": 203, "column": 8 }, "end": { "line": 203, "column": 21 } }, "67": { "start": { "line": 211, "column": 8 }, "end": { "line": 211, "column": 27 } }, "68": { "start": { "line": 212, "column": 8 }, "end": { "line": 216, "column": 11 } }, "69": { "start": { "line": 217, "column": 8 }, "end": { "line": 219, "column": 9 } }, "70": { "start": { "line": 218, "column": 12 }, "end": { "line": 218, "column": 49 } }, "71": { "start": { "line": 237, "column": 7 }, "end": { "line": 242, "column": 1 } }, "72": { "start": { "line": 238, "column": 4 }, "end": { "line": 240, "column": 5 } }, "73": { "start": { "line": 239, "column": 8 }, "end": { "line": 239, "column": 20 } }, "74": { "start": { "line": 241, "column": 4 }, "end": { "line": 241, "column": 30 } }, "75": { "start": { "line": 245, "column": 0 }, "end": { "line": 245, "column": 50 } }, "76": { "start": { "line": 245, "column": 30 }, "end": { "line": 245, "column": 44 } }, "77": { "start": { "line": 246, "column": 0 }, "end": { "line": 246, "column": 59 } }, "78": { "start": { "line": 246, "column": 33 }, "end": { "line": 246, "column": 53 } }, "79": { "start": { "line": 247, "column": 0 }, "end": { "line": 247, "column": 61 } }, "80": { "start": { "line": 247, "column": 34 }, "end": { "line": 247, "column": 55 } }, "81": { "start": { "line": 248, "column": 0 }, "end": { "line": 248, "column": 59 } }, "82": { "start": { "line": 248, "column": 33 }, "end": { "line": 248, "column": 53 } } }, "branchMap": { "1": { "line": 23, "type": "binary-expr", "locations": [{ "start": { "line": 23, "column": 15 }, "end": { "line": 23, "column": 19 } }, { "start": { "line": 23, "column": 23 }, "end": { "line": 23, "column": 25 } }] }, "2": { "line": 24, "type": "if", "locations": [{ "start": { "line": 24, "column": 8 }, "end": { "line": 24, "column": 8 } }, { "start": { "line": 24, "column": 8 }, "end": { "line": 24, "column": 8 } }] }, "3": { "line": 33, "type": "if", "locations": [{ "start": { "line": 33, "column": 12 }, "end": { "line": 33, "column": 12 } }, { "start": { "line": 33, "column": 12 }, "end": { "line": 33, "column": 12 } }] }, "4": { "line": 33, "type": "binary-expr", "locations": [{ "start": { "line": 33, "column": 17 }, "end": { "line": 33, "column": 29 } }, { "start": { "line": 33, "column": 33 }, "end": { "line": 33, "column": 50 } }, { "start": { "line": 34, "column": 16 }, "end": { "line": 34, "column": 38 } }, { "start": { "line": 34, "column": 42 }, "end": { "line": 34, "column": 61 } }] }, "5": { "line": 36, "type": "if", "locations": [{ "start": { "line": 36, "column": 16 }, "end": { "line": 36, "column": 16 } }, { "start": { "line": 36, "column": 16 }, "end": { "line": 36, "column": 16 } }] }, "6": { "line": 54, "type": "if", "locations": [{ "start": { "line": 54, "column": 8 }, "end": { "line": 54, "column": 8 } }, { "start": { "line": 54, "column": 8 }, "end": { "line": 54, "column": 8 } }] }, "7": { "line": 54, "type": "binary-expr", "locations": [{ "start": { "line": 54, "column": 12 }, "end": { "line": 54, "column": 32 } }, { "start": { "line": 54, "column": 36 }, "end": { "line": 54, "column": 54 } }] }, "8": { "line": 66, "type": "if", "locations": [{ "start": { "line": 66, "column": 8 }, "end": { "line": 66, "column": 8 } }, { "start": { "line": 66, "column": 8 }, "end": { "line": 66, "column": 8 } }] }, "9": { "line": 80, "type": "if", "locations": [{ "start": { "line": 80, "column": 12 }, "end": { "line": 80, "column": 12 } }, { "start": { "line": 80, "column": 12 }, "end": { "line": 80, "column": 12 } }] }, "10": { "line": 104, "type": "if", "locations": [{ "start": { "line": 104, "column": 8 }, "end": { "line": 104, "column": 8 } }, { "start": { "line": 104, "column": 8 }, "end": { "line": 104, "column": 8 } }] }, "11": { "line": 115, "type": "cond-expr", "locations": [{ "start": { "line": 116, "column": 12 }, "end": { "line": 116, "column": 36 } }, { "start": { "line": 117, "column": 12 }, "end": { "line": 117, "column": 21 } }] }, "12": { "line": 127, "type": "if", "locations": [{ "start": { "line": 127, "column": 8 }, "end": { "line": 127, "column": 8 } }, { "start": { "line": 127, "column": 8 }, "end": { "line": 127, "column": 8 } }] }, "13": { "line": 152, "type": "if", "locations": [{ "start": { "line": 152, "column": 8 }, "end": { "line": 152, "column": 8 } }, { "start": { "line": 152, "column": 8 }, "end": { "line": 152, "column": 8 } }] }, "14": { "line": 165, "type": "if", "locations": [{ "start": { "line": 165, "column": 8 }, "end": { "line": 165, "column": 8 } }, { "start": { "line": 165, "column": 8 }, "end": { "line": 165, "column": 8 } }] }, "15": { "line": 178, "type": "if", "locations": [{ "start": { "line": 178, "column": 8 }, "end": { "line": 178, "column": 8 } }, { "start": { "line": 178, "column": 8 }, "end": { "line": 178, "column": 8 } }] }, "16": { "line": 192, "type": "if", "locations": [{ "start": { "line": 192, "column": 8 }, "end": { "line": 192, "column": 8 } }, { "start": { "line": 192, "column": 8 }, "end": { "line": 192, "column": 8 } }] }, "17": { "line": 196, "type": "if", "locations": [{ "start": { "line": 196, "column": 12 }, "end": { "line": 196, "column": 12 } }, { "start": { "line": 196, "column": 12 }, "end": { "line": 196, "column": 12 } }] }, "18": { "line": 196, "type": "binary-expr", "locations": [{ "start": { "line": 196, "column": 16 }, "end": { "line": 196, "column": 38 } }, { "start": { "line": 197, "column": 16 }, "end": { "line": 197, "column": 31 } }, { "start": { "line": 197, "column": 35 }, "end": { "line": 197, "column": 62 } }] }, "19": { "line": 217, "type": "if", "locations": [{ "start": { "line": 217, "column": 8 }, "end": { "line": 217, "column": 8 } }, { "start": { "line": 217, "column": 8 }, "end": { "line": 217, "column": 8 } }] }, "20": { "line": 238, "type": "if", "locations": [{ "start": { "line": 238, "column": 4 }, "end": { "line": 238, "column": 4 } }, { "start": { "line": 238, "column": 4 }, "end": { "line": 238, "column": 4 } }] } } };
}
__cov_FZR$$2ac7V3sHdQhM0kwRg = __cov_FZR$$2ac7V3sHdQhM0kwRg['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/property.js'];
__cov_FZR$$2ac7V3sHdQhM0kwRg.s['1']++;var define$2 = Object.defineProperty;
var Property = function () {
   function Property(ctrs) {
      var _this = this;

      classCallCheck(this, Property);
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['1']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['2']++;this._ = [];__cov_FZR$$2ac7V3sHdQhM0kwRg.s['3']++;ctrs = (__cov_FZR$$2ac7V3sHdQhM0kwRg.b['1'][0]++, ctrs) || (__cov_FZR$$2ac7V3sHdQhM0kwRg.b['1'][1]++, []);__cov_FZR$$2ac7V3sHdQhM0kwRg.s['4']++;if (!isArray(ctrs)) {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['2'][0]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['5']++;ctrs = [ctrs];
      } else {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['2'][1]++;
      }__cov_FZR$$2ac7V3sHdQhM0kwRg.s['6']++;this.ctrs = ctrs;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['7']++;this.validator = function () {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.s['8']++;return true;
      };__cov_FZR$$2ac7V3sHdQhM0kwRg.s['9']++;this._setter = function (val) {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.s['10']++;return val;
      };__cov_FZR$$2ac7V3sHdQhM0kwRg.s['11']++;this.getterFn = function () {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.s['12']++;return _this.value;
      };__cov_FZR$$2ac7V3sHdQhM0kwRg.s['13']++;this.setterFn = function (val) {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.s['14']++;val = _this._setter(val);__cov_FZR$$2ac7V3sHdQhM0kwRg.s['15']++;if ((__cov_FZR$$2ac7V3sHdQhM0kwRg.b['4'][0]++, val === null) || (__cov_FZR$$2ac7V3sHdQhM0kwRg.b['4'][1]++, val === undefined) || (__cov_FZR$$2ac7V3sHdQhM0kwRg.b['4'][2]++, _this.validateType(val)) && (__cov_FZR$$2ac7V3sHdQhM0kwRg.b['4'][3]++, _this.validator(val))) {
            __cov_FZR$$2ac7V3sHdQhM0kwRg.b['3'][0]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['16']++;var oldValue = _this.value;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['17']++;if (oldValue !== val) {
               __cov_FZR$$2ac7V3sHdQhM0kwRg.b['5'][0]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['18']++;_this.value = val;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['19']++;_this.changed(val, oldValue);
            } else {
               __cov_FZR$$2ac7V3sHdQhM0kwRg.b['5'][1]++;
            }
         } else {
            __cov_FZR$$2ac7V3sHdQhM0kwRg.b['3'][1]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['20']++;throw new TypeError('Invalid `' + val + '` value for `' + _this.name + '` property for `' + _this.scope.is + '`.');
         }
      };
   }

   Property.prototype.observe = function observe(callback) {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['2']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['21']++;if ((__cov_FZR$$2ac7V3sHdQhM0kwRg.b['7'][0]++, isFunction(callback)) || (__cov_FZR$$2ac7V3sHdQhM0kwRg.b['7'][1]++, isString(callback))) {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['6'][0]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['22']++;this._.push(callback);
      } else {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['6'][1]++;
      }__cov_FZR$$2ac7V3sHdQhM0kwRg.s['23']++;return this;
   };

   Property.prototype.unobserve = function unobserve(callback) {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['3']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['24']++;var io = this._.indexOf(callback);__cov_FZR$$2ac7V3sHdQhM0kwRg.s['25']++;if (io !== -1) {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['8'][0]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['26']++;this._.splice(io, 1);
      } else {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['8'][1]++;
      }__cov_FZR$$2ac7V3sHdQhM0kwRg.s['27']++;return this;
   };

   Property.prototype.changed = function changed(newValue, oldValue) {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['4']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['28']++;for (var i = 0, len = this._.length; i < len; i++) {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.s['29']++;var clb = this._[i];__cov_FZR$$2ac7V3sHdQhM0kwRg.s['30']++;if (isString(clb)) {
            __cov_FZR$$2ac7V3sHdQhM0kwRg.b['9'][0]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['31']++;this.scope[clb].call(this.scope, this, newValue, oldValue);
         } else {
            __cov_FZR$$2ac7V3sHdQhM0kwRg.b['9'][1]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['32']++;clb(this, newValue, oldValue);
         }
      }
   };

   Property.prototype.accepts = function accepts(Ctr) {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['5']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['33']++;return this.ctrs.indexOf(Ctr) !== -1;
   };

   Property.prototype.named = function named(name) {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['6']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['34']++;this.name = name;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['35']++;if (this.attrRequested === true) {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['10'][0]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['36']++;this.attrName = this.name;
      } else {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['10'][1]++;
      }__cov_FZR$$2ac7V3sHdQhM0kwRg.s['37']++;return this;
   };

   Property.prototype.default = function _default(initValue) {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['7']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['38']++;this.defaultValue = isObject(initValue) ? (__cov_FZR$$2ac7V3sHdQhM0kwRg.b['11'][0]++, Object.freeze(initValue)) : (__cov_FZR$$2ac7V3sHdQhM0kwRg.b['11'][1]++, initValue);__cov_FZR$$2ac7V3sHdQhM0kwRg.s['39']++;return this;
   };

   Property.prototype.attribute = function attribute() {
      var attrName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['8']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['40']++;if (isString(attrName)) {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['12'][0]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['41']++;this.attrRequested = false;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['42']++;this.attrName = attrName;
      } else {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['12'][1]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['43']++;this.attrRequested = !!attrName;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['44']++;this.attrName = this.name;
      }__cov_FZR$$2ac7V3sHdQhM0kwRg.s['45']++;return this;
   };

   Property.prototype.dispatch = function dispatch(evName) {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['9']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['46']++;this.eventName = evName;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['47']++;return this;
   };

   Property.prototype.getter = function getter(callback) {
      var _this2 = this;

      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['10']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['48']++;if (isFunction(callback)) {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['13'][0]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['49']++;this.getterFn = function () {
            __cov_FZR$$2ac7V3sHdQhM0kwRg.s['50']++;return callback(_this2.value);
         };
      } else {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['13'][1]++;
      }__cov_FZR$$2ac7V3sHdQhM0kwRg.s['51']++;return this;
   };

   Property.prototype.setter = function setter(callback) {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['11']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['52']++;if (isFunction(callback)) {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['14'][0]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['53']++;this._setter = callback;
      } else {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['14'][1]++;
      }__cov_FZR$$2ac7V3sHdQhM0kwRg.s['54']++;return this;
   };

   Property.prototype.validate = function validate(callback) {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['12']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['55']++;if (isFunction(callback)) {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['15'][0]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['56']++;this.validator = callback;
      } else {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['15'][1]++;
      }__cov_FZR$$2ac7V3sHdQhM0kwRg.s['57']++;return this;
   };

   Property.prototype.validateType = function validateType(val) {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['13']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['58']++;var i = 0;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['59']++;var ctrs = this.ctrs;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['60']++;if (ctrs.length === 0) {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['16'][0]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['61']++;return true;
      } else {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['16'][1]++;
      }__cov_FZR$$2ac7V3sHdQhM0kwRg.s['62']++;while (i < ctrs.length) {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.s['63']++;if ((__cov_FZR$$2ac7V3sHdQhM0kwRg.b['18'][0]++, val instanceof ctrs[i]) || (__cov_FZR$$2ac7V3sHdQhM0kwRg.b['18'][1]++, val.constructor) && (__cov_FZR$$2ac7V3sHdQhM0kwRg.b['18'][2]++, val.constructor === ctrs[i])) {
            __cov_FZR$$2ac7V3sHdQhM0kwRg.b['17'][0]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['64']++;return true;
         } else {
            __cov_FZR$$2ac7V3sHdQhM0kwRg.b['17'][1]++;
         }__cov_FZR$$2ac7V3sHdQhM0kwRg.s['65']++;i++;
      }__cov_FZR$$2ac7V3sHdQhM0kwRg.s['66']++;return false;
   };

   Property.prototype.init = function init(scope) {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['14']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['67']++;this.scope = scope;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['68']++;define$2(scope, this.name, { get: this.getterFn.bind(this), set: this.setterFn.bind(this), configurable: true });__cov_FZR$$2ac7V3sHdQhM0kwRg.s['69']++;if (!isUndefined(this.defaultValue)) {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['19'][0]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['70']++;scope[this.name] = this.defaultValue;
      } else {
         __cov_FZR$$2ac7V3sHdQhM0kwRg.b['19'][1]++;
      }
   };

   return Property;
}();

function prop(ctrs) {
   __cov_FZR$$2ac7V3sHdQhM0kwRg.f['15']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['72']++;if (ctrs instanceof Property) {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.b['20'][0]++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['73']++;return ctrs;
   } else {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.b['20'][1]++;
   }__cov_FZR$$2ac7V3sHdQhM0kwRg.s['74']++;return new Property(ctrs);
}__cov_FZR$$2ac7V3sHdQhM0kwRg.s['75']++;define$2(prop, 'ANY', {
   get: function get() {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['16']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['76']++;return prop();
   }
});__cov_FZR$$2ac7V3sHdQhM0kwRg.s['77']++;define$2(prop, 'STRING', {
   get: function get() {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['17']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['78']++;return prop(String);
   }
});__cov_FZR$$2ac7V3sHdQhM0kwRg.s['79']++;define$2(prop, 'BOOLEAN', {
   get: function get() {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['18']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['80']++;return prop(Boolean);
   }
});__cov_FZR$$2ac7V3sHdQhM0kwRg.s['81']++;define$2(prop, 'NUMBER', {
   get: function get() {
      __cov_FZR$$2ac7V3sHdQhM0kwRg.f['19']++;__cov_FZR$$2ac7V3sHdQhM0kwRg.s['82']++;return prop(Number);
   }
});

var __cov_RqEld7XqE9cnBxJK2yK61g = Function('return this')();
if (!__cov_RqEld7XqE9cnBxJK2yK61g.__coverage__) {
   __cov_RqEld7XqE9cnBxJK2yK61g.__coverage__ = {};
}
__cov_RqEld7XqE9cnBxJK2yK61g = __cov_RqEld7XqE9cnBxJK2yK61g.__coverage__;
if (!__cov_RqEld7XqE9cnBxJK2yK61g['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/properties-component.js']) {
   __cov_RqEld7XqE9cnBxJK2yK61g['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/properties-component.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/properties-component.js", "s": { "1": 1, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 1, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21": 0, "22": 0, "23": 0, "24": 0, "25": 0, "26": 0, "27": 0, "28": 0, "29": 0, "30": 0, "31": 0, "32": 0, "33": 0, "34": 0, "35": 0, "36": 0, "37": 0, "38": 0, "39": 0, "40": 0, "41": 0, "42": 0, "43": 0, "44": 0, "45": 0, "46": 0, "47": 0, "48": 0, "49": 0, "50": 0, "51": 0, "52": 0, "53": 0, "54": 0, "55": 0, "56": 0, "57": 0, "58": 0, "59": 0, "60": 0, "61": 0, "62": 0, "63": 0 }, "b": { "1": [0, 0], "2": [0, 0], "3": [0, 0], "4": [0, 0], "5": [0, 0], "6": [0, 0, 0], "7": [0, 0, 0], "8": [0, 0], "9": [0, 0], "10": [0, 0], "11": [0, 0], "12": [0, 0], "13": [0, 0], "14": [0, 0], "15": [0, 0], "16": [0, 0], "17": [0, 0], "18": [0, 0], "19": [0, 0], "20": [0, 0], "21": [0, 0] }, "f": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0 }, "fnMap": { "1": { "name": "getValue", "line": 14, "loc": { "start": { "line": 14, "column": 0 }, "end": { "line": 14, "column": 37 } } }, "2": { "name": "setAttribute", "line": 36, "loc": { "start": { "line": 36, "column": 0 }, "end": { "line": 36, "column": 44 } } }, "3": { "name": "(anonymous_3)", "line": 88, "loc": { "start": { "line": 88, "column": 15 }, "end": { "line": 88, "column": 18 } } }, "4": { "name": "(anonymous_4)", "line": 136, "loc": { "start": { "line": 136, "column": 21 }, "end": { "line": 136, "column": 24 } } }, "5": { "name": "(anonymous_5)", "line": 163, "loc": { "start": { "line": 163, "column": 28 }, "end": { "line": 163, "column": 51 } } }, "6": { "name": "(anonymous_6)", "line": 184, "loc": { "start": { "line": 184, "column": 19 }, "end": { "line": 184, "column": 40 } } }, "7": { "name": "(anonymous_7)", "line": 196, "loc": { "start": { "line": 196, "column": 21 }, "end": { "line": 196, "column": 42 } } } }, "statementMap": { "1": { "start": { "line": 14, "column": 0 }, "end": { "line": 26, "column": 1 } }, "2": { "start": { "line": 15, "column": 4 }, "end": { "line": 17, "column": 5 } }, "3": { "start": { "line": 16, "column": 8 }, "end": { "line": 16, "column": 20 } }, "4": { "start": { "line": 18, "column": 4 }, "end": { "line": 24, "column": 5 } }, "5": { "start": { "line": 19, "column": 8 }, "end": { "line": 23, "column": 9 } }, "6": { "start": { "line": 20, "column": 12 }, "end": { "line": 20, "column": 39 } }, "7": { "start": { "line": 25, "column": 4 }, "end": { "line": 25, "column": 19 } }, "8": { "start": { "line": 36, "column": 0 }, "end": { "line": 52, "column": 1 } }, "9": { "start": { "line": 37, "column": 4 }, "end": { "line": 37, "column": 54 } }, "10": { "start": { "line": 38, "column": 4 }, "end": { "line": 51, "column": 5 } }, "11": { "start": { "line": 39, "column": 8 }, "end": { "line": 50, "column": 9 } }, "12": { "start": { "line": 40, "column": 12 }, "end": { "line": 47, "column": 13 } }, "13": { "start": { "line": 43, "column": 16 }, "end": { "line": 43, "column": 50 } }, "14": { "start": { "line": 44, "column": 16 }, "end": { "line": 44, "column": 22 } }, "15": { "start": { "line": 46, "column": 16 }, "end": { "line": 46, "column": 47 } }, "16": { "start": { "line": 48, "column": 15 }, "end": { "line": 50, "column": 9 } }, "17": { "start": { "line": 49, "column": 12 }, "end": { "line": 49, "column": 42 } }, "18": { "start": { "line": 81, "column": 7 }, "end": { "line": 199, "column": 2 } }, "19": { "start": { "line": 81, "column": 47 }, "end": { "line": 199, "column": 1 } }, "20": { "start": { "line": 89, "column": 8 }, "end": { "line": 89, "column": 16 } }, "21": { "start": { "line": 90, "column": 8 }, "end": { "line": 90, "column": 36 } }, "22": { "start": { "line": 91, "column": 8 }, "end": { "line": 103, "column": 9 } }, "23": { "start": { "line": 92, "column": 12 }, "end": { "line": 94, "column": 13 } }, "24": { "start": { "line": 93, "column": 16 }, "end": { "line": 93, "column": 32 } }, "25": { "start": { "line": 95, "column": 12 }, "end": { "line": 100, "column": 19 } }, "26": { "start": { "line": 96, "column": 16 }, "end": { "line": 98, "column": 17 } }, "27": { "start": { "line": 97, "column": 20 }, "end": { "line": 97, "column": 51 } }, "28": { "start": { "line": 99, "column": 16 }, "end": { "line": 99, "column": 27 } }, "29": { "start": { "line": 102, "column": 12 }, "end": { "line": 102, "column": 23 } }, "30": { "start": { "line": 104, "column": 8 }, "end": { "line": 108, "column": 11 } }, "31": { "start": { "line": 109, "column": 8 }, "end": { "line": 109, "column": 65 } }, "32": { "start": { "line": 110, "column": 8 }, "end": { "line": 128, "column": 9 } }, "33": { "start": { "line": 111, "column": 12 }, "end": { "line": 111, "column": 32 } }, "34": { "start": { "line": 112, "column": 12 }, "end": { "line": 112, "column": 37 } }, "35": { "start": { "line": 113, "column": 12 }, "end": { "line": 113, "column": 47 } }, "36": { "start": { "line": 114, "column": 12 }, "end": { "line": 117, "column": 13 } }, "37": { "start": { "line": 115, "column": 16 }, "end": { "line": 115, "column": 33 } }, "38": { "start": { "line": 116, "column": 16 }, "end": { "line": 116, "column": 29 } }, "39": { "start": { "line": 118, "column": 12 }, "end": { "line": 127, "column": 13 } }, "40": { "start": { "line": 119, "column": 16 }, "end": { "line": 126, "column": 19 } }, "41": { "start": { "line": 120, "column": 20 }, "end": { "line": 122, "column": 21 } }, "42": { "start": { "line": 121, "column": 24 }, "end": { "line": 121, "column": 75 } }, "43": { "start": { "line": 123, "column": 20 }, "end": { "line": 125, "column": 21 } }, "44": { "start": { "line": 124, "column": 24 }, "end": { "line": 124, "column": 55 } }, "45": { "start": { "line": 137, "column": 8 }, "end": { "line": 137, "column": 34 } }, "46": { "start": { "line": 138, "column": 8 }, "end": { "line": 138, "column": 36 } }, "47": { "start": { "line": 139, "column": 8 }, "end": { "line": 151, "column": 9 } }, "48": { "start": { "line": 140, "column": 12 }, "end": { "line": 140, "column": 32 } }, "49": { "start": { "line": 141, "column": 12 }, "end": { "line": 141, "column": 36 } }, "50": { "start": { "line": 142, "column": 12 }, "end": { "line": 150, "column": 13 } }, "51": { "start": { "line": 143, "column": 16 }, "end": { "line": 149, "column": 17 } }, "52": { "start": { "line": 144, "column": 20 }, "end": { "line": 146, "column": 21 } }, "53": { "start": { "line": 145, "column": 24 }, "end": { "line": 145, "column": 91 } }, "54": { "start": { "line": 148, "column": 20 }, "end": { "line": 148, "column": 71 } }, "55": { "start": { "line": 164, "column": 8 }, "end": { "line": 164, "column": 61 } }, "56": { "start": { "line": 165, "column": 8 }, "end": { "line": 165, "column": 36 } }, "57": { "start": { "line": 166, "column": 8 }, "end": { "line": 172, "column": 9 } }, "58": { "start": { "line": 167, "column": 12 }, "end": { "line": 167, "column": 32 } }, "59": { "start": { "line": 168, "column": 12 }, "end": { "line": 171, "column": 13 } }, "60": { "start": { "line": 169, "column": 16 }, "end": { "line": 169, "column": 57 } }, "61": { "start": { "line": 170, "column": 16 }, "end": { "line": 170, "column": 23 } }, "62": { "start": { "line": 185, "column": 8 }, "end": { "line": 185, "column": 59 } }, "63": { "start": { "line": 197, "column": 8 }, "end": { "line": 197, "column": 54 } } }, "branchMap": { "1": { "line": 15, "type": "if", "locations": [{ "start": { "line": 15, "column": 4 }, "end": { "line": 15, "column": 4 } }, { "start": { "line": 15, "column": 4 }, "end": { "line": 15, "column": 4 } }] }, "2": { "line": 15, "type": "binary-expr", "locations": [{ "start": { "line": 15, "column": 8 }, "end": { "line": 15, "column": 22 } }, { "start": { "line": 15, "column": 26 }, "end": { "line": 15, "column": 51 } }] }, "3": { "line": 18, "type": "if", "locations": [{ "start": { "line": 18, "column": 4 }, "end": { "line": 18, "column": 4 } }, { "start": { "line": 18, "column": 4 }, "end": { "line": 18, "column": 4 } }] }, "4": { "line": 38, "type": "if", "locations": [{ "start": { "line": 38, "column": 4 }, "end": { "line": 38, "column": 4 } }, { "start": { "line": 38, "column": 4 }, "end": { "line": 38, "column": 4 } }] }, "5": { "line": 39, "type": "if", "locations": [{ "start": { "line": 39, "column": 8 }, "end": { "line": 39, "column": 8 } }, { "start": { "line": 39, "column": 8 }, "end": { "line": 39, "column": 8 } }] }, "6": { "line": 39, "type": "binary-expr", "locations": [{ "start": { "line": 39, "column": 12 }, "end": { "line": 39, "column": 26 } }, { "start": { "line": 39, "column": 30 }, "end": { "line": 39, "column": 49 } }, { "start": { "line": 39, "column": 53 }, "end": { "line": 39, "column": 68 } }] }, "7": { "line": 40, "type": "switch", "locations": [{ "start": { "line": 41, "column": 12 }, "end": { "line": 41, "column": 26 } }, { "start": { "line": 42, "column": 12 }, "end": { "line": 44, "column": 22 } }, { "start": { "line": 45, "column": 12 }, "end": { "line": 46, "column": 47 } }] }, "8": { "line": 48, "type": "if", "locations": [{ "start": { "line": 48, "column": 15 }, "end": { "line": 48, "column": 15 } }, { "start": { "line": 48, "column": 15 }, "end": { "line": 48, "column": 15 } }] }, "9": { "line": 91, "type": "if", "locations": [{ "start": { "line": 91, "column": 8 }, "end": { "line": 91, "column": 8 } }, { "start": { "line": 91, "column": 8 }, "end": { "line": 91, "column": 8 } }] }, "10": { "line": 92, "type": "if", "locations": [{ "start": { "line": 92, "column": 12 }, "end": { "line": 92, "column": 12 } }, { "start": { "line": 92, "column": 12 }, "end": { "line": 92, "column": 12 } }] }, "11": { "line": 109, "type": "binary-expr", "locations": [{ "start": { "line": 109, "column": 23 }, "end": { "line": 109, "column": 58 } }, { "start": { "line": 109, "column": 62 }, "end": { "line": 109, "column": 64 } }] }, "12": { "line": 114, "type": "if", "locations": [{ "start": { "line": 114, "column": 12 }, "end": { "line": 114, "column": 12 } }, { "start": { "line": 114, "column": 12 }, "end": { "line": 114, "column": 12 } }] }, "13": { "line": 114, "type": "binary-expr", "locations": [{ "start": { "line": 114, "column": 16 }, "end": { "line": 114, "column": 25 } }, { "start": { "line": 114, "column": 29 }, "end": { "line": 114, "column": 55 } }] }, "14": { "line": 118, "type": "if", "locations": [{ "start": { "line": 118, "column": 12 }, "end": { "line": 118, "column": 12 } }, { "start": { "line": 118, "column": 12 }, "end": { "line": 118, "column": 12 } }] }, "15": { "line": 118, "type": "binary-expr", "locations": [{ "start": { "line": 118, "column": 16 }, "end": { "line": 118, "column": 24 } }, { "start": { "line": 118, "column": 28 }, "end": { "line": 118, "column": 37 } }] }, "16": { "line": 120, "type": "if", "locations": [{ "start": { "line": 120, "column": 20 }, "end": { "line": 120, "column": 20 } }, { "start": { "line": 120, "column": 20 }, "end": { "line": 120, "column": 20 } }] }, "17": { "line": 123, "type": "if", "locations": [{ "start": { "line": 123, "column": 20 }, "end": { "line": 123, "column": 20 } }, { "start": { "line": 123, "column": 20 }, "end": { "line": 123, "column": 20 } }] }, "18": { "line": 142, "type": "if", "locations": [{ "start": { "line": 142, "column": 12 }, "end": { "line": 142, "column": 12 } }, { "start": { "line": 142, "column": 12 }, "end": { "line": 142, "column": 12 } }] }, "19": { "line": 143, "type": "if", "locations": [{ "start": { "line": 143, "column": 16 }, "end": { "line": 143, "column": 16 } }, { "start": { "line": 143, "column": 16 }, "end": { "line": 143, "column": 16 } }] }, "20": { "line": 144, "type": "if", "locations": [{ "start": { "line": 144, "column": 20 }, "end": { "line": 144, "column": 20 } }, { "start": { "line": 144, "column": 20 }, "end": { "line": 144, "column": 20 } }] }, "21": { "line": 168, "type": "if", "locations": [{ "start": { "line": 168, "column": 12 }, "end": { "line": 168, "column": 12 } }, { "start": { "line": 168, "column": 12 }, "end": { "line": 168, "column": 12 } }] } } };
}
__cov_RqEld7XqE9cnBxJK2yK61g = __cov_RqEld7XqE9cnBxJK2yK61g['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/properties-component.js'];
function getValue(property, attrVal) {
   __cov_RqEld7XqE9cnBxJK2yK61g.f['1']++;__cov_RqEld7XqE9cnBxJK2yK61g.s['2']++;if ((__cov_RqEld7XqE9cnBxJK2yK61g.b['2'][0]++, attrVal === '') && (__cov_RqEld7XqE9cnBxJK2yK61g.b['2'][1]++, property.accepts(Boolean))) {
      __cov_RqEld7XqE9cnBxJK2yK61g.b['1'][0]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['3']++;return true;
   } else {
      __cov_RqEld7XqE9cnBxJK2yK61g.b['1'][1]++;
   }__cov_RqEld7XqE9cnBxJK2yK61g.s['4']++;if (!property.accepts(String)) {
      __cov_RqEld7XqE9cnBxJK2yK61g.b['3'][0]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['5']++;try {
         __cov_RqEld7XqE9cnBxJK2yK61g.s['6']++;return JSON.parse(attrVal);
      } catch (ex) {}
   } else {
      __cov_RqEld7XqE9cnBxJK2yK61g.b['3'][1]++;
   }__cov_RqEld7XqE9cnBxJK2yK61g.s['7']++;return attrVal;
}function setAttribute$1(context, attr, value) {
   __cov_RqEld7XqE9cnBxJK2yK61g.f['2']++;__cov_RqEld7XqE9cnBxJK2yK61g.s['9']++;var currentAttrValue = context.getAttribute(attr);__cov_RqEld7XqE9cnBxJK2yK61g.s['10']++;if (currentAttrValue !== value) {
      __cov_RqEld7XqE9cnBxJK2yK61g.b['4'][0]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['11']++;if ((__cov_RqEld7XqE9cnBxJK2yK61g.b['6'][0]++, value !== null) && (__cov_RqEld7XqE9cnBxJK2yK61g.b['6'][1]++, value !== undefined) && (__cov_RqEld7XqE9cnBxJK2yK61g.b['6'][2]++, value !== false)) {
         __cov_RqEld7XqE9cnBxJK2yK61g.b['5'][0]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['12']++;switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {case 'string':
               __cov_RqEld7XqE9cnBxJK2yK61g.b['7'][0]++;case 'number':
               __cov_RqEld7XqE9cnBxJK2yK61g.b['7'][1]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['13']++;context.setAttribute(attr, value);__cov_RqEld7XqE9cnBxJK2yK61g.s['14']++;break;case 'boolean':
               __cov_RqEld7XqE9cnBxJK2yK61g.b['7'][2]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['15']++;context.setAttribute(attr, '');}
      } else {
         __cov_RqEld7XqE9cnBxJK2yK61g.b['5'][1]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['16']++;if (currentAttrValue !== null) {
            __cov_RqEld7XqE9cnBxJK2yK61g.b['8'][0]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['17']++;context.removeAttribute(attr);
         } else {
            __cov_RqEld7XqE9cnBxJK2yK61g.b['8'][1]++;
         }
      }
   } else {
      __cov_RqEld7XqE9cnBxJK2yK61g.b['4'][1]++;
   }
}__cov_RqEld7XqE9cnBxJK2yK61g.s['18']++;var PropertiesMixin = function PropertiesMixin(SuperClass) {
   __cov_RqEld7XqE9cnBxJK2yK61g.s['19']++;return function (_SuperClass) {
      inherits(_class, _SuperClass);

      function _class() {
         classCallCheck(this, _class);
         __cov_RqEld7XqE9cnBxJK2yK61g.f['3']++;__cov_RqEld7XqE9cnBxJK2yK61g.s['20']++;
         var _this = possibleConstructorReturn(this, _SuperClass.call(this));

         __cov_RqEld7XqE9cnBxJK2yK61g.s['21']++;var props = _this.properties;__cov_RqEld7XqE9cnBxJK2yK61g.s['22']++;if (props) {
            __cov_RqEld7XqE9cnBxJK2yK61g.b['9'][0]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['23']++;if (!isArray(props)) {
               __cov_RqEld7XqE9cnBxJK2yK61g.b['10'][0]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['24']++;props = [props];
            } else {
               __cov_RqEld7XqE9cnBxJK2yK61g.b['10'][1]++;
            }__cov_RqEld7XqE9cnBxJK2yK61g.s['25']++;props = props.reduce(function (res, partialProps) {
               __cov_RqEld7XqE9cnBxJK2yK61g.s['26']++;for (var k in partialProps) {
                  __cov_RqEld7XqE9cnBxJK2yK61g.s['27']++;res[k] = prop(partialProps[k]);
               }__cov_RqEld7XqE9cnBxJK2yK61g.s['28']++;return res;
            }, {});
         } else {
            __cov_RqEld7XqE9cnBxJK2yK61g.b['9'][1]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['29']++;props = {};
         }__cov_RqEld7XqE9cnBxJK2yK61g.s['30']++;Object.defineProperty(_this, 'properties', { value: props, writable: false, configurable: true });__cov_RqEld7XqE9cnBxJK2yK61g.s['31']++;var observed = (__cov_RqEld7XqE9cnBxJK2yK61g.b['11'][0]++, _this.constructor.observedAttributes) || (__cov_RqEld7XqE9cnBxJK2yK61g.b['11'][1]++, []);__cov_RqEld7XqE9cnBxJK2yK61g.s['32']++;
         var _loop = function _loop(k) {
            __cov_RqEld7XqE9cnBxJK2yK61g.s['33']++;var prop$$1 = props[k];__cov_RqEld7XqE9cnBxJK2yK61g.s['34']++;prop$$1.named(k).init(_this);__cov_RqEld7XqE9cnBxJK2yK61g.s['35']++;var attrName = prop$$1.attrName,
                eventName = prop$$1.eventName;
            __cov_RqEld7XqE9cnBxJK2yK61g.s['36']++;if ((__cov_RqEld7XqE9cnBxJK2yK61g.b['13'][0]++, !attrName) && (__cov_RqEld7XqE9cnBxJK2yK61g.b['13'][1]++, observed.indexOf(k) !== -1)) {
               __cov_RqEld7XqE9cnBxJK2yK61g.b['12'][0]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['37']++;prop$$1.attribute();__cov_RqEld7XqE9cnBxJK2yK61g.s['38']++;attrName = k;
            } else {
               __cov_RqEld7XqE9cnBxJK2yK61g.b['12'][1]++;
            }__cov_RqEld7XqE9cnBxJK2yK61g.s['39']++;if ((__cov_RqEld7XqE9cnBxJK2yK61g.b['15'][0]++, attrName) || (__cov_RqEld7XqE9cnBxJK2yK61g.b['15'][1]++, eventName)) {
               __cov_RqEld7XqE9cnBxJK2yK61g.b['14'][0]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['40']++;prop$$1.observe(function () {
                  __cov_RqEld7XqE9cnBxJK2yK61g.s['41']++;if (attrName) {
                     __cov_RqEld7XqE9cnBxJK2yK61g.b['16'][0]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['42']++;setAttribute$1(_this.node, attrName, _this[prop$$1.name]);
                  } else {
                     __cov_RqEld7XqE9cnBxJK2yK61g.b['16'][1]++;
                  }__cov_RqEld7XqE9cnBxJK2yK61g.s['43']++;if (eventName) {
                     __cov_RqEld7XqE9cnBxJK2yK61g.b['17'][0]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['44']++;dispatch$1(_this.node, eventName);
                  } else {
                     __cov_RqEld7XqE9cnBxJK2yK61g.b['17'][1]++;
                  }
               });
            } else {
               __cov_RqEld7XqE9cnBxJK2yK61g.b['14'][1]++;
            }
         };

         for (var k in props) {
            _loop(k);
         }return _this;
      }

      _class.prototype.connectedCallback = function connectedCallback() {
         __cov_RqEld7XqE9cnBxJK2yK61g.f['4']++;__cov_RqEld7XqE9cnBxJK2yK61g.s['45']++;_SuperClass.prototype.connectedCallback.call(this);__cov_RqEld7XqE9cnBxJK2yK61g.s['46']++;var props = this.properties;__cov_RqEld7XqE9cnBxJK2yK61g.s['47']++;for (var k in props) {
            __cov_RqEld7XqE9cnBxJK2yK61g.s['48']++;var _prop = props[k];__cov_RqEld7XqE9cnBxJK2yK61g.s['49']++;var _attrName = _prop.attrName;
            __cov_RqEld7XqE9cnBxJK2yK61g.s['50']++;if (_attrName) {
               __cov_RqEld7XqE9cnBxJK2yK61g.b['18'][0]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['51']++;if (isUndefined(this[_prop.name])) {
                  __cov_RqEld7XqE9cnBxJK2yK61g.b['19'][0]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['52']++;if (this.node.hasAttribute(_attrName)) {
                     __cov_RqEld7XqE9cnBxJK2yK61g.b['20'][0]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['53']++;this[_prop.name] = getValue(_prop, this.node.getAttribute(_attrName));
                  } else {
                     __cov_RqEld7XqE9cnBxJK2yK61g.b['20'][1]++;
                  }
               } else {
                  __cov_RqEld7XqE9cnBxJK2yK61g.b['19'][1]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['54']++;setAttribute$1(this.node, _attrName, this[_prop.name]);
               }
            } else {
               __cov_RqEld7XqE9cnBxJK2yK61g.b['18'][1]++;
            }
         }
      };

      _class.prototype.attributeChangedCallback = function attributeChangedCallback(attr, oldVal, newVal) {
         __cov_RqEld7XqE9cnBxJK2yK61g.f['5']++;__cov_RqEld7XqE9cnBxJK2yK61g.s['55']++;_SuperClass.prototype.attributeChangedCallback.call(this, attr, oldVal, newVal);__cov_RqEld7XqE9cnBxJK2yK61g.s['56']++;var props = this.properties;__cov_RqEld7XqE9cnBxJK2yK61g.s['57']++;for (var k in props) {
            __cov_RqEld7XqE9cnBxJK2yK61g.s['58']++;var _prop2 = props[k];__cov_RqEld7XqE9cnBxJK2yK61g.s['59']++;if (_prop2.attrName === attr) {
               __cov_RqEld7XqE9cnBxJK2yK61g.b['21'][0]++;__cov_RqEld7XqE9cnBxJK2yK61g.s['60']++;this[_prop2.name] = getValue(_prop2, newVal);__cov_RqEld7XqE9cnBxJK2yK61g.s['61']++;return;
            } else {
               __cov_RqEld7XqE9cnBxJK2yK61g.b['21'][1]++;
            }
         }
      };

      _class.prototype.observeProperty = function observeProperty(propName, callback) {
         __cov_RqEld7XqE9cnBxJK2yK61g.f['6']++;__cov_RqEld7XqE9cnBxJK2yK61g.s['62']++;return this.properties[propName].observe(callback);
      };

      _class.prototype.unobserveProperty = function unobserveProperty(propName, callback) {
         __cov_RqEld7XqE9cnBxJK2yK61g.f['7']++;__cov_RqEld7XqE9cnBxJK2yK61g.s['63']++;this.properties[propName].unobserve(callback);
      };

      return _class;
   }(SuperClass);
};

var ELEM_PROTO = Element.prototype;

var matches = ELEM_PROTO.matches || ELEM_PROTO.matchesSelector || ELEM_PROTO.mozMatchesSelector || ELEM_PROTO.msMatchesSelector || ELEM_PROTO.oMatchesSelector || ELEM_PROTO.webkitMatchesSelector;

var __cov_swrVLmMhjV7CPzIM4isVtw = Function('return this')();
if (!__cov_swrVLmMhjV7CPzIM4isVtw.__coverage__) {
   __cov_swrVLmMhjV7CPzIM4isVtw.__coverage__ = {};
}
__cov_swrVLmMhjV7CPzIM4isVtw = __cov_swrVLmMhjV7CPzIM4isVtw.__coverage__;
if (!__cov_swrVLmMhjV7CPzIM4isVtw['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/events-component.js']) {
   __cov_swrVLmMhjV7CPzIM4isVtw['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/events-component.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/events-component.js", "s": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21": 0, "22": 0, "23": 0 }, "b": { "1": [0, 0], "2": [0, 0], "3": [0, 0], "4": [0, 0], "5": [0, 0], "6": [0, 0], "7": [0, 0] }, "f": { "1": 0, "2": 0, "3": 0 }, "fnMap": { "1": { "name": "(anonymous_1)", "line": 48, "loc": { "start": { "line": 48, "column": 15 }, "end": { "line": 48, "column": 18 } } }, "2": { "name": "(anonymous_2)", "line": 82, "loc": { "start": { "line": 82, "column": 12 }, "end": { "line": 82, "column": 41 } } }, "3": { "name": "(anonymous_3)", "line": 105, "loc": { "start": { "line": 105, "column": 11 }, "end": { "line": 105, "column": 61 } } } }, "statementMap": { "1": { "start": { "line": 5, "column": 0 }, "end": { "line": 5, "column": 39 } }, "2": { "start": { "line": 41, "column": 7 }, "end": { "line": 108, "column": 2 } }, "3": { "start": { "line": 41, "column": 43 }, "end": { "line": 108, "column": 1 } }, "4": { "start": { "line": 49, "column": 8 }, "end": { "line": 49, "column": 16 } }, "5": { "start": { "line": 51, "column": 8 }, "end": { "line": 51, "column": 39 } }, "6": { "start": { "line": 52, "column": 8 }, "end": { "line": 70, "column": 9 } }, "7": { "start": { "line": 53, "column": 12 }, "end": { "line": 55, "column": 26 } }, "8": { "start": { "line": 56, "column": 12 }, "end": { "line": 69, "column": 13 } }, "9": { "start": { "line": 57, "column": 16 }, "end": { "line": 57, "column": 51 } }, "10": { "start": { "line": 58, "column": 16 }, "end": { "line": 58, "column": 37 } }, "11": { "start": { "line": 59, "column": 16 }, "end": { "line": 59, "column": 54 } }, "12": { "start": { "line": 60, "column": 16 }, "end": { "line": 66, "column": 17 } }, "13": { "start": { "line": 61, "column": 20 }, "end": { "line": 61, "column": 62 } }, "14": { "start": { "line": 63, "column": 20 }, "end": { "line": 65, "column": 23 } }, "15": { "start": { "line": 64, "column": 24 }, "end": { "line": 64, "column": 54 } }, "16": { "start": { "line": 68, "column": 16 }, "end": { "line": 68, "column": 67 } }, "17": { "start": { "line": 83, "column": 8 }, "end": { "line": 91, "column": 11 } }, "18": { "start": { "line": 84, "column": 12 }, "end": { "line": 84, "column": 38 } }, "19": { "start": { "line": 85, "column": 12 }, "end": { "line": 90, "column": 13 } }, "20": { "start": { "line": 86, "column": 16 }, "end": { "line": 88, "column": 17 } }, "21": { "start": { "line": 87, "column": 20 }, "end": { "line": 87, "column": 55 } }, "22": { "start": { "line": 89, "column": 16 }, "end": { "line": 89, "column": 43 } }, "23": { "start": { "line": 106, "column": 8 }, "end": { "line": 106, "column": 65 } } }, "branchMap": { "1": { "line": 51, "type": "binary-expr", "locations": [{ "start": { "line": 51, "column": 21 }, "end": { "line": 51, "column": 32 } }, { "start": { "line": 51, "column": 36 }, "end": { "line": 51, "column": 38 } }] }, "2": { "line": 53, "type": "cond-expr", "locations": [{ "start": { "line": 54, "column": 16 }, "end": { "line": 54, "column": 31 } }, { "start": { "line": 55, "column": 16 }, "end": { "line": 55, "column": 25 } }] }, "3": { "line": 56, "type": "if", "locations": [{ "start": { "line": 56, "column": 12 }, "end": { "line": 56, "column": 12 } }, { "start": { "line": 56, "column": 12 }, "end": { "line": 56, "column": 12 } }] }, "4": { "line": 59, "type": "binary-expr", "locations": [{ "start": { "line": 59, "column": 32 }, "end": { "line": 59, "column": 39 } }, { "start": { "line": 59, "column": 43 }, "end": { "line": 59, "column": 45 } }] }, "5": { "line": 60, "type": "if", "locations": [{ "start": { "line": 60, "column": 16 }, "end": { "line": 60, "column": 16 } }, { "start": { "line": 60, "column": 16 }, "end": { "line": 60, "column": 16 } }] }, "6": { "line": 85, "type": "binary-expr", "locations": [{ "start": { "line": 85, "column": 19 }, "end": { "line": 85, "column": 25 } }, { "start": { "line": 85, "column": 29 }, "end": { "line": 85, "column": 44 } }] }, "7": { "line": 86, "type": "if", "locations": [{ "start": { "line": 86, "column": 16 }, "end": { "line": 86, "column": 16 } }, { "start": { "line": 86, "column": 16 }, "end": { "line": 86, "column": 16 } }] } } };
}
__cov_swrVLmMhjV7CPzIM4isVtw = __cov_swrVLmMhjV7CPzIM4isVtw['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/events-component.js'];
__cov_swrVLmMhjV7CPzIM4isVtw.s['1']++;var SPLIT_SELECTOR = /([^\s]+)(.*)?/;__cov_swrVLmMhjV7CPzIM4isVtw.s['2']++;var EventsMixin = function EventsMixin(SuperClass) {
   __cov_swrVLmMhjV7CPzIM4isVtw.s['3']++;return function (_SuperClass) {
      inherits(_class, _SuperClass);

      function _class() {
         classCallCheck(this, _class);
         __cov_swrVLmMhjV7CPzIM4isVtw.f['1']++;__cov_swrVLmMhjV7CPzIM4isVtw.s['4']++;
         var _this = possibleConstructorReturn(this, _SuperClass.call(this));

         __cov_swrVLmMhjV7CPzIM4isVtw.s['5']++;var events = (__cov_swrVLmMhjV7CPzIM4isVtw.b['1'][0]++, _this.events) || (__cov_swrVLmMhjV7CPzIM4isVtw.b['1'][1]++, {});__cov_swrVLmMhjV7CPzIM4isVtw.s['6']++;
         var _loop = function _loop(k) {
            __cov_swrVLmMhjV7CPzIM4isVtw.s['7']++;var callback = isString(events[k]) ? (__cov_swrVLmMhjV7CPzIM4isVtw.b['2'][0]++, _this[events[k]]) : (__cov_swrVLmMhjV7CPzIM4isVtw.b['2'][1]++, events[k]);__cov_swrVLmMhjV7CPzIM4isVtw.s['8']++;if (isFunction(callback)) {
               __cov_swrVLmMhjV7CPzIM4isVtw.b['3'][0]++;__cov_swrVLmMhjV7CPzIM4isVtw.s['9']++;var rule = k.match(SPLIT_SELECTOR);__cov_swrVLmMhjV7CPzIM4isVtw.s['10']++;var evName = rule[1];__cov_swrVLmMhjV7CPzIM4isVtw.s['11']++;var selector = ((__cov_swrVLmMhjV7CPzIM4isVtw.b['4'][0]++, rule[2]) || (__cov_swrVLmMhjV7CPzIM4isVtw.b['4'][1]++, '')).trim();__cov_swrVLmMhjV7CPzIM4isVtw.s['12']++;if (selector) {
                  __cov_swrVLmMhjV7CPzIM4isVtw.b['5'][0]++;__cov_swrVLmMhjV7CPzIM4isVtw.s['13']++;_this.delegate(evName, selector, callback);
               } else {
                  __cov_swrVLmMhjV7CPzIM4isVtw.b['5'][1]++;__cov_swrVLmMhjV7CPzIM4isVtw.s['14']++;_this.node.addEventListener(evName, function (ev) {
                     __cov_swrVLmMhjV7CPzIM4isVtw.s['15']++;callback.call(_this, ev, _this);
                  });
               }
            } else {
               __cov_swrVLmMhjV7CPzIM4isVtw.b['3'][1]++;__cov_swrVLmMhjV7CPzIM4isVtw.s['16']++;throw new TypeError('Invalid callback for event.');
            }
         };

         for (var k in events) {
            _loop(k);
         }return _this;
      }

      _class.prototype.delegate = function delegate(evName, selector, callback) {
         var _this2 = this;

         __cov_swrVLmMhjV7CPzIM4isVtw.f['2']++;__cov_swrVLmMhjV7CPzIM4isVtw.s['17']++;this.node.addEventListener(evName, function (event) {
            __cov_swrVLmMhjV7CPzIM4isVtw.s['18']++;var target = event.target;__cov_swrVLmMhjV7CPzIM4isVtw.s['19']++;while ((__cov_swrVLmMhjV7CPzIM4isVtw.b['6'][0]++, target) && (__cov_swrVLmMhjV7CPzIM4isVtw.b['6'][1]++, target !== _this2)) {
               __cov_swrVLmMhjV7CPzIM4isVtw.s['20']++;if (matches.call(target, selector)) {
                  __cov_swrVLmMhjV7CPzIM4isVtw.b['7'][0]++;__cov_swrVLmMhjV7CPzIM4isVtw.s['21']++;callback.call(_this2, event, target);
               } else {
                  __cov_swrVLmMhjV7CPzIM4isVtw.b['7'][1]++;
               }__cov_swrVLmMhjV7CPzIM4isVtw.s['22']++;target = target.parentNode;
            }
         });
      };

      _class.prototype.trigger = function trigger(evName, data) {
         var bubbles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
         var cancelable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
         __cov_swrVLmMhjV7CPzIM4isVtw.f['3']++;__cov_swrVLmMhjV7CPzIM4isVtw.s['23']++;return dispatch$1(this, evName, data, bubbles, cancelable);
      };

      return _class;
   }(SuperClass);
};

var __cov_hFqoAXE0moe_frm2RX09Yg = Function('return this')();
if (!__cov_hFqoAXE0moe_frm2RX09Yg.__coverage__) {
   __cov_hFqoAXE0moe_frm2RX09Yg.__coverage__ = {};
}
__cov_hFqoAXE0moe_frm2RX09Yg = __cov_hFqoAXE0moe_frm2RX09Yg.__coverage__;
if (!__cov_hFqoAXE0moe_frm2RX09Yg['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/style.js']) {
   __cov_hFqoAXE0moe_frm2RX09Yg['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/style.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/style.js", "s": { "1": 0, "2": 1, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0 }, "b": { "1": [0, 0], "2": [0, 0] }, "f": { "1": 0 }, "fnMap": { "1": { "name": "createStyle", "line": 9, "loc": { "start": { "line": 9, "column": 7 }, "end": { "line": 9, "column": 34 } } } }, "statementMap": { "1": { "start": { "line": 1, "column": 0 }, "end": { "line": 1, "column": 25 } }, "2": { "start": { "line": 9, "column": 7 }, "end": { "line": 22, "column": 1 } }, "3": { "start": { "line": 10, "column": 4 }, "end": { "line": 10, "column": 44 } }, "4": { "start": { "line": 11, "column": 4 }, "end": { "line": 11, "column": 47 } }, "5": { "start": { "line": 12, "column": 4 }, "end": { "line": 12, "column": 32 } }, "6": { "start": { "line": 13, "column": 4 }, "end": { "line": 13, "column": 53 } }, "7": { "start": { "line": 14, "column": 4 }, "end": { "line": 14, "column": 24 } }, "8": { "start": { "line": 16, "column": 4 }, "end": { "line": 20, "column": 5 } }, "9": { "start": { "line": 17, "column": 8 }, "end": { "line": 17, "column": 61 } }, "10": { "start": { "line": 19, "column": 8 }, "end": { "line": 19, "column": 36 }, "skip": true }, "11": { "start": { "line": 21, "column": 4 }, "end": { "line": 21, "column": 21 } } }, "branchMap": { "1": { "line": 10, "type": "binary-expr", "locations": [{ "start": { "line": 10, "column": 14 }, "end": { "line": 10, "column": 32 } }, { "start": { "line": 10, "column": 36 }, "end": { "line": 10, "column": 43 } }] }, "2": { "line": 16, "type": "if", "locations": [{ "start": { "line": 16, "column": 4 }, "end": { "line": 16, "column": 4 } }, { "start": { "line": 16, "column": 4 }, "end": { "line": 16, "column": 4 }, "skip": true }] } } };
}
__cov_hFqoAXE0moe_frm2RX09Yg = __cov_hFqoAXE0moe_frm2RX09Yg['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/style.js'];
__cov_hFqoAXE0moe_frm2RX09Yg.s['1']++;var rootDoc = document;function createStyle(node) {
   __cov_hFqoAXE0moe_frm2RX09Yg.f['1']++;__cov_hFqoAXE0moe_frm2RX09Yg.s['3']++;var doc = (__cov_hFqoAXE0moe_frm2RX09Yg.b['1'][0]++, node.ownerDocument) || (__cov_hFqoAXE0moe_frm2RX09Yg.b['1'][1]++, rootDoc);__cov_hFqoAXE0moe_frm2RX09Yg.s['4']++;var styleElem = doc.createElement('style');__cov_hFqoAXE0moe_frm2RX09Yg.s['5']++;styleElem.type = 'text/css';__cov_hFqoAXE0moe_frm2RX09Yg.s['6']++;styleElem.setAttribute('id', 'style-' + node.is);__cov_hFqoAXE0moe_frm2RX09Yg.s['7']++;var head = doc.head;__cov_hFqoAXE0moe_frm2RX09Yg.s['8']++;if (head.firstElementChild) {
      __cov_hFqoAXE0moe_frm2RX09Yg.b['2'][0]++;__cov_hFqoAXE0moe_frm2RX09Yg.s['9']++;head.insertBefore(styleElem, head.firstElementChild);
   } else {
      __cov_hFqoAXE0moe_frm2RX09Yg.b['2'][1]++;__cov_hFqoAXE0moe_frm2RX09Yg.s['10']++;head.appendChild(styleElem);
   }__cov_hFqoAXE0moe_frm2RX09Yg.s['11']++;return styleElem;
}

var __cov_TbMKAS2MdZJQqHnZjDdR5A = Function('return this')();
if (!__cov_TbMKAS2MdZJQqHnZjDdR5A.__coverage__) {
   __cov_TbMKAS2MdZJQqHnZjDdR5A.__coverage__ = {};
}
__cov_TbMKAS2MdZJQqHnZjDdR5A = __cov_TbMKAS2MdZJQqHnZjDdR5A.__coverage__;
if (!__cov_TbMKAS2MdZJQqHnZjDdR5A['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/style-component.js']) {
   __cov_TbMKAS2MdZJQqHnZjDdR5A['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/style-component.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/style-component.js", "s": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0 }, "b": { "1": [0, 0], "2": [0, 0] }, "f": { "1": 0, "2": 0, "3": 0 }, "fnMap": { "1": { "name": "(anonymous_1)", "line": 35, "loc": { "start": { "line": 35, "column": 15 }, "end": { "line": 35, "column": 18 } } }, "2": { "name": "(anonymous_2)", "line": 46, "loc": { "start": { "line": 46, "column": 21 }, "end": { "line": 46, "column": 24 } } }, "3": { "name": "(anonymous_3)", "line": 51, "loc": { "start": { "line": 51, "column": 13 }, "end": { "line": 51, "column": 16 } } } }, "statementMap": { "1": { "start": { "line": 31, "column": 7 }, "end": { "line": 57, "column": 2 } }, "2": { "start": { "line": 31, "column": 42 }, "end": { "line": 57, "column": 1 } }, "3": { "start": { "line": 36, "column": 8 }, "end": { "line": 36, "column": 16 } }, "4": { "start": { "line": 37, "column": 8 }, "end": { "line": 42, "column": 9 } }, "5": { "start": { "line": 38, "column": 12 }, "end": { "line": 38, "column": 39 } }, "6": { "start": { "line": 39, "column": 12 }, "end": { "line": 41, "column": 15 } }, "7": { "start": { "line": 43, "column": 8 }, "end": { "line": 43, "column": 25 } }, "8": { "start": { "line": 47, "column": 8 }, "end": { "line": 47, "column": 34 } }, "9": { "start": { "line": 48, "column": 8 }, "end": { "line": 48, "column": 41 } }, "10": { "start": { "line": 52, "column": 8 }, "end": { "line": 52, "column": 29 } }, "11": { "start": { "line": 53, "column": 8 }, "end": { "line": 55, "column": 9 } }, "12": { "start": { "line": 54, "column": 12 }, "end": { "line": 54, "column": 59 } } }, "branchMap": { "1": { "line": 37, "type": "if", "locations": [{ "start": { "line": 37, "column": 8 }, "end": { "line": 37, "column": 8 } }, { "start": { "line": 37, "column": 8 }, "end": { "line": 37, "column": 8 } }] }, "2": { "line": 53, "type": "if", "locations": [{ "start": { "line": 53, "column": 8 }, "end": { "line": 53, "column": 8 } }, { "start": { "line": 53, "column": 8 }, "end": { "line": 53, "column": 8 } }] } } };
}
__cov_TbMKAS2MdZJQqHnZjDdR5A = __cov_TbMKAS2MdZJQqHnZjDdR5A['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/style-component.js'];
__cov_TbMKAS2MdZJQqHnZjDdR5A.s['1']++;var StyleMixin = function StyleMixin(SuperClass) {
   __cov_TbMKAS2MdZJQqHnZjDdR5A.s['2']++;return function (_SuperClass) {
      inherits(_class, _SuperClass);

      function _class() {
         classCallCheck(this, _class);
         __cov_TbMKAS2MdZJQqHnZjDdR5A.f['1']++;__cov_TbMKAS2MdZJQqHnZjDdR5A.s['3']++;
         var _this = possibleConstructorReturn(this, _SuperClass.call(this));

         __cov_TbMKAS2MdZJQqHnZjDdR5A.s['4']++;if (!_this.constructor.styleElem) {
            __cov_TbMKAS2MdZJQqHnZjDdR5A.b['1'][0]++;__cov_TbMKAS2MdZJQqHnZjDdR5A.s['5']++;var Ctr = _this.constructor;__cov_TbMKAS2MdZJQqHnZjDdR5A.s['6']++;Object.defineProperty(Ctr, 'styleElem', { value: createStyle(_this) });
         } else {
            __cov_TbMKAS2MdZJQqHnZjDdR5A.b['1'][1]++;
         }__cov_TbMKAS2MdZJQqHnZjDdR5A.s['7']++;_this.updateCSS();return _this;
      }

      _class.prototype.connectedCallback = function connectedCallback() {
         __cov_TbMKAS2MdZJQqHnZjDdR5A.f['2']++;__cov_TbMKAS2MdZJQqHnZjDdR5A.s['8']++;_SuperClass.prototype.connectedCallback.call(this);__cov_TbMKAS2MdZJQqHnZjDdR5A.s['9']++;this.node.classList.add(this.is);
      };

      _class.prototype.updateCSS = function updateCSS() {
         __cov_TbMKAS2MdZJQqHnZjDdR5A.f['3']++;__cov_TbMKAS2MdZJQqHnZjDdR5A.s['10']++;var style = this.css;__cov_TbMKAS2MdZJQqHnZjDdR5A.s['11']++;if (isString(style)) {
            __cov_TbMKAS2MdZJQqHnZjDdR5A.b['2'][0]++;__cov_TbMKAS2MdZJQqHnZjDdR5A.s['12']++;this.constructor.styleElem.textContent = style;
         } else {
            __cov_TbMKAS2MdZJQqHnZjDdR5A.b['2'][1]++;
         }
      };

      return _class;
   }(SuperClass);
};

var __cov_V_1BYT6sRLWyioBin8S1Fg = Function('return this')();
if (!__cov_V_1BYT6sRLWyioBin8S1Fg.__coverage__) {
   __cov_V_1BYT6sRLWyioBin8S1Fg.__coverage__ = {};
}
__cov_V_1BYT6sRLWyioBin8S1Fg = __cov_V_1BYT6sRLWyioBin8S1Fg.__coverage__;
if (!__cov_V_1BYT6sRLWyioBin8S1Fg['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/template-component.js']) {
   __cov_V_1BYT6sRLWyioBin8S1Fg['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/template-component.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/template-component.js", "s": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0 }, "b": { "1": [0, 0], "2": [0, 0], "3": [0, 0], "4": [0, 0], "5": [0, 0], "6": [0, 0], "7": [0, 0] }, "f": { "1": 0, "2": 0, "3": 0, "4": 0 }, "fnMap": { "1": { "name": "(anonymous_1)", "line": 42, "loc": { "start": { "line": 42, "column": 18 }, "end": { "line": 42, "column": 21 } } }, "2": { "name": "(anonymous_2)", "line": 51, "loc": { "start": { "line": 51, "column": 15 }, "end": { "line": 51, "column": 18 } } }, "3": { "name": "(anonymous_3)", "line": 71, "loc": { "start": { "line": 71, "column": 21 }, "end": { "line": 71, "column": 24 } } }, "4": { "name": "(anonymous_4)", "line": 87, "loc": { "start": { "line": 87, "column": 10 }, "end": { "line": 87, "column": 16 } } } }, "statementMap": { "1": { "start": { "line": 34, "column": 7 }, "end": { "line": 97, "column": 2 } }, "2": { "start": { "line": 34, "column": 45 }, "end": { "line": 97, "column": 1 } }, "3": { "start": { "line": 43, "column": 8 }, "end": { "line": 43, "column": 20 } }, "4": { "start": { "line": 52, "column": 8 }, "end": { "line": 52, "column": 16 } }, "5": { "start": { "line": 53, "column": 8 }, "end": { "line": 63, "column": 9 } }, "6": { "start": { "line": 54, "column": 12 }, "end": { "line": 54, "column": 40 } }, "7": { "start": { "line": 55, "column": 12 }, "end": { "line": 62, "column": 13 } }, "8": { "start": { "line": 56, "column": 16 }, "end": { "line": 58, "column": 18 } }, "9": { "start": { "line": 57, "column": 20 }, "end": { "line": 57, "column": 34 } }, "10": { "start": { "line": 59, "column": 16 }, "end": { "line": 61, "column": 17 } }, "11": { "start": { "line": 60, "column": 20 }, "end": { "line": 60, "column": 47 } }, "12": { "start": { "line": 72, "column": 8 }, "end": { "line": 72, "column": 34 } }, "13": { "start": { "line": 73, "column": 8 }, "end": { "line": 75, "column": 9 } }, "14": { "start": { "line": 74, "column": 12 }, "end": { "line": 74, "column": 26 } }, "15": { "start": { "line": 88, "column": 8 }, "end": { "line": 88, "column": 35 } }, "16": { "start": { "line": 89, "column": 8 }, "end": { "line": 95, "column": 9 } }, "17": { "start": { "line": 90, "column": 12 }, "end": { "line": 90, "column": 27 } }, "18": { "start": { "line": 91, "column": 15 }, "end": { "line": 95, "column": 9 } }, "19": { "start": { "line": 92, "column": 12 }, "end": { "line": 92, "column": 38 } }, "20": { "start": { "line": 94, "column": 12 }, "end": { "line": 94, "column": 62 } } }, "branchMap": { "1": { "line": 53, "type": "if", "locations": [{ "start": { "line": 53, "column": 8 }, "end": { "line": 53, "column": 8 } }, { "start": { "line": 53, "column": 8 }, "end": { "line": 53, "column": 8 } }] }, "2": { "line": 53, "type": "binary-expr", "locations": [{ "start": { "line": 53, "column": 12 }, "end": { "line": 53, "column": 27 } }, { "start": { "line": 53, "column": 31 }, "end": { "line": 53, "column": 58 } }] }, "3": { "line": 55, "type": "if", "locations": [{ "start": { "line": 55, "column": 12 }, "end": { "line": 55, "column": 12 } }, { "start": { "line": 55, "column": 12 }, "end": { "line": 55, "column": 12 } }] }, "4": { "line": 73, "type": "if", "locations": [{ "start": { "line": 73, "column": 8 }, "end": { "line": 73, "column": 8 } }, { "start": { "line": 73, "column": 8 }, "end": { "line": 73, "column": 8 } }] }, "5": { "line": 88, "type": "binary-expr", "locations": [{ "start": { "line": 88, "column": 14 }, "end": { "line": 88, "column": 17 } }, { "start": { "line": 88, "column": 21 }, "end": { "line": 88, "column": 34 } }] }, "6": { "line": 89, "type": "if", "locations": [{ "start": { "line": 89, "column": 8 }, "end": { "line": 89, "column": 8 } }, { "start": { "line": 89, "column": 8 }, "end": { "line": 89, "column": 8 } }] }, "7": { "line": 91, "type": "if", "locations": [{ "start": { "line": 91, "column": 15 }, "end": { "line": 91, "column": 15 } }, { "start": { "line": 91, "column": 15 }, "end": { "line": 91, "column": 15 } }] } } };
}
__cov_V_1BYT6sRLWyioBin8S1Fg = __cov_V_1BYT6sRLWyioBin8S1Fg['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/mixins/template-component.js'];
__cov_V_1BYT6sRLWyioBin8S1Fg.s['1']++;var TemplateMixin = function TemplateMixin(SuperClass) {
   __cov_V_1BYT6sRLWyioBin8S1Fg.s['2']++;return function (_SuperClass) {
      inherits(_class, _SuperClass);
      createClass(_class, [{
         key: 'autoRender',
         get: function get() {
            __cov_V_1BYT6sRLWyioBin8S1Fg.f['1']++;__cov_V_1BYT6sRLWyioBin8S1Fg.s['3']++;return true;
         }
      }]);

      function _class() {
         classCallCheck(this, _class);
         __cov_V_1BYT6sRLWyioBin8S1Fg.f['2']++;__cov_V_1BYT6sRLWyioBin8S1Fg.s['4']++;
         var _this = possibleConstructorReturn(this, _SuperClass.call(this));

         __cov_V_1BYT6sRLWyioBin8S1Fg.s['5']++;if ((__cov_V_1BYT6sRLWyioBin8S1Fg.b['2'][0]++, _this.autoRender) && (__cov_V_1BYT6sRLWyioBin8S1Fg.b['2'][1]++, !isUndefined(_this.template))) {
            __cov_V_1BYT6sRLWyioBin8S1Fg.b['1'][0]++;__cov_V_1BYT6sRLWyioBin8S1Fg.s['6']++;var props = _this.properties;__cov_V_1BYT6sRLWyioBin8S1Fg.s['7']++;if (props) {
               __cov_V_1BYT6sRLWyioBin8S1Fg.b['3'][0]++;__cov_V_1BYT6sRLWyioBin8S1Fg.s['8']++;var callback = function callback() {
                  __cov_V_1BYT6sRLWyioBin8S1Fg.s['9']++;_this.render();
               };__cov_V_1BYT6sRLWyioBin8S1Fg.s['10']++;for (var k in props) {
                  __cov_V_1BYT6sRLWyioBin8S1Fg.s['11']++;props[k].observe(callback);
               }
            } else {
               __cov_V_1BYT6sRLWyioBin8S1Fg.b['3'][1]++;
            }
         } else {
            __cov_V_1BYT6sRLWyioBin8S1Fg.b['1'][1]++;
         }return _this;
      }

      _class.prototype.connectedCallback = function connectedCallback() {
         __cov_V_1BYT6sRLWyioBin8S1Fg.f['3']++;__cov_V_1BYT6sRLWyioBin8S1Fg.s['12']++;_SuperClass.prototype.connectedCallback.call(this);__cov_V_1BYT6sRLWyioBin8S1Fg.s['13']++;if (!isUndefined(this.template)) {
            __cov_V_1BYT6sRLWyioBin8S1Fg.b['4'][0]++;__cov_V_1BYT6sRLWyioBin8S1Fg.s['14']++;this.render();
         } else {
            __cov_V_1BYT6sRLWyioBin8S1Fg.b['4'][1]++;
         }
      };

      _class.prototype.render = function render(tpl) {
         __cov_V_1BYT6sRLWyioBin8S1Fg.f['4']++;__cov_V_1BYT6sRLWyioBin8S1Fg.s['15']++;tpl = (__cov_V_1BYT6sRLWyioBin8S1Fg.b['5'][0]++, tpl) || (__cov_V_1BYT6sRLWyioBin8S1Fg.b['5'][1]++, this.template);__cov_V_1BYT6sRLWyioBin8S1Fg.s['16']++;if (isFunction(tpl)) {
            __cov_V_1BYT6sRLWyioBin8S1Fg.b['6'][0]++;__cov_V_1BYT6sRLWyioBin8S1Fg.s['17']++;tpl.call(this);
         } else {
            __cov_V_1BYT6sRLWyioBin8S1Fg.b['6'][1]++;__cov_V_1BYT6sRLWyioBin8S1Fg.s['18']++;if (isString(tpl)) {
               __cov_V_1BYT6sRLWyioBin8S1Fg.b['7'][0]++;__cov_V_1BYT6sRLWyioBin8S1Fg.s['19']++;this.node.innerHTML = tpl;
            } else {
               __cov_V_1BYT6sRLWyioBin8S1Fg.b['7'][1]++;__cov_V_1BYT6sRLWyioBin8S1Fg.s['20']++;throw new TypeError('Invalid template property.');
            }
         }
      };

      return _class;
   }(SuperClass);
};

/* eslint-disable prefer-rest-params */
var reduce = Array.prototype.reduce || function (callback /*, initialValue*/) {
    'use strict';

    var t = this;
    var len = t.length;
    var k = 0;
    var value = void 0;
    if (arguments.length === 2) {
        value = arguments[1];
    } else {
        while (k < len && !(k in t)) {
            k++;
        }
        value = t[k++];
    }
    for (; k < len; k++) {
        if (k in t) {
            value = callback(value, t[k], k, t);
        }
    }
    return value;
};

var __cov_KLI2k$ZIpZPlQ9GrNck6TQ = Function('return this')();
if (!__cov_KLI2k$ZIpZPlQ9GrNck6TQ.__coverage__) {
   __cov_KLI2k$ZIpZPlQ9GrNck6TQ.__coverage__ = {};
}
__cov_KLI2k$ZIpZPlQ9GrNck6TQ = __cov_KLI2k$ZIpZPlQ9GrNck6TQ.__coverage__;
if (!__cov_KLI2k$ZIpZPlQ9GrNck6TQ['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/mixins.js']) {
   __cov_KLI2k$ZIpZPlQ9GrNck6TQ['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/mixins.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/mixins.js", "s": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0 }, "b": { "1": [0, 0] }, "f": { "1": 0, "2": 0 }, "fnMap": { "1": { "name": "(anonymous_1)", "line": 54, "loc": { "start": { "line": 54, "column": 15 }, "end": { "line": 54, "column": 28 } } }, "2": { "name": "(anonymous_2)", "line": 63, "loc": { "start": { "line": 63, "column": 8 }, "end": { "line": 63, "column": 11 } } } }, "statementMap": { "1": { "start": { "line": 55, "column": 8 }, "end": { "line": 55, "column": 44 } }, "2": { "start": { "line": 56, "column": 8 }, "end": { "line": 56, "column": 37 } }, "3": { "start": { "line": 65, "column": 8 }, "end": { "line": 65, "column": 47 } }, "4": { "start": { "line": 66, "column": 8 }, "end": { "line": 66, "column": 74 } }, "5": { "start": { "line": 66, "column": 47 }, "end": { "line": 66, "column": 55 } }, "6": { "start": { "line": 74, "column": 7 }, "end": { "line": 74, "column": 57 } }, "7": { "start": { "line": 74, "column": 35 }, "end": { "line": 74, "column": 56 } } }, "branchMap": { "1": { "line": 55, "type": "binary-expr", "locations": [{ "start": { "line": 55, "column": 21 }, "end": { "line": 55, "column": 31 } }, { "start": { "line": 55, "column": 35 }, "end": { "line": 55, "column": 43 } }] } } };
}
__cov_KLI2k$ZIpZPlQ9GrNck6TQ = __cov_KLI2k$ZIpZPlQ9GrNck6TQ['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/mixins.js'];
var Mixin = function () {
   function Mixin(superclass) {
      classCallCheck(this, Mixin);
      __cov_KLI2k$ZIpZPlQ9GrNck6TQ.f['1']++;__cov_KLI2k$ZIpZPlQ9GrNck6TQ.s['1']++;superclass = (__cov_KLI2k$ZIpZPlQ9GrNck6TQ.b['1'][0]++, superclass) || (__cov_KLI2k$ZIpZPlQ9GrNck6TQ.b['1'][1]++, function () {
         function _class() {
            classCallCheck(this, _class);
         }

         return _class;
      }());__cov_KLI2k$ZIpZPlQ9GrNck6TQ.s['2']++;this.superclass = superclass;
   }

   Mixin.prototype.with = function _with() {
      __cov_KLI2k$ZIpZPlQ9GrNck6TQ.f['2']++;__cov_KLI2k$ZIpZPlQ9GrNck6TQ.s['3']++;var args = [].slice.call(arguments, 0);__cov_KLI2k$ZIpZPlQ9GrNck6TQ.s['4']++;return reduce.call(args, function (c, mixin) {
         __cov_KLI2k$ZIpZPlQ9GrNck6TQ.s['5']++;return mixin(c);
      }, this.superclass);
   };

   return Mixin;
}();

__cov_KLI2k$ZIpZPlQ9GrNck6TQ.s['6']++;var mix = function mix(superClass) {
   __cov_KLI2k$ZIpZPlQ9GrNck6TQ.s['7']++;return new Mixin(superClass);
};

var __cov_2le7Se0aW5NcAppuZRvYLQ = Function('return this')();
if (!__cov_2le7Se0aW5NcAppuZRvYLQ.__coverage__) {
   __cov_2le7Se0aW5NcAppuZRvYLQ.__coverage__ = {};
}
__cov_2le7Se0aW5NcAppuZRvYLQ = __cov_2le7Se0aW5NcAppuZRvYLQ.__coverage__;
if (!__cov_2le7Se0aW5NcAppuZRvYLQ['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/shim.js']) {
   __cov_2le7Se0aW5NcAppuZRvYLQ['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/shim.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/shim.js", "s": { "1": 1, "2": 0, "3": 0, "4": 0, "5": 1, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0 }, "b": { "1": [0, 0], "2": [0, 0], "3": [0, 0] }, "f": { "1": 0, "2": 0, "3": 0 }, "fnMap": { "1": { "name": "isNew", "line": 10, "loc": { "start": { "line": 10, "column": 0 }, "end": { "line": 10, "column": 21 } } }, "2": { "name": "shim", "line": 39, "loc": { "start": { "line": 39, "column": 7 }, "end": { "line": 39, "column": 31 } } }, "3": { "name": "(anonymous_3)", "line": 41, "loc": { "start": { "line": 41, "column": 19 }, "end": { "line": 41, "column": 22 } } } }, "statementMap": { "1": { "start": { "line": 10, "column": 0 }, "end": { "line": 16, "column": 1 } }, "2": { "start": { "line": 11, "column": 4 }, "end": { "line": 15, "column": 5 } }, "3": { "start": { "line": 12, "column": 8 }, "end": { "line": 12, "column": 41 } }, "4": { "start": { "line": 14, "column": 8 }, "end": { "line": 14, "column": 20 } }, "5": { "start": { "line": 39, "column": 7 }, "end": { "line": 67, "column": 1 } }, "6": { "start": { "line": 42, "column": 12 }, "end": { "line": 44, "column": 13 } }, "7": { "start": { "line": 43, "column": 16 }, "end": { "line": 43, "column": 28 } }, "8": { "start": { "line": 45, "column": 12 }, "end": { "line": 45, "column": 64 } }, "9": { "start": { "line": 46, "column": 12 }, "end": { "line": 46, "column": 37 } }, "10": { "start": { "line": 48, "column": 12 }, "end": { "line": 50, "column": 14 } }, "11": { "start": { "line": 51, "column": 12 }, "end": { "line": 51, "column": 51 } }, "12": { "start": { "line": 52, "column": 12 }, "end": { "line": 54, "column": 13 } }, "13": { "start": { "line": 53, "column": 16 }, "end": { "line": 53, "column": 52 } }, "14": { "start": { "line": 55, "column": 12 }, "end": { "line": 55, "column": 27 } }, "15": { "start": { "line": 59, "column": 4 }, "end": { "line": 65, "column": 7 } }, "16": { "start": { "line": 66, "column": 4 }, "end": { "line": 66, "column": 22 } } }, "branchMap": { "1": { "line": 42, "type": "if", "locations": [{ "start": { "line": 42, "column": 12 }, "end": { "line": 42, "column": 12 } }, { "start": { "line": 42, "column": 12 }, "end": { "line": 42, "column": 12 } }] }, "2": { "line": 49, "type": "cond-expr", "locations": [{ "start": { "line": 49, "column": 33 }, "end": { "line": 49, "column": 47 } }, { "start": { "line": 49, "column": 50 }, "end": { "line": 49, "column": 57 } }] }, "3": { "line": 52, "type": "if", "locations": [{ "start": { "line": 52, "column": 12 }, "end": { "line": 52, "column": 12 } }, { "start": { "line": 52, "column": 12 }, "end": { "line": 52, "column": 12 } }] } } };
}
__cov_2le7Se0aW5NcAppuZRvYLQ = __cov_2le7Se0aW5NcAppuZRvYLQ['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/lib/shim.js'];
function isNew(node) {
   __cov_2le7Se0aW5NcAppuZRvYLQ.f['1']++;__cov_2le7Se0aW5NcAppuZRvYLQ.s['2']++;try {
      __cov_2le7Se0aW5NcAppuZRvYLQ.s['3']++;return !isString(node.outerHTML);
   } catch (ex) {
      __cov_2le7Se0aW5NcAppuZRvYLQ.s['4']++;return true;
   }
}function shim(Original) {
   __cov_2le7Se0aW5NcAppuZRvYLQ.f['2']++;
   var Polyfilled = function Polyfilled() {
      classCallCheck(this, Polyfilled);
      __cov_2le7Se0aW5NcAppuZRvYLQ.f['3']++;__cov_2le7Se0aW5NcAppuZRvYLQ.s['6']++;if (!isNew(this)) {
         __cov_2le7Se0aW5NcAppuZRvYLQ.b['1'][0]++;__cov_2le7Se0aW5NcAppuZRvYLQ.s['7']++;return this;
      } else {
         __cov_2le7Se0aW5NcAppuZRvYLQ.b['1'][1]++;
      }__cov_2le7Se0aW5NcAppuZRvYLQ.s['8']++;var desc = registry.getDescriptor(this.constructor);__cov_2le7Se0aW5NcAppuZRvYLQ.s['9']++;var config = desc.config;__cov_2le7Se0aW5NcAppuZRvYLQ.s['10']++;var element = document.createElement(config.extends ? (__cov_2le7Se0aW5NcAppuZRvYLQ.b['2'][0]++, config.extends) : (__cov_2le7Se0aW5NcAppuZRvYLQ.b['2'][1]++, desc.is));__cov_2le7Se0aW5NcAppuZRvYLQ.s['11']++;element.__proto__ = desc.Ctr.prototype;__cov_2le7Se0aW5NcAppuZRvYLQ.s['12']++;if (config.extends) {
         __cov_2le7Se0aW5NcAppuZRvYLQ.b['3'][0]++;__cov_2le7Se0aW5NcAppuZRvYLQ.s['13']++;element.setAttribute('is', desc.is);
      } else {
         __cov_2le7Se0aW5NcAppuZRvYLQ.b['3'][1]++;
      }__cov_2le7Se0aW5NcAppuZRvYLQ.s['14']++;return element;
   };

   __cov_2le7Se0aW5NcAppuZRvYLQ.s['15']++;Polyfilled.prototype = Object.create(Original.prototype, { constructor: { value: Polyfilled, configurable: true, writable: true } });__cov_2le7Se0aW5NcAppuZRvYLQ.s['16']++;return Polyfilled;
}

var __cov_wPUCs_0tBXbtcPvAnUFc8Q = Function('return this')();
if (!__cov_wPUCs_0tBXbtcPvAnUFc8Q.__coverage__) {
   __cov_wPUCs_0tBXbtcPvAnUFc8Q.__coverage__ = {};
}
__cov_wPUCs_0tBXbtcPvAnUFc8Q = __cov_wPUCs_0tBXbtcPvAnUFc8Q.__coverage__;
if (!__cov_wPUCs_0tBXbtcPvAnUFc8Q['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/core.js']) {
   __cov_wPUCs_0tBXbtcPvAnUFc8Q['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/core.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/core.js", "s": { "1": 0, "2": 0 }, "b": {}, "f": {}, "fnMap": {}, "statementMap": { "1": { "start": { "line": 16, "column": 7 }, "end": { "line": 16, "column": 31 } }, "2": { "start": { "line": 24, "column": 7 }, "end": { "line": 30, "column": 2 } } }, "branchMap": {} };
}
__cov_wPUCs_0tBXbtcPvAnUFc8Q = __cov_wPUCs_0tBXbtcPvAnUFc8Q['/Users/edoardo/Development/dna/dna-components/packages/dna-core/src/core.js'];
__cov_wPUCs_0tBXbtcPvAnUFc8Q.s['1']++;var DOM = DOM_HELPERS;__cov_wPUCs_0tBXbtcPvAnUFc8Q.s['2']++;var MIXINS = { ComponentMixin: ComponentMixin, PropertiesMixin: PropertiesMixin, EventsMixin: EventsMixin, StyleMixin: StyleMixin, TemplateMixin: TemplateMixin };

var __cov_H_SvvlkyAFJH6Pua8JR_Ig = Function('return this')();
if (!__cov_H_SvvlkyAFJH6Pua8JR_Ig.__coverage__) {
   __cov_H_SvvlkyAFJH6Pua8JR_Ig.__coverage__ = {};
}
__cov_H_SvvlkyAFJH6Pua8JR_Ig = __cov_H_SvvlkyAFJH6Pua8JR_Ig.__coverage__;
if (!__cov_H_SvvlkyAFJH6Pua8JR_Ig['/Users/edoardo/Development/dna/dna-components/packages/dna-core/index.js']) {
   __cov_H_SvvlkyAFJH6Pua8JR_Ig['/Users/edoardo/Development/dna/dna-components/packages/dna-core/index.js'] = { "path": "/Users/edoardo/Development/dna/dna-components/packages/dna-core/index.js", "s": { "1": 1, "2": 0, "3": 1, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0 }, "b": {}, "f": { "1": 0, "2": 0 }, "fnMap": { "1": { "name": "define", "line": 28, "loc": { "start": { "line": 28, "column": 7 }, "end": { "line": 28, "column": 51 } } }, "2": { "name": "render", "line": 42, "loc": { "start": { "line": 42, "column": 7 }, "end": { "line": 42, "column": 47 } } } }, "statementMap": { "1": { "start": { "line": 28, "column": 7 }, "end": { "line": 30, "column": 1 } }, "2": { "start": { "line": 29, "column": 4 }, "end": { "line": 29, "column": 55 } }, "3": { "start": { "line": 42, "column": 7 }, "end": { "line": 49, "column": 1 } }, "4": { "start": { "line": 43, "column": 4 }, "end": { "line": 43, "column": 34 } }, "5": { "start": { "line": 44, "column": 4 }, "end": { "line": 46, "column": 5 } }, "6": { "start": { "line": 45, "column": 8 }, "end": { "line": 45, "column": 30 } }, "7": { "start": { "line": 47, "column": 4 }, "end": { "line": 47, "column": 35 } }, "8": { "start": { "line": 48, "column": 4 }, "end": { "line": 48, "column": 19 } } }, "branchMap": {} };
}
__cov_H_SvvlkyAFJH6Pua8JR_Ig = __cov_H_SvvlkyAFJH6Pua8JR_Ig['/Users/edoardo/Development/dna/dna-components/packages/dna-core/index.js'];
function define$1(tagName, Component, config) {
   __cov_H_SvvlkyAFJH6Pua8JR_Ig.f['1']++;__cov_H_SvvlkyAFJH6Pua8JR_Ig.s['2']++;return registry.define(tagName, Component, config);
}function render$1(node, Component, props) {
   __cov_H_SvvlkyAFJH6Pua8JR_Ig.f['2']++;__cov_H_SvvlkyAFJH6Pua8JR_Ig.s['4']++;var element = new Component();__cov_H_SvvlkyAFJH6Pua8JR_Ig.s['5']++;for (var k in props) {
      __cov_H_SvvlkyAFJH6Pua8JR_Ig.s['6']++;element[k] = props[k];
   }__cov_H_SvvlkyAFJH6Pua8JR_Ig.s['7']++;DOM.appendChild(node, element);__cov_H_SvvlkyAFJH6Pua8JR_Ig.s['8']++;return element;
}var BaseComponent = function (_mix$with) {
   inherits(BaseComponent, _mix$with);

   function BaseComponent() {
      classCallCheck(this, BaseComponent);
      return possibleConstructorReturn(this, _mix$with.apply(this, arguments));
   }

   return BaseComponent;
}(mix(shim(self.HTMLElement)).with(MIXINS.ComponentMixin, MIXINS.PropertiesMixin, MIXINS.StyleMixin, MIXINS.EventsMixin, MIXINS.TemplateMixin));

exports.mix = mix;
exports.prop = prop;
exports.shim = shim;
exports.DOM = DOM;
exports.MIXINS = MIXINS;
exports.registry = registry;
exports.define = define$1;
exports.render = render$1;
exports.BaseComponent = BaseComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi9Vc2Vycy9lZG9hcmRvL0RldmVsb3BtZW50L2RuYS9kbmEtY29tcG9uZW50cy9wYWNrYWdlcy9kbmEtY29yZS9zcmMvcG9seWZpbGxzL2N1c3RvbS1ldmVudC5qcyIsIi9Vc2Vycy9lZG9hcmRvL0RldmVsb3BtZW50L2RuYS9kbmEtY29tcG9uZW50cy9wYWNrYWdlcy9kbmEtY29yZS9zcmMvcG9seWZpbGxzL21hdGNoZXMuanMiLCIvVXNlcnMvZWRvYXJkby9EZXZlbG9wbWVudC9kbmEvZG5hLWNvbXBvbmVudHMvcGFja2FnZXMvZG5hLWNvcmUvc3JjL3BvbHlmaWxscy9yZWR1Y2UuanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IEN1c3RvbUV2ZW50O1xuXG50cnkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIGxldCBldiA9IG5ldyBzZWxmLkN1c3RvbUV2ZW50KCd0ZXN0Jyk7XG4gICAgQ3VzdG9tRXZlbnQgPSBzZWxmLkN1c3RvbUV2ZW50O1xufSBjYXRjaChleCkge1xuICAgIEN1c3RvbUV2ZW50ID0gZnVuY3Rpb24oZXZlbnQsIHBhcmFtcykge1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge1xuICAgICAgICAgICAgYnViYmxlczogZmFsc2UsXG4gICAgICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGRldGFpbDogdW5kZWZpbmVkLFxuICAgICAgICB9O1xuICAgICAgICBsZXQgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgICAgIHJldHVybiBldnQ7XG4gICAgfTtcbiAgICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSBzZWxmLkN1c3RvbUV2ZW50LnByb3RvdHlwZTtcbn1cblxuZXhwb3J0IHsgQ3VzdG9tRXZlbnQgfTtcbiIsImNvbnN0IEVMRU1fUFJPVE8gPSBFbGVtZW50LnByb3RvdHlwZTtcblxuZXhwb3J0IGNvbnN0IG1hdGNoZXMgPSBFTEVNX1BST1RPLm1hdGNoZXMgfHxcbiAgICBFTEVNX1BST1RPLm1hdGNoZXNTZWxlY3RvciB8fFxuICAgIEVMRU1fUFJPVE8ubW96TWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgRUxFTV9QUk9UTy5tc01hdGNoZXNTZWxlY3RvciB8fFxuICAgIEVMRU1fUFJPVE8ub01hdGNoZXNTZWxlY3RvciB8fFxuICAgIEVMRU1fUFJPVE8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yO1xuIiwiLyogZXNsaW50LWRpc2FibGUgcHJlZmVyLXJlc3QtcGFyYW1zICovXG5leHBvcnQgY29uc3QgcmVkdWNlID0gQXJyYXkucHJvdG90eXBlLnJlZHVjZSB8fCBmdW5jdGlvbihjYWxsYmFjayAvKiwgaW5pdGlhbFZhbHVlKi8gKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGxldCB0ID0gdGhpcztcbiAgICBsZXQgbGVuID0gdC5sZW5ndGg7XG4gICAgbGV0IGsgPSAwO1xuICAgIGxldCB2YWx1ZTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICB2YWx1ZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAoayA8IGxlbiAmJiAhKGsgaW4gdCkpIHtcbiAgICAgICAgICAgIGsrKztcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZSA9IHRbaysrXTtcbiAgICB9XG4gICAgZm9yICg7IGsgPCBsZW47IGsrKykge1xuICAgICAgICBpZiAoayBpbiB0KSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrKHZhbHVlLCB0W2tdLCBrLCB0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59O1xuIl0sIm5hbWVzIjpbIkN1c3RvbUV2ZW50IiwiZXYiLCJzZWxmIiwiZXgiLCJldmVudCIsInBhcmFtcyIsInVuZGVmaW5lZCIsImV2dCIsImRvY3VtZW50IiwiY3JlYXRlRXZlbnQiLCJpbml0Q3VzdG9tRXZlbnQiLCJidWJibGVzIiwiY2FuY2VsYWJsZSIsImRldGFpbCIsInByb3RvdHlwZSIsIkVMRU1fUFJPVE8iLCJFbGVtZW50IiwibWF0Y2hlcyIsIm1hdGNoZXNTZWxlY3RvciIsIm1vek1hdGNoZXNTZWxlY3RvciIsIm1zTWF0Y2hlc1NlbGVjdG9yIiwib01hdGNoZXNTZWxlY3RvciIsIndlYmtpdE1hdGNoZXNTZWxlY3RvciIsInJlZHVjZSIsIkFycmF5IiwiY2FsbGJhY2siLCJ0IiwibGVuIiwibGVuZ3RoIiwiayIsInZhbHVlIiwiYXJndW1lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxvQkFBSjs7QUFFQSxJQUFJOztRQUVJQyxLQUFLLElBQUlDLEtBQUtGLFdBQVQsQ0FBcUIsTUFBckIsQ0FBVDtrQkFDY0UsS0FBS0YsV0FBbkI7Q0FISixDQUlFLE9BQU1HLEVBQU4sRUFBVTtrQkFDTSxxQkFBU0MsS0FBVCxFQUFnQkMsTUFBaEIsRUFBd0I7aUJBQ3pCQSxVQUFVO3FCQUNOLEtBRE07d0JBRUgsS0FGRztvQkFHUEM7U0FIWjtZQUtJQyxNQUFNQyxTQUFTQyxXQUFULENBQXFCLGFBQXJCLENBQVY7WUFDSUMsZUFBSixDQUFvQk4sS0FBcEIsRUFBMkJDLE9BQU9NLE9BQWxDLEVBQTJDTixPQUFPTyxVQUFsRCxFQUE4RFAsT0FBT1EsTUFBckU7ZUFDT04sR0FBUDtLQVJKO2dCQVVZTyxTQUFaLEdBQXdCWixLQUFLRixXQUFMLENBQWlCYyxTQUF6QztDQUdKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQkEsSUFBTUMsYUFBYUMsUUFBUUYsU0FBM0I7O0FBRUEsQUFBTyxJQUFNRyxVQUFVRixXQUFXRSxPQUFYLElBQ25CRixXQUFXRyxlQURRLElBRW5CSCxXQUFXSSxrQkFGUSxJQUduQkosV0FBV0ssaUJBSFEsSUFJbkJMLFdBQVdNLGdCQUpRLElBS25CTixXQUFXTyxxQkFMUjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGUDtBQUNBLEFBQU8sSUFBTUMsU0FBU0MsTUFBTVYsU0FBTixDQUFnQlMsTUFBaEIsSUFBMEIsVUFBU0UsUUFBVCxxQkFBdUM7OztRQUUvRUMsSUFBSSxJQUFSO1FBQ0lDLE1BQU1ELEVBQUVFLE1BQVo7UUFDSUMsSUFBSSxDQUFSO1FBQ0lDLGNBQUo7UUFDSUMsVUFBVUgsTUFBVixLQUFxQixDQUF6QixFQUE0QjtnQkFDaEJHLFVBQVUsQ0FBVixDQUFSO0tBREosTUFFTztlQUNJRixJQUFJRixHQUFKLElBQVcsRUFBRUUsS0FBS0gsQ0FBUCxDQUFsQixFQUE2Qjs7O2dCQUdyQkEsRUFBRUcsR0FBRixDQUFSOztXQUVHQSxJQUFJRixHQUFYLEVBQWdCRSxHQUFoQixFQUFxQjtZQUNiQSxLQUFLSCxDQUFULEVBQVk7b0JBQ0FELFNBQVNLLEtBQVQsRUFBZ0JKLEVBQUVHLENBQUYsQ0FBaEIsRUFBc0JBLENBQXRCLEVBQXlCSCxDQUF6QixDQUFSOzs7V0FHREksS0FBUDtDQW5CRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==