# Sound Health - Player Client ![check-code-coverage](https://img.shields.io/badge/code--coverage-44.69%25-red)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.3.

## Getting Started

### Requirements
[Node.js](https://nodejs.org/en) >= v14.16

### Local setup

1. Use the package manager [npm](https://www.npmjs.com/) to install the required dependencies
```bash
npm install
```
2. Copy the `environment.ts` file for the local environment into `src/environments/local/environment.local.default.ts` and make necessary changes to the environment variables
3. After completing the installation, you can start the local server by running the following command:
```bash
npm start
```
This will start the local server, and you can access the application in your web browser at `http://localhost:4300`

### Build for Production

1. Create a copy of environment file `environment.ts` into the `src/environments` directory and name it `environment.prod.ts` and make necessary changes to the environment variables
2. Run the following command to build the application for production:
```bash
npm run build:prod
```

This will create a `dist` directory in your project containing the production-ready files which can be uploaded to any static site hosting service of choice.

## Contributing

WIP

## License

WIP
