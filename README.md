# Redaxtor-codemirror
Redaxtor-codemirror is a source-editor plugin for Redaxtor library

## The Gist (with Redaxtor)
```js
var Redaxtor = require('redaxtor');
var RedaxtorSeo = require('redaxtor-codemirror');
require('style!css!codemirror/lib/codemirror.css');

var components = {
    source: RedaxtorSeo
}

let redaxtor = new Redaxtor({
    pieces: {
        components: components
    }
});
```
