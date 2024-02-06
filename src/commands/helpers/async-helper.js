/* eslint-disable no-await-in-loop */

class AsyncHelper {
  static async waitForAllWithLimit(funcs, limit) {
    if (!limit) {
      await Promise.all(funcs);
      return;
    }

    while (funcs.length) {
      await Promise.all(funcs.splice(0, limit).map(f => f()));
    }
  }
}

module.exports = AsyncHelper;
