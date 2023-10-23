# apca-check

[![ci status][gh-action-badge]][gh-action-url] [![npm version][npm-badge]][npm-url]

This package contains custom axe rules and checks for [APCA](https://readtech.org/) Bronze and Silver+ [conformance levels](https://readtech.org/ARC/tests/visual-readability-contrast/?tn=criterion).

## Usage

### Installation

```bash
npm install --save-dev axe-core apca-check
```

### Setup

```js
import axe from "axe-core";
import { registerAPCACheck } from 'apca-check';

registerAPCACheck('bronze'); // or registerAPCACheck('silver');

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

1. Use `custom` as the first argument when calling `registerAPCACheck`.
1. Provide a function as the second argument, optionally accepting `fontSize` and `fontWeight` arguments.


```js
const customConformanceThresholdFn = (fontSize, fontWeight) => {
    const size = parseFloat(fontSize);
    const weight = parseFloat(fontWeight);

    return size >= 32 || weight > 700 ? 45 : 60;
};

registerAPCACheck('custom', customConformanceThresholdFn);
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

We use [changesets](https://github.com/changesets/changesets) to automatize the steps necessary to publish to NPM, create GH releases and a changelog.

- Every time you do work that requires a new release to be published, [add a changesets entry](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) by running `npx chageset` and follow the instrcutions on screen. (changes that do not require a new release - e.g. changing a test file - don't need a changeset).
  - When opening a PR without a corresponding changeset the [changesets-bot](https://github.com/apps/changeset-bot) will remind you to do so. It generally makes sense to have one changeset for PR (if the PR changes do not require a new release to be published the bot message can be safely ignored)
- The [release github workflow](.github/workflows/release.yml) continuosly check if there are new pending changesets in the main branch, if there are it creates a GH PR (`chore(release)` [see example](https://github.com/StackExchange/apca-check/pull/2)) and continue updating it as more changesets are potentially pushed/merged to the main branch.
- When we are ready to cut a release we need to simply merge the `chore(release)` PR back to main and the release github workflow will take care of publishing the changes to NPM and create a GH release for us. The `chore(release)` PR also give us an opportunity to adjust the automatically generated changelog when necessary (the entry in the changelog file is also what will end up in the GH release notes).

_The release github workflow only run if the CI workflow (running linter, formatter and tests) is successful: CI is blocking accidental releases_.

_Despite using changesets to communicate the intent of creating releases in a more explicit way, we still follow [conventional commits standards](https://www.conventionalcommits.org/en/v1.0.0/) for keeping our git history easily parseable by the human eye._

## License
Copyright 2023 Stack Exchange, Inc and released under the [MIT License](/LICENSE.MD).
`axe-core®` and `axe®` are a trademark of Deque Systems, Inc. in the US and other countries.


[gh-action-url]: https://github.com/StackExchange/apca-check/actions/workflows/CI.yml
[gh-action-badge]: https://github.com/StackExchange/apca-check/actions/workflows/CI.yml/badge.svg?branch=main
[npm-url]: https://npmjs.org/package/apca-check
[npm-badge]: https://img.shields.io/npm/v/apca-check.svg