# Deploying New NPM Version

In order to deploy a new npm version you have to have the correct credentials
set up. For now, only @diminishedprime has these credentials.

To deploy a new version of this to npm:

1.  Make sure the code has been built & versioned

    ```bash
    yarn install
    yarn build
    yarn version
    ```

1.  Commit new changes.

1.  Publish the code to npm

    ```bash
    npm publish --access public
    ```
