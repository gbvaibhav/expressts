"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressServer = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const glob_1 = require("glob");
class ExpressServer {
    constructor(portSent) {
        this.routerFiles = [];
        this.app = (0, express_1.default)();
        this.port = portSent ? portSent : (process.env.PORT || 4000);
        this.baseDir = process.cwd();
    }
    loadRoutes() {
        return new Promise((resolve, reject) => {
            try {
                let routesDir = path_1.default.join(this.baseDir, 'serviceRoutes/**/*.js');
                let files = (0, glob_1.globSync)(routesDir);
                this.routerFiles = files;
                if (files.length !== 0) {
                    for (let file of files) {
                        Promise.resolve(`${file}`).then(s => __importStar(require(s))).then((fileMethods) => {
                            fileMethods.default(this.app);
                        });
                    }
                }
                resolve(1);
            }
            catch (e) {
                let msg = "Error Occured: ";
                if (typeof e === "string") {
                    msg += e.toUpperCase();
                }
                else if (e instanceof Error) {
                    msg += e.message;
                }
                reject(msg);
            }
        });
    }
    loadFeatures() {
        return new Promise((resolve, reject) => {
            let expressFile = path_1.default.join(this.baseDir, 'server/serverFeatures.js');
            if ((0, fs_1.existsSync)(expressFile)) {
                Promise.resolve(`${expressFile}`).then(s => __importStar(require(s))).then((serverfeature) => {
                    serverfeature.default(this.app);
                });
            }
            resolve(1);
        });
    }
    start() {
        this.loadFeatures().then(() => {
            this.loadRoutes().then(() => {
                this.app.listen(this.port, () => {
                    console.log(`⚡️[server]: Server is running at http://localhost:${this.port}`);
                });
            });
        });
    }
}
exports.ExpressServer = ExpressServer;
