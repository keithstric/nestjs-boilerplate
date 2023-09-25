```
#     #                           #  #####     ######                                                                  
##    # ######  ####  #####       # #     #    #     #  ####  # #      ###### #####  #####  #        ##   ##### ###### 
# #   # #      #        #         # #          #     # #    # # #      #      #    # #    # #       #  #    #   #      
#  #  # #####   ####    #         #  #####     ######  #    # # #      #####  #    # #    # #      #    #   #   #####  
#   # # #           #   #   #     #       #    #     # #    # # #      #      #####  #####  #      ######   #   #      
#    ## #      #    #   #   #     # #     #    #     # #    # # #      #      #   #  #      #      #    #   #   #      
#     # ######  ####    #    #####   #####     ######   ####  # ###### ###### #    # #      ###### #    #   #   ###### 
```

This project is purely a boilerplate with no routes. It is mean to allow rapid deployment of a new API with all the base infrastructure of the application already in place and ready to start adding custom code based on your requirements.

## Project Goals

* Basic NestJS implementation
* Provide some useful base features that can be used in any project
* Speed up the process for spinning up a new API
* Make it easy to find and arrange code

## Features

* Request ID generated for every request
* Asynchronous Local Storage (ALS) installed and configured to keep requestId and request objects so they do not have to be passed around all the different methods just to support logging
* The following middleware already setup and configured
  * Request ID Generator (uuid)
  * Request Logger
  * Populate the ALS values for every request
* Config Service looking at package.json and all environment variables
* Abstract route service to allow for the placement of code that is executed for every type of request
* [Compodoc](https://compodoc.app) Implementation
* Swagger docs ready to be defined on a per-route basis

## Getting Started

Since this repository is a template, you may want to use the template to create your project repository if storing your source code on GitHub.
See: [Creating a repository from a template](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template).

If you are not storing your project on GitHub use:

```
git clone https://github.com/keithstric/nestjs-boilerplate.git new-project
cd new-project
npm install
npm start:dev
```

Be sure to remove the `.git` directory and add it to your source control.

## Useful commands

* `npm run start:dev` - Starts a dev server and watches for changes. Will restart the server after every save
* `npm run test` - Runs the unit tests
* `npm run compodoc` - Will build the documentation
* `npm run build` - Will run the build for the application and place in the `./dist` directory

## Naming Conventions

* `core` - Interfaces, Modules, Services that are required for the base application to function. This is where you would put things like database connectors, 3rd party service apis, etc.
* `routes` - This is where all the routes for your application will be defined
* `shared` - This is where any shared services, interfaces, models, etc. should be stored
