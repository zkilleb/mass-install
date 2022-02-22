# mass-install

## A package for recursively detecting package.json files and installing dependencies

For use in monorepos or projects with multiple package.json files. `mass-install` will navigate the project structure and install dependencies for each specific directory.

## Running the application

### `npm install mass-install`

Run the command `mass-install` to begin dependency installation.

If a `.gitignore` file is detected in the root of the project, the `mass-install` script will ask the user if they want to add the newly generated `node_modules` directories to it. These changes will be appended to the bottom of the `.gitignore` file. `mass-install` will scan the existing `.gitignore` to avoid adding duplicates to the file.

Example Formatting:

```
# Automatically added by mass-install
/backend/node_modules
/src/node_modules
```

The `.gitignore` prompt can be bypassed by running the command as `mass-install --no-update`.
