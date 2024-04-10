'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
Object.defineProperty(exports, '__esModule', { value: true })
var chalk_1 = require('chalk')
var cli_progress_1 = require('cli-progress')
var get_items_js_1 = require('../items/get-items.js')
var create_api_js_1 = require('../spotify-api/create-api.js')
function getLikedTracks() {
  return __awaiter(this, void 0, void 0, function () {
    var spotify, MAX_LIMIT, page, total, profile, urls, progressBar, items
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, create_api_js_1.createAPI)()]
        case 1:
          spotify = _a.sent()
          MAX_LIMIT = 50
          return [
            4 /*yield*/,
            spotify.currentUser.tracks.savedTracks(MAX_LIMIT),
          ]
        case 2:
          page = _a.sent()
          total = page.total
          return [4 /*yield*/, spotify.currentUser.profile()]
        case 3:
          profile = _a.sent()
          urls = Array.from({ length: Math.floor(total / MAX_LIMIT) + 1 }).map(
            function (_value, index) {
              return ''
                .concat(profile.href, '/tracks?offset=')
                .concat(index * MAX_LIMIT, '&limit=50')
            },
          )
          progressBar = new cli_progress_1.SingleBar({
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            format:
              'CLI Progress |' +
              chalk_1.default.green('{bar}') +
              '| {percentage}% || {value}/{total} Songs',
            hideCursor: true,
          })
          return [
            4 /*yield*/,
            (0, get_items_js_1.default)(urls, total, progressBar),
          ]
        case 4:
          items = _a.sent()
          return [2 /*return*/, items]
      }
    })
  })
}
exports.default = getLikedTracks
