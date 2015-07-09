#Watchless#

Unsatisfied with the less file watchers on NPM, I've created *watchless* to be a more reliable solution. 
*Watchless* uses [https://www.npmjs.com/package/chokidar](**chokidar**) as the library for file watching which has better
reliability than fs.watch or stalker.

##Usage##

###Command Line###

```BASH

Usage: watchless [options] <source> <destination>
 
  <source>             =   The source directory or less file to compile
  <destination>        =   The destination directory for the compiled CSS
 
  OPTIONS
     -e, --extension   =   The extension for the compiled CSS file, .min is prefixed if compression is enabled
     -c, --compress    =   Enable compress on compiled CSS
     -h, --help        =   This menu

```

In a typical watcher solution for package.json:

```JSON
...

    {
        "scripts": {
            "watch-js": "watchify app/js/script.js -o app/static/bundle.min.js",
            "watch-less": "watchless -c app/less app/css",
            "watch": "npm run watch-js & npm run watch-less"
        }
    }
...

```

```BASH
npm run watch
```

###Node.js###

```JS
    var watchless = require("watchless");
    
    var options = {
        source: "app/less/test.less",
        destination: "app/css",
        compress: true
        };
    
    var watcher = watchless(options); // When source and destination are supplied in the options, watch starts automatically
    
```

```JS
    var watchless = require("watchless");
    
    var options = {
        compress: true
        };
        
    var watcher = watchless(options);
    
    watcher.watch("app/less", "app/css"); // The watcher can be started by calling watch. If the source or destination aren't supplied, they are pulled from the options
    
    watcher.stop(); // Stop watching files
```
