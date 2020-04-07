
export default {
    input: './lib/src/AsyncLoop.js',
    output: [{
        file: 'lib/index.js',
        name: 'asynclooptimer',
        format: 'umd'
    }, {
        file: 'lib/index.es.js',
        format: 'es'
    }, {
        file: 'lib/index.amd.js',
        format: 'amd'
    }, {
        file: 'lib/index.cjs.js',
        format: 'cjs'
    }, {
        file: 'dist/index.js',
        name: 'asynclooptimer',
        format: 'umd'
    }, {
        file: 'dist/index.es.js',
        format: 'es'
    }, {
        file: 'dist/index.amd.js',
        format: 'amd'
    }, {
        file: 'dist/index.cjs.js',
        format: 'cjs'
    }]
};
