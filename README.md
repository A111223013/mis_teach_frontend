# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



修正scss
Application bundle generation failed. [3.410 seconds]

X [ERROR] Undefined function.
  ╷
4 │   @return color.channel($value, "red", $space: rgb), color.channel($value, "green", $space: rgb), color.channel($value, "blue", $space: rgb);
  │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
  node_modules\@coreui\coreui\scss\functions\_to-rgb.scss 4:11  to-rgb()
  node_modules\@coreui\coreui\scss\_variables.scss 899:31       @forward
  node_modules\@coreui\coreui\scss\coreui.scss 5:1              @import
  src\scss\styles.scss 11:9                                     root stylesheet [plugin angular-sass]

    angular:styles/global:styles:1:8:
      1 │ @import 'src/scss/styles.scss';
        ╵         ~~~~~~~~~~~~~~~~~~~~~~

我修改_color-functions.scss的@function luminance($color) {
  $rgb: (
    "r": red($color), // 替換為兼容的 red() 函數
    "g": green($color),
    "b": blue($color)
  );跟
  _to-rgb.scss的@function to-rgb($value) {
  @return red($value), green($value), blue($value);
}


確保這行文字是新的，且之前從未提交過。