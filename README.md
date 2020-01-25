# charity-be

![alt text](https://img.shields.io/github/issues/wesbubeck/charity-be "Issues Badge")
![alt text](https://img.shields.io/github/forks/wesbubeck/charity-be "Forks Badge")
![alt text](https://img.shields.io/github/stars/wesbubeck/charity-be "Issues Badge")
![alt text](https://img.shields.io/github/license/wesbubeck/charity-be "Issues Badge")

Back End for my charity app

## Description

This app will give volunteers the ability to search local charities and events. Volunteers will be able to favorite charities and view attended request. Charities will be able to manage volunteers data and event data.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install charity-be.

```bash
npm install charity-be
```

### Linting: Uses eslint with modified Airbnb rules:

To run lint in terminal run

```bash
npm run lint
```

to run lint and auto fix in terminal run

```bash
npm run lint:fix
```

## Usage

```javascript
import charity-be
```

## Development Branches

Branches should be based off master and name convention is -issue- for example John Doe's branch for issue number 20 would be

```bash
jd-issue-20
```

## Testing

Unit test are in Jest . Mongoose test use jest-mongodb which is mongo in memory. [Download location](https://github.com/shelfio/jest-mongodb)
to run test in terminal run

```bash
npm run test
```

To run test in watch mode type

```bash
npm run test:watch
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

Pull request: For pull request to merge all unit test need to pass and eslint pass, Github Actions run these on a push. You will need at least 1 reviewer on a PR to sign off for it to merge. If you have more than several commits please squash them before merging in case they need to be reverted. In the comments of your pr please include

```bash
closing issues keywords
```

Get more help here [Git help](https://help.github.com/en/github/managing-your-work-on-github/closing-issues-using-keywords)

## License

[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)
