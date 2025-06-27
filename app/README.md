# App

This folder contains the sources needed to build the app. It is a [Capacitor](https://capacitorjs.com/)-Project based on [Ionic](https://ionicframework.com/) and [Angular](https://angular.io/).

## Requirements

- NodeJS v22.16 or higher
- Ionic CLI
- Capacitor CLI
- Angular CLI

Note: Currently we are not yet allowed to publish the final database, that is included in the App, here on GitHub. Thus, you have to build a database with the build-scripts in the `db/` folder of the repository. If you just want to run the app, you can rename the file `app/src/assets/databases/dicziunariSQLite_sample.db` to `dicziunariSQLite.db` to have an empty db with the expected structure.

# Build the project

- `ionic capacitor build android`
- `ionic capacitor build ios`

Then, open XCode or Android Studio to run the app on a device or simulator.

# Running in browser web

During development, the app can be run in the browser. To do so, switch to the `web` branch, as this needs some more dependencies, that should not be included in app builds.

- `npx cap sync`
- `npm run build`
- `npx cap copy web`
- `ionic serve`
