# Deploying New NPM Version

In order to deploy a new npm version you have to have the correct credentials
set up. For now, only @diminishedprime has these credentials.

To deploy a new version of this to npm:

+ Make sure the code has been built & versioned
```bash
yarn install && \
yarn build && \
yarn version &&
```

+ Publish the code to npm
```bash
npm publish --access public
```
