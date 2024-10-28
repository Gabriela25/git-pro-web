# GitProWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## Comandos para subir a github pages
## crea la carpeta docs
ng build --output-path=docs/ --base-href /git-pro-web/
## se copian los archivos de browser en la raiz de docs
git add *
git commit -m ""
git push 

## comandos para docker
docker build -t pro-panel-web:3  . 
docker image tag pro-panel-web:3 gabriela2014/pro-panel-web:3
docker push gabriela2014/pro-panel-web:3
descargar:


docker pull gabriela2014/frontend-fixi:1 
docker run --name frontend-fixi -p 8081:80 gabriela2014/frontend-fixi:1