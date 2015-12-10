System.config({
    transpiler: 'babel',
    meta: {
        './node_modules/babel/*': {
            format: 'cjs'
        },
        '*.next.js': {
            format: 'esm'
        }
    }
});
