# axe-apca

This package contains custom axe rules and checks for [APCA](https://readtech.org/) Bronze and Silver+ [conformance levels](https://readtech.org/ARC/tests/visual-readability-contrast/?tn=criterion).

## Usage

### Installation

```bash
npm install --save-dev axe-core axe-apca
```

### Setup

```js
import axe from "axe-core";
import { registerAxeAPCA } from 'axe-apca';

registerAxeAPCA('bronze'); // or registerAxeAPCA('silver');

 // consider turning off default WCAG 2.2 AA color contrast rules when using APCA
axe.configure({
    rules: [{ id: "color-contrast", enabled: false }]
})

axe.run(document, (err, results) => {
    if (err) throw err;
    console.log(results);
});
```

### Using custom APCA thresholds

To set custom thresholds for APCA checks, follow these steps:

1. Use `custom` as the first argument when calling `registerAxeAPCA`.
1. Provide a function as the second argument, optionally accepting `fontSize` and `fontWeight` arguments.


```js
const customConformanceThresholdFn = (fontSize, fontWeight) => {
    const size = parseFloat(fontSize);
    const weight = parseFloat(fontWeight);

    return size >= 32 || weight > 700 ? 45 : 60;
};

registerAxeAPCA('custom', customConformanceThresholdFn);
```

## Development

### Prerequisites

- Node.js v18+

### Linting
To run eslint (including prettier as a formatter) you can run
```
npm run lint
```
To have eslint fix any autofixable issue run
```
npm run lint:fix
```

### Testing

Tests are run by web-test-runner in combination with playwright against chromium, firefox and webkit

```
npm run test
```

For watch mode
```
npm run test:watch
```

### Publishing

TBC

## License
Copyright 2023 Stack Exchange, Inc and released under the [MIT License](/LICENSE.MD).