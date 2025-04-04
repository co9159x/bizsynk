"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMultipleServices = exports.clearServicesCollection = exports.addMultipleStaff = exports.getStaff = exports.getServiceRecords = exports.addServiceRecord = exports.clearStaffCollection = void 0;
var admin_js_1 = require("./admin.js");
var clearStaffCollection = function () { return __awaiter(void 0, void 0, void 0, function () {
    var staffRef, snapshot, batch_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                console.log('Clearing staff collection...');
                staffRef = admin_js_1.adminDb.collection('staff');
                return [4 /*yield*/, staffRef.get()];
            case 1:
                snapshot = _a.sent();
                batch_1 = admin_js_1.adminDb.batch();
                snapshot.docs.forEach(function (doc) {
                    batch_1.delete(doc.ref);
                });
                return [4 /*yield*/, batch_1.commit()];
            case 2:
                _a.sent();
                console.log('Staff collection cleared successfully');
                return [2 /*return*/, true];
            case 3:
                error_1 = _a.sent();
                console.error('Error clearing staff collection:', error_1);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.clearStaffCollection = clearStaffCollection;
var addServiceRecord = function (record) { return __awaiter(void 0, void 0, void 0, function () {
    var recordsRef, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                recordsRef = admin_js_1.adminDb.collection('records');
                return [4 /*yield*/, recordsRef.add(__assign(__assign({}, record), { createdAt: new Date() }))];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
            case 2:
                error_2 = _a.sent();
                console.error('Error adding service record:', error_2);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.addServiceRecord = addServiceRecord;
var getServiceRecords = function (date) { return __awaiter(void 0, void 0, void 0, function () {
    var recordsRef, query, snapshot, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                recordsRef = admin_js_1.adminDb.collection('records');
                query = recordsRef;
                if (date) {
                    query = query.where('date', '==', date);
                }
                query = query.orderBy('createdAt', 'desc');
                return [4 /*yield*/, query.get()];
            case 1:
                snapshot = _a.sent();
                return [2 /*return*/, snapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); })];
            case 2:
                error_3 = _a.sent();
                console.error('Error getting service records:', error_3);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getServiceRecords = getServiceRecords;
var getStaff = function () { return __awaiter(void 0, void 0, void 0, function () {
    var staffRef, snapshot, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                staffRef = admin_js_1.adminDb.collection('staff');
                return [4 /*yield*/, staffRef.get()];
            case 1:
                snapshot = _a.sent();
                console.log("Found ".concat(snapshot.size, " staff members"));
                return [2 /*return*/, snapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); })];
            case 2:
                error_4 = _a.sent();
                console.error('Error getting staff:', error_4);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getStaff = getStaff;
var addMultipleStaff = function (staffList) { return __awaiter(void 0, void 0, void 0, function () {
    var batch_2, staffCollection_1, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('Adding multiple staff members...');
                batch_2 = admin_js_1.adminDb.batch();
                staffCollection_1 = admin_js_1.adminDb.collection('staff');
                staffList.forEach(function (staff) {
                    var docRef = staffCollection_1.doc();
                    batch_2.set(docRef, staff);
                });
                return [4 /*yield*/, batch_2.commit()];
            case 1:
                _a.sent();
                console.log('Successfully added staff members');
                return [2 /*return*/, true];
            case 2:
                error_5 = _a.sent();
                console.error('Error adding multiple staff:', error_5);
                throw error_5;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.addMultipleStaff = addMultipleStaff;
var clearServicesCollection = function () { return __awaiter(void 0, void 0, void 0, function () {
    var servicesRef, snapshot, batch_3, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                console.log('Clearing services collection...');
                servicesRef = admin_js_1.adminDb.collection('services');
                return [4 /*yield*/, servicesRef.get()];
            case 1:
                snapshot = _a.sent();
                batch_3 = admin_js_1.adminDb.batch();
                snapshot.docs.forEach(function (doc) {
                    batch_3.delete(doc.ref);
                });
                return [4 /*yield*/, batch_3.commit()];
            case 2:
                _a.sent();
                console.log('Services collection cleared successfully');
                return [2 /*return*/, true];
            case 3:
                error_6 = _a.sent();
                console.error('Error clearing services collection:', error_6);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.clearServicesCollection = clearServicesCollection;
var addMultipleServices = function (servicesList) { return __awaiter(void 0, void 0, void 0, function () {
    var batch_4, servicesCollection_1, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('Adding multiple services...');
                batch_4 = admin_js_1.adminDb.batch();
                servicesCollection_1 = admin_js_1.adminDb.collection('services');
                servicesList.forEach(function (service) {
                    var docRef = servicesCollection_1.doc();
                    batch_4.set(docRef, service);
                });
                return [4 /*yield*/, batch_4.commit()];
            case 1:
                _a.sent();
                console.log('Successfully added services');
                return [2 /*return*/, true];
            case 2:
                error_7 = _a.sent();
                console.error('Error adding multiple services:', error_7);
                throw error_7;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.addMultipleServices = addMultipleServices;
