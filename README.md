# rickchurian-cli

Rick and morty inspired cli. With multiple cli commands and additional functionality being added.

## Installation

Use the package manager [yarn](https://yarnpkg.com/) inside the project folder to install its dependencies then run it.

```bash
git clone https://github.com/sorcerer-worker/rickchurian-cli
cd rickchurian-cli
yarn install --frozen-lockfile
tsc
node ./bin/index.js
```

## Commands

```
Usage: rickchurian [options]

Options:
  --all                            see all results from any search queries
  --char, --character [character]  search by name or view a list of characters currently logged
  --loc, --location [location]     search by name or view a list of locations currently logged
  --ep, --episode [episode]        search by name or view a list of episodes currently logged
  --seasons                        see a list of all seasons currently logged
  --years                          see a list of all years R&M has existed currently logged
  -h, --help                       display help for command
```