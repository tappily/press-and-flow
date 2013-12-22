module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('assemble');

    grunt.initConfig({
        pkg: grunt.file.readJSON('bower.json'),
        assemble: {
            options: {
                assets: 'dist/specimen/',
                data: ['bower.json'],
                styles: ['<%=pkg.name%>.css'],
                helpers: 'specimen/helper/**/helper-*.js',
                layoutdir: 'specimen/layout',
                partials: 'specimen/partial/**/*.hbs'
            },
            specimen: {
                options: {
                    layout: 'default.hbs',
                    data: [],
                    webfont: 'Stint Ultra Expanded|Roboto'
                },
                cwd: 'specimen/page',
                expand: true,
                src: ['*.hbs'],
                dest: 'dist/specimen/'
            }
        },
        autoprefixer: {
            options: {},
            build: {
                src: ['dist/less/main.less', 'dist/less/main/*.less']
            },
            specimen: {
                src: 'dist/specimen/css/<%=pkg.name%>.css'
            }
        },
        clean: {
            dist: ['dist']
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: ['dist/specimen']
                }
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['less/main.less', 'less/main/*.less'],
                    dest: 'dist/',
                    filter: 'isFile'
                }]
            },
            specimen: {
                files: [{
                    expand: true,
                    cwd: 'bower_components/font-awesome',
                    src: ['fonts/*'],
                    dest: 'dist/specimen',
                    filter: 'isFile'
                },{
                    expand: true,
                    cwd: 'specimen',
                    src: ['asset/*'],
                    dest: 'dist/specimen',
                    filter: 'isFile'
                }]
            }
        },
        'gh-pages': {
            options: {
                base: 'dist/specimen'
            },
            src: '**/*'
        },
        lesslint: {
            options: {
                formatters: [{
                    id: 'csslint-xml',
                    dest: 'report/lesslint.xml'
                }]
            },
            main: {
                src: ['src/less/main.less']
            },
            specimen: {
                src: ['src/less/specimen.less']
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: ['Gruntfile.js'],
            helpers: ['specimen/helpers/*.js']
        },
        less: {
            specimen: {
                files: [
                    {'dist/specimen/css/<%=pkg.name%>.css': 'src/less/specimen.less'}
                ]
            }
        },
        release: {
            options: {
                file: 'bower.json'
            }
        },
        watch: {
            handlebars: {
                files: 'specimen/**/*.hbs',
                tasks: ['assemble']
            },
            less: {
                files: 'src/less/**/*.less',
                tasks: ['lesslint:specimen', 'less:specimen', 'autoprefixer:specimen']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    'dist/**/*'
                ]
            }
        }
    });

    grunt.registerTask('default', [
        'clean',
        'test',
        'build'
    ]);

    grunt.registerTask('test', ['jshint', 'lesslint:main']);

    grunt.registerTask('build', ['clean', 'test', 'copy:main']);

    grunt.registerTask('build:specimen', ['clean', 'jshint', 'lesslint:specimen', 'copy:specimen', 'less:specimen',
        'autoprefixer:specimen', 'assemble']);

    grunt.registerTask('deploy:specimen', ['build:specimen', 'gh-pages']);

    grunt.registerTask('live', ['build:specimen', 'connect:livereload', 'watch']);
};
