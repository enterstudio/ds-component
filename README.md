# dscc - Google Data Studio Community Component Helper Library

`dscc` (Data Studio Community Component) is a library to help with the building
of community components for Google Data Studio. It can be used as a standalone
library, or as a npm dependency.

## Public Interface

| Name            | Type                                                                     | Description                                                                                                                                                                           |
| --------------- | ---------------------------                                              | ----------------------------                                                                                                                                                          |
| getWidth        | () => number                                                             | Returns the width (in pixels) of the containing iframe.                                                                                                                               |
| getHeight       | () => number                                                             | Returns the height (in pixels) of the containing iframe.                                                                                                                              |
| subscribeToData | (callback: (componentData: ComponentData) => void) : Promise<() => void> | Calls `callback` every time Data Studio pushes a new `ComponentData` object. Returns a method to unsubscribe from further data.                                                       |
| delayedMessage  | (clientMessage: ClientMessage, millis: number) => Promise<void>          | For local testting. Waits `millis` milliseconds, then posts a message of `messageType` to the iframe. Used with the `messageType` `RENDER`, events from Data Studio can be simulated. |

## Usage

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
  const unSub = subscribeToData((componentData) => {
    const width = getWidth();
    const height = getHeight();
    console.log(componentData)
    // Create component as needed using componentData, height, and width...
  })
}
```

### Through Copy/Paste

Copy the contents of `lib/dscc.min.js` to the beginning of your components'
javascript file. This will introduce a `dscc` variable with the public interface
exposed.

#### Example

```javascript
// Copied contents would be here...
dscc.subscribeToData(function(componentData) {
      var width = dscc.getWidth();
      var height = dscc.getHeight();
      console.log(componentData)
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
