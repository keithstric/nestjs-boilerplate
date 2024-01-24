```
#     #                           #  #####     ######                                                                  
##    # ######  ####  #####       # #     #    #     #  ####  # #      ###### #####  #####  #        ##   ##### ###### 
# #   # #      #        #         # #          #     # #    # # #      #      #    # #    # #       #  #    #   #      
#  #  # #####   ####    #         #  #####     ######  #    # # #      #####  #    # #    # #      #    #   #   #####  
#   # # #           #   #   #     #       #    #     # #    # # #      #      #####  #####  #      ######   #   #      
#    ## #      #    #   #   #     # #     #    #     # #    # # #      #      #   #  #      #      #    #   #   #      
#     # ######  ####    #    #####   #####     ######   ####  # ###### ###### #    # #      ###### #    #   #   ###### 
```

This project is purely a boilerplate with no routes. It is meant to allow rapid deployment of a new API with all the base infrastructure of the application already in place and ready to start adding custom code and routes based on your requirements. This project is meant to be very un-opinionated and not force the audience into a certain technology or use of something that may not fit their particular use case.

## Project Goals

* Non-Opinionated Basic NestJS implementation
* Provide some useful base features that can be used in any project
* Speed up the process for spinning up a new API
* Make it easy to find and arrange code

## Features

* Request ID generated for every request
* Request ID decorator provided for easy retrieval of the request ID
* Asynchronous Local Storage (ALS) installed and configured to keep requestId and request objects so they do not have to be passed around all the different methods just to support logging
* The following middleware already setup and configured
  * Request ID Generator (uuid)
  * Request Logger
  * Populate the Async Local Storage values for every request
* Config Service looking at package.json and all environment variables
* Abstract route service to allow for the placement of code that is executed for every type of request
* [Compodoc](https://compodoc.app) Implementation
* Swagger docs ready to be defined on a per-route basis
* Request payload validation setup and ready for custom routes

## Getting Started

Since this repository is a template, you may want to use the template to create your project repository if storing your source code on GitHub.
See: [Creating a repository from a template](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template).

If you are not storing your project on GitHub use:

```
git clone https://github.com/keithstric/nestjs-boilerplate.git new-project
cd new-project
rm -rf .git
npm install
npm start:dev
```

Be sure to remove the `.git` directory and add the project to **YOUR** source control.

## Useful commands

* `npm run start:dev` - Starts a dev server and watches for changes. Will restart the server after every save
* `npm run test` - Runs the unit tests
* `npm run compodoc` - Will build the documentation
* `npm run build` - Will run the build for the application and place in the `./dist` directory

## Environment variables and persistent configuration options

This project includes a `ConfigService` module which will cache all environment variables. This service is a good place to also add things like a Secret Manager so that those values get cached within the application without having to go through your secret manager provider every time you need a value from it.

## Caching

I have not included a request/response cache as the need for that type of functionality seems to be based on the project itself. Also, [NestJS provides this functionality already built-in](https://docs.nestjs.com/techniques/caching). However, there is a global caching module that provides a simple means of caching values the application might use. Since this service is injectable, you should be able to use like any other service dependency.

## Naming Conventions

* `core` - Interfaces, Modules, Services that are required for the base application to function. This is where you would put things like database connectors, 3rd party service apis, loggers, etc.
* `routes` - This is where all the routes for your application will be defined
* `shared` - This is where any shared services, interfaces, models, etc. should be stored

## F.A.Q

* Why isn't a logger included in the project?
  * From my experience every team has their own logging requirements and those logs are shipped off to different locations. I thought it best to not force my opinion on the logger so that each team can implement their own logger without having to get rid of the one I included.
* Do I need to change anything to start using this project?
  * Maybe, I tried to keep it as generic as possible so there would be minimal setup or removal of features to ensure a speedy implementation. Everything should work as is and not cause any performance bottlenecks. But it's up to you what you remove and what you don't.
* Why isn't some kind of database support included?
  * Again, the database that a team uses is usually based on the project. There are so many to choose from I would not assume I know best for your particular project. Choosing a database would make this project extremely opinionated which is what I'm trying to avoid here.
* Why isn't some form of authentication included in the project?
  * Again, way too many different forms of authentication available (GCP, AWS, proprietary, JWT, OAuth, SAML, on and on). Way too opinionated and would ultimately need to be removed and replaced for too many consumers of the project.
  * Why not include multiple?
    * This would produce too much bloat and increase maintenance costs for any project
