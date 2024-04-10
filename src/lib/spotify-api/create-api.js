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
exports.createAPI = void 0
/* eslint-disable camelcase */
var web_api_ts_sdk_1 = require('@spotify/web-api-ts-sdk')
var node_fs_1 = require('node:fs')
var tokens_js_1 = require('./tokens.js')
var CLIENT_ID = '00bc6817f84c4065aa526dbb1fe66169'
// TODO: Refactor
function createAPI() {
  return __awaiter(this, void 0, void 0, function () {
    var refreshToken, accessToken_1, accessToken, api, error_1
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!(0, node_fs_1.existsSync)(tokens_js_1.refreshTokenPath)) {
            console.log('Login!')
          }
          refreshToken = (0, tokens_js_1.getRefreshToken)()
          if (!!(0, node_fs_1.existsSync)(tokens_js_1.accessTokenPath))
            return [3 /*break*/, 2]
          return [4 /*yield*/, (0, tokens_js_1.generateAccessToken)()]
        case 1:
          _a.sent()
          accessToken_1 = (0, tokens_js_1.getAccessToken)()
          return [
            2 /*return*/,
            web_api_ts_sdk_1.SpotifyApi.withAccessToken(CLIENT_ID, {
              access_token: accessToken_1,
              expires_in: 3600,
              refresh_token: refreshToken,
              token_type: 'Bearer',
            }),
          ]
        case 2:
          accessToken = (0, tokens_js_1.getAccessToken)()
          api = web_api_ts_sdk_1.SpotifyApi.withAccessToken(CLIENT_ID, {
            access_token: accessToken,
            expires_in: 3600,
            refresh_token: refreshToken,
            token_type: 'Bearer',
          })
          _a.label = 3
        case 3:
          _a.trys.push([3, 5, , 7])
          return [4 /*yield*/, api.currentUser.profile()]
        case 4:
          _a.sent()
          return [2 /*return*/, api]
        case 5:
          error_1 = _a.sent()
          return [4 /*yield*/, (0, tokens_js_1.generateAccessToken)()]
        case 6:
          _a.sent()
          accessToken = (0, tokens_js_1.getAccessToken)()
          return [
            2 /*return*/,
            web_api_ts_sdk_1.SpotifyApi.withAccessToken(CLIENT_ID, {
              access_token: accessToken,
              expires_in: 3600,
              refresh_token: refreshToken,
              token_type: 'Bearer',
            }),
          ]
        case 7:
          return [2 /*return*/]
      }
    })
  })
}
exports.createAPI = createAPI
