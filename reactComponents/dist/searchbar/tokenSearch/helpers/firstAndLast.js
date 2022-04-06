"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstAndLast = void 0;
const firstAndLast = (str, chars = 8) => str && str.slice(0, chars) + '...' + str.slice(-chars);
exports.firstAndLast = firstAndLast;
