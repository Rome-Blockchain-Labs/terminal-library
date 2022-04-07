# terminal-library

The common library for Rome terminal Project

Current version is 1.0.0
| version | description |
- |  | withProvider bug fix undefined provider
- | 1.0.0 |


# using RBL registry

Add your home directory file .npmrc with content

    @romeblockchain:registry=https://us-central1-npm.pkg.dev/rbl-common/rbl/
    //us-central1-npm.pkg.dev/rbl-common/rbl/:_password=""
    //us-central1-npm.pkg.dev/rbl-common/rbl/:username=oauth2accesstoken
    //us-central1-npm.pkg.dev/rbl-common/rbl/:email=not.valid@email.com
    //us-central1-npm.pkg.dev/rbl-common/rbl/:always-auth=true

and run command

    npx google-artifactregistry-auth --repo-config=.npmrc --credential-config=.npmrc

