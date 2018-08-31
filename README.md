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

Note: S3 storage is currently used for releases. It requires you to define  AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY env variables.

Note: Electron-builder allow configure multiple build targets for the same platform. We used:
 - MAC OS - .dmg
 - Linux - AppImage
 - Windows - NSIS

Release steps:

1. Commit new changes to master branch.
2. Upgrade build version in 'app/package.json'
3. run `yarn package-all`
4. run `yarn release`
