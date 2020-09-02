# Example Implementation of the InterNetX PHP Domainrobot SDK

## Preamble

This is an example implementation of the JS-Domainrobot-SDK by [InterNetX GmbH](https://internetx.com).

Find the documentation to the API and the SDK here:

* [https://internetx.github.io/js-domainrobot-sdk/](https://internetx.github.io/js-domainrobot-sdk/)
* [https://en.help.internetx.com/display/APIXMLEN/JSON+Technical+Documentation](https://en.help.internetx.com/display/APIXMLEN/JSON+Technical+Documentation)

The source code of the JS-SDK can be found here: [https://github.com/InterNetX/js-domainrobot-sdk/tree/master](https://github.com/InterNetX/js-domainrobot-sdk/tree/master)

This implementation has been built using the [ExpressJS](https://expressjs.com) Framwork.

### Requirements

* Node.js
* Node.js Packet Manager [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [GIT](https://git-scm.com/) installed on the System (if you want to clone directly from this repository)

### Setup the Project

Clone the Source Code from the Repository using your favourite git client (e.g. [sourcetree](https://www.sourcetreeapp.com/))
> git clone https://github.com/InterNetX/js-domainrobot-sdk-expressjs.git

or alternatively you can download the example implementation as a zip file here: [https://github.com/InterNetX/js-domainrobot-sdk-expressjs/archive/master.zip](https://github.com/InterNetX/js-domainrobot-sdk-expressjs/archive/master.zip)

Change into the Directory of the cloned Source Code
> cd js-domainrobot-sdk-expressjs

Execute [npm](https://www.npmjs.com/) install, the needed Node Packages for the Project will be installed.
> npm install

Afterwards it is necessary to create an .env File where the Authentication Credentials will be stored in the Root Directory of the Project. A File called .env.example is also located there which will be used as a base to create the .env File
> cp .env.example .env

Open the .env File with your text editor of choice e.g.
> nano .env

In the .env file locate the following section and set your AutoDNS Authentication Credentials

```bash
#####################################
##
## Domainrobot Configuration
##
#####################################

DOMAINROBOT_URL= # DOMAINROBOT_URL: Demo: https://api.demo.autodns.com/v1, Live: https://api.autodns.com/v1
DOMAINROBOT_USER= # AutoDNS API User
DOMAINROBOT_PASSWORD= =# AutoDNS API Password
DOMAINROBOT_CONTEXT=4 # only change this if you have Personal a AutoDNS Account
DOMAINROBOT_URL_PCDOMAINS_SUFFIX=/service/pricer

#####################################
##
## Additional configuration if you 
## want to use the SSLManager API
##
#####################################

DOMAINROBOT_SSL_USER= # SSLManager User if available
DOMAINROBOT_SSL_PASSWORD= # SSLManager Password if available
DOMAINROBOT_SSL_CONTEXT=9 # only change this if you have a Personal SSLManager Account
```

**NOTE**: To use SSL Certificate related tasks like creating SSL Contacts and SSL Certificates you need the InterNetX SSL Manager and an according API User

Install the npm Package nodemon globally
> npm install -g nodemon

#### Starting the Node.js Server

In the Root Directory of the ExpressJS Project execute the following Command to start Serving the Program

> nodemon server.js

#### Calling/Testing Routes

With a REST API Client (e.g. https://insomnia.rest/) you can now query different Tasks / Routes of the Example Implementation of the InterNetX PHP Domainrobot SDK

> GET /api/user/{username}/{context}