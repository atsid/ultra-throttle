const gulp = require('gulp');
const mocha = require('gulp-mocha');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const runSequence = require('run-sequence');
const istanbul = require('gulp-istanbul');
const eslint = require('gulp-eslint');
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const isparta = require('isparta');
const del = require('del');
require('gulp-semver-tasks')(gulp);

let MOCHA_REPORTER = 'nyan';
const paths = {
    source: ['src/**/*.js', '!src/**/*.test.js'],
    staticAssets: ['package.json', 'LICENSE', 'README.md', '.npmignore'],
    dest: './dist',
    main: 'src/index.js',
    test: 'src/**/*.test.js',
    testhelpers: 'test/**/*.js',
    build: {
        main: 'Gulpfile.js',
        tasks: 'gulp.tasks.js',
    },
};
const SRC_STATIC_CHECK_GLOB = paths.source.concat([
        paths.main,
        paths.build.main,
        paths.build.tasks,
    ]);
const TEST_STATIC_CHECK_GLOB = [
        paths.test,
        paths.testhelpers,
    ];
const ESLINT_TEST_CONF = {
    rules: {
        'no-unused-expressions': 0,
    },
    globals: {
        'describe': true,
        'it': true,
        'before': true,
        'beforeEach': true,
        'after': true,
        'afterEach': true,
    },
};
const TDD_CONF = {
    errorHandler: () => gutil.beep(),
};

function doBabel(conf) {
    return gulp.src(paths.source)
        .pipe(plumber(conf))
        .pipe(changed(paths.dest))
        .pipe(babel())
        .pipe(gulp.dest(paths.dest));
}

function doLintSrc(conf) {
    return gulp.src(SRC_STATIC_CHECK_GLOB)
        .pipe(plumber(conf))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
}

function doLintTest(conf) {
    return gulp.src(TEST_STATIC_CHECK_GLOB)
        .pipe(plumber(conf))
        .pipe(eslint(ESLINT_TEST_CONF))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
}

function doTest(cb, conf) {
    gulp.src(paths.source)
        .pipe(plumber(conf))
        .pipe(istanbul({
            instrumenter: isparta.Instrumenter,
            includeUntested: true,
        }))
        .pipe(istanbul.hookRequire())
        .on('finish', () => {
            gulp.src(paths.test)
                .pipe(plumber(conf))
                .pipe(mocha({reporter: MOCHA_REPORTER}))
                .pipe(istanbul.writeReports({
                    reporters: ['lcov', 'text-summary'],
                }))
                .on('end', () => cb());
        })
        .on('error', (err) => cb(err));
}

gulp.task('babel', () => doBabel());
gulp.task('lint-source', () => doLintSrc());
gulp.task('lint-test', () => doLintTest());
gulp.task('lint-source-tdd', () => doLintSrc(TDD_CONF));
gulp.task('lint-test-tdd', () => doLintTest(TDD_CONF));
gulp.task('lint', ['lint-source', 'lint-test']);
gulp.task('lint-tdd', ['lint-source-tdd', 'lint-test-tdd']);
gulp.task('clean', () => del(paths.dist));
gulp.task('test', (cb) => doTest(cb));
gulp.task('test-tdd', (cb) => doTest(cb, TDD_CONF));


gulp.task('static-assets', () => {
    return gulp.src(paths.staticAssets)
        .pipe(gulp.dest(paths.dest));
});

gulp.task('build', (cb) => {
    runSequence(
        ['lint', 'babel', 'static-assets'],
        'test',
        cb
    );
});

gulp.task('ci-config', () => MOCHA_REPORTER = 'spec');
gulp.task('ci-build', (cb) => {
    runSequence(
        'ci-config',
        'build',
        cb
    );
});

gulp.task('release', (cb) => {
    runSequence(
        'clean',
        'build',
        cb
    );
});

gulp.task('watch', () => gulp.watch(['src/**/*.js'], ['lint-tdd', 'test-tdd']));
gulp.task('default', ['build']);
