module.exports = {
    verbose: true,
    testMatch: ['**/__tests__/**/?(*.)(spec|test).js'],
    setupFiles: ['./jest.setup.fixCrypto.js'],
};