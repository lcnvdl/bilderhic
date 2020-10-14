/* eslint-disable global-require */

const base64 = require("./base64/index");
const beep = require("./beep/index");
const cat = require("./cat/index");
const cd = require("./cd/index");
const copy = require("./copy/index");
const del = require("./del/index");
const env = require("./env/index");
const exit = require("./exit/index");
const extension = require("./extension/index");
const mkdir = require("./mkdir/index");
const pipe = require("./pipe/index");
const ren = require("./ren/index");
const run = require("./run/index");
const sleep = require("./sleep/index");
const sync = require("./sync/index");

module.exports = {
  base64,
  beep,
  cat,
  cd,
  copy,
  cp: copy,
  del,
  env,
  exit,
  extension,
  mkdir,
  pipe,
  ren,
  rm: del,
  run,
  sleep,
  sync,
};
