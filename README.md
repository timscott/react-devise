**ATTENTON**: For now, this must be considered experimental software and not to be used in production.

# React Devise

## Introduction

Devise has long been the go-to authentication library for Rails apps. Just drop Devise into your Rails app, make a few tweaks, and get on with building awesome business features. But what happens when you want to build single page apps? Much of Devise's functionality is wrapped up with server side routing and rendering. When using Rails strictly as data API, must your leave Devise behind?

It turns out it's not very hard to purpose Devise as an authentication backend. But that leaves undone a bunch of view-related functionality that Devise provides out of the box.

Enter **React Devise**. 

The goal of this React Devise is to make it extremely easy to add authentication to a new React+Rails app while maintaining ultimate flexibility.

## Dependencies

React Devise has deep dependencies on a few popular React modules. The most significant are:

* [react-redux](https://github.com/reactjs/react-redux)
* [react-router](https://github.com/ReactTraining/react-router)
* [redux-form](https://github.com/erikras/redux-form)

If you don't want to use these in your app, React Devise is probably not for you.

## Installation

```
yarn add react-devise
```

## Documentation

[Documenation Wiki](https://github.com/timscott/react-devise/wiki/Home)

## Reference App

Have a look at a reference implementation.

* [The code](https://github.com/timscott/react-devise-sample)
* [Demo on Heroku](http://react-devise-sample.herokuapp.com/)

## To Do

* Create a ruby gem
* Ouath support
* Support multiple resource types
* Support all devise views
* Support more customization of messages
* Possibly an "eject" function to allow full customization of views
* ???
