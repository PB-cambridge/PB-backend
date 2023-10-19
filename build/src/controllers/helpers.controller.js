"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidBase64 = exports.findIndexContainingString = exports.regNo = void 0;
const regNo = (username) => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const randomCode = Math.floor(Math.random() * 999999)
        .toString()
        .padStart(6, "0");
    return `${username
        .slice(0, 3)
        .toLocaleUpperCase()}${randomCode}${month}${year}`;
};
exports.regNo = regNo;
function findIndexContainingString(arr, searchString) {
    return arr.findIndex(function (item) {
        return item.includes(searchString);
    });
}
exports.findIndexContainingString = findIndexContainingString;
function isValidBase64(str) {
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    return base64Regex.test(str);
}
exports.isValidBase64 = isValidBase64;
//# sourceMappingURL=helpers.controller.js.map