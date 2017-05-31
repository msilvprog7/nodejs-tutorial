var gulp = require('gulp'),
    del = require('del'),
    glob = require('glob'),
    browserify = require('browserify'),
    path = require('path'),
    source = require('vinyl-source-stream'),
    ts = require('gulp-typescript'),
    tsify = require('tsify');


/**
 * Build configurations
 */
var config = {
    html:   { 
        in: ['src/site/html/**/*.html'], 
        outDir: 'site' 
    },
    site:   { 
        in: ['src/site/js/client/**/*.ts'],
        configs: ['src/site/js/client/**/*.json'],
        outDir: 'site',
        outFile: 'client.js',
        standalone: 'Client'
    },
    server: { 
        in: ['src/**/*.ts'], 
        outDir: 'bin' 
    }
};

/**
 * Helper for unglobing globs into files
 */
let unglob = (globs) => {
    return globs.reduce((accum, value) => accum.concat(glob.sync(value)), []);
};



/**
 * A task to clean the build dirs
 */
gulp.task('clean', () => {
    var dirs = Object.keys(config).map(value => config[value].outDir);
    return del.sync(dirs);
});

/**
 * A task to build the server into
 * a single file to be run by node
 */
gulp.task('server', () => {
    return gulp.src(config.server.in)
               .pipe(ts({
                   module: "commonjs",
                   target: "es5"
               }))
               .pipe(gulp.dest(config.server.outDir));
});

/**
 * A task to copy over the html from src
 */
gulp.task('site-html', () => {
    return gulp.src(config.html.in)
               .pipe(gulp.dest(config.html.outDir));
});

/**
 * A task to copy over the site dependencies from src
 */
gulp.task('site-config', () => {
    return gulp.src(config.site.configs)
               .pipe(gulp.dest(config.site.outDir));
});

/**
 * A task to build the site ts into a single
 * file the src can use,
 * depends on copying over the html and config from src
 */
gulp.task('site', ['site-html', 'site-config'], () => {
    return browserify({
                basedir: '.',
                debug: true,
                entries: unglob(config.site.in),
                standalone: config.site.standalone,
                cache: {},
                packageCache: {}
           })
           .plugin(tsify)
           .bundle()
           .pipe(source(config.site.outFile))
           .pipe(gulp.dest(config.site.outDir));
});

/**
 * Default task builds server and site
 */
gulp.task('default', ['clean', 'server', 'site']);
