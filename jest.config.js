const originalConfig = require('@j.u.p.iter/jupiter-scripts/dist/lib/config/jest.config');

module.exports = {
  ...originalConfig,
  collectCoverageFrom: [
    ...originalConfig.collectCoverageFrom,
    "!**/env.js",
    "!**/env.enc.js"
  ]
};
