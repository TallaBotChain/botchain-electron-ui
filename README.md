# Botchain client app

## Dependencies

 - Electron react Boilerplate: https://github.com/chentsulin/electron-react-boilerplate
 - React Bootstrap: https://react-bootstrap.github.io
 - Ethereum Web3js: https://web3js.readthedocs.io/en/1.0/web3-eth.html
 - Electron Builder: https://github.com/electron-userland/electron-builder

## Installation

`yarn install`

## Run

`yarn dev`

## Package

To package apps for the local platform:
`yarn package`
or
`yarn package-linux`
`yarn package-win`
`yarn package-all`

## Release and Auto-Update

NOTE: Apple dev account is required for signing build.(Auto-update will not work for unsigned app)

Note: GitHub personal access token is required. You can generate by going to https://github.com/settings/tokens/new. The access token should have the **repo** scope/permission!!!

Note: Electron-builder allow configure multiple build targets for the same platform. We used:
 - MAC OS - .dmg
 - Linux - AppImage
 - Windows - NSIS

Release steps:

1. Commit new changes to master branch.
2. Upgrade build version in 'app/package.json'
3. Draft a new release at https://github.com/TallaBotChain/botchain-releases/releases. Set the “Tag version” to the value of version in your application package.json, and prefix it with **v**.
3. run `yarn package-all`
4. run `GH_TOKEN=your_personal_token yarn release`
5. publish release
