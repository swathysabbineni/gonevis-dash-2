# GoNevis Dash

[![CircleCI](https://circleci.com/gh/SavandBros/gonevis-dash-2.svg?style=shield)](https://circleci.com/gh/SavandBros/gonevis-dash-2)

GoNevis dashboard and reader front-end source code.

- Production URL: https://dash.gonevis.com
- Staging URL: http://dash-draft.gonevis.com

![GoNevis](https://gonevis.s3.amazonaws.com/dolphin/d30affc4-4bef-47d8-8a28-34c45b418dff/1585072945206_Screenshot_182.png)

## Development

This project is made with Angular.

### Serve

- Local: `npm run serve`
- Staging: `npm run serve-stag`
- Production: `npm run serve-prod`

### Build

- Local: `npm run build`
- Staging: `npm run build-staging`
- Production: `npm run build-production`

### Code Scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Recording Changelogs

To keep track of changes (_ChangeLog.md_), each time a task has been done use the `changelog` command:

```bash
$ npm run changelog
# Usage: npm run changelog CHANGE_TYPE ISSUE_ID TITLE
```

### Unit Tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### End-to-end Tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Code Quality

Run `npm run lint` to execute linting via [TSLint](https://palantir.github.io/tslint/).

### Branching

Features: Any new work should be branched out from "master" branch and must be merged back into the "master" branch.

Hot fixes: Fixes should be branched out from "production" branch and must be merged back into "master" and "production".

#### Branches

Branch **production**, should be last and stable working code that is on production servers.

All the pull requests (from Master branch) should pass the code checks, including and not limited to:

* Test Coverage
* Unit Tess Status
* Build Status
* Reviewers Approval

Branch **master**, should contains the latest development work and should be on staging.

All the pull requests (from developers) should pass the code checks, including and not limited to:

* Test Coverage
* Unit Tess Status
* Build Status
* Reviewers Approval

#### Deployment

Deployment happens automatically via the CI.

Latest code on **master** branch will be deployed to the staging, while branch **production** will be deployed to production server.

#### Release

To release a new version or have the latest changes on the production:

* Make a new Pull Request from branch **master** to **production**.
* The pull request should pass (not limited to):
  * Test Coverage
  * Unit Test Status
  * Build Status
  * Reviewers Approval

After merging the pull request into **production**, the CI will build and deploy the latest code from production branch to the Production server.


### Further Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## License

GoNevis Dash is licensed and distributed under GPLv3.
