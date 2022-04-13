# WD301 Course Project

## Form Builder Project

✅ User Authentication using API \
✅ CRUD operations on form using APIn\
✅ Form Builder with text, dropdown, multiselect, radio and location picker as form fields \
✅ Preview Manager to fill the data in the form fields \
✅ Submission View to check the number of submission of each form

**Note:** The API used for all the major operations is [Coronasafe API](https://tsapi.coronasafe.live/swagger/?format=openapi) whose documentation can be found on [Coronasafe Swagger](https://tsapi.coronasafe.live/swagger/)

## Accounts

- For user authentication using API, sign up on [Coronasafe course_api](https://tsapi.coronasafe.live/).
- For using Sentry for checking issues related to project, sign up on [Sentry](https://sentry.io) and include the `dsn key` in `.env.production` file as `REACT_APP_SENTRY_DSN=<dsn key>`.

## Setting Up the Project

```bash

# install all the dependencies
yarn install

# start the development server
yarn start

# launch the test runner
yarn test

# build the app for production to the build folder
yarn build

```
