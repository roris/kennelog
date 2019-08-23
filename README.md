# Kennelog

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
[![Build Status](https://travis-ci.com/roris/kennelog.svg?branch=master)](https://travis-ci.com/roris/kennelog)
[![Test Coverage](https://api.codeclimate.com/v1/badges/967b1c552bab831b7731/test_coverage)](https://codeclimate.com/github/roris/kennelog/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/967b1c552bab831b7731/maintainability)](https://codeclimate.com/github/roris/kennelog/maintainability)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Froris%2Fkennelog.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Froris%2Fkennelog?ref=badge_shield)

A journaling SPA for dog breeders.

## Quick Start

To clone and run this repository, you will need to have [Git](https://git-scm.com/), and [Yarn](https://yarnpkg.com/) installed and configured on your machine.

When you have setting up your machine, run these from your command line:

```
# clone the repository
git clone https://github.com/roris/kennelog

# go into the cloned directory
cd kennelog

# install dependencies
yarn install

# bootstrap with lerna
yarn bootstrap

# run migration scripts
NODE_ENV=development yarn migrate

# optional: seed the database
NODE_ENV=development yarn seed

# run the application (fullstack)
NODE_ENV=development yarn start
```

If everything goes alright, the application will be accessible through [localhost:8080](http://localhost:8080). You will be greeted by a _familiar_ login form.

## Testing

To start the tests, run the following from your command line from the project's root directory:

```
NODE_ENV=development yarn test
```

## Built with

- [Bootstrap](https://getbootstrap.com/) - Styling and frontend component library
- [Aurelia](https://aurelia.io/) - An elegant unobtrusive frontend framework
- [Feathers](https://feathersjs.com/) - APIs without the boiler plate
- [Yarn](https://yarnpkg.com/) - Package manager

## License

Copyright (c) 2019

Licensed under the [MIT license](LICENSE).
