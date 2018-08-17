# dscc - Google Data Studio Community Component Helper Library

`dscc` (Data Studio Community Component) is a library to help with the building
of community components for Google Data Studio. It can be used as a standalone
library, or as a npm dependency. To learn more about Data Studio Community
Components, visit [Data Studio Community Visualizations][dscv-devsite].

## Public Interface

### `subscribeToData(callback, subscriptionOptions)`

Calls `callback` every time Data Studio pushes a new `Message` object to your
component. `subscribeToData` returns a method to unsubscribe your callback.

`callback` should be a function that takes the type that `subscriptionOptions.transform` returns. For full
details on the `Message` object, see [library-types.ts]

`subscriptionOptions` is an object with a `transform` property. This should be a
function that takes a Data Studio `Message` type and performs an appropriate
data transform.

#### Usage

```javascript
var callback = function(message) {
  // Logs out a `Message` object.
  console.log(message)
}

var unsubscribe = dscc.subscribeToData(callback);

setTimeout(function() {
  // Unsubscribe callback from being called after 3 seconds.
  unsubscribe();
}, 3000);
```


### `getWidth()`
Returns the width (in pixels of the containing iframe).

#### Usage
```javascript
var width = dscc.getWidth();
// This will log out the width of the iframe.
console.log(width);
```

### `getHeight()`
Returns the height (in pixels of the containing iframe).

#### Usage
```javascript
var height = dscc.getHeight();
// This will log out the height of the iframe.
console.log(height);
```

## Using `dscc` from your component

The dscc library can be used through npm, or by copying the contents into the
beginning of your javascript file.

### Through Npm

To use this library through npm run

```shell
npm install --save @google/dscc
```

#### Example

```javascript
import {
  subscribeToData,
  getHeight,
  getWidth,
} from 'dscc'

const main = () => {
  const unSub = subscribeToData((message) => {
    const width = getWidth();
    const height = getHeight();
    console.log(message)
    // Create component as needed using componentData, height, and width...
  })
}
main()
```

### Through Copy/Paste

Copy the contents of `lib/dscc.min.js` to the beginning of your components'
javascript file. This will introduce a `dscc` variable with the public interface
exposed.

#### Example

```javascript
// Copied contents would be here...
dscc.subscribeToData(function(message) {
      var width = dscc.getWidth();
      var height = dscc.getHeight();
      console.log(message)
      // Create component as needed using componentData, height, and width...
});
```

Note: It may be easier to develop this way by writing a simple script to combine
the two files. To do this using bash, for example, you would do the following:

##### build.sh

```bash
# remove the release file if it already there.
rm release.js
# create a new file called release.js
touch release.js
# put in a new line to make sure the code doesn't step on itself.
echo >> release.js
# copy the contents of 'dscc.min.js' into 'release.js'
cat 'dscc.min.js' >> release.js
# copy the contents of 'yourComponentFile.js' into 'release.js'
cat 'yourComponentFile.js' >> release.js
```

[dscv-devsite]: https://developers.google.com/datastudio/visualization/
[library-types.ts]: https://github.com/googledatastudio/ds-component/blob/master/src/library-types.ts#L13-L19
