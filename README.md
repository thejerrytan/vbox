# Project Outspoken

In lieu with the theme for Startup Weekend 2018, Social Good, we decided to build something for the hard of hearing community.

This is a web application that allows you to collect sign language images, train the model and finally deploy it in your web browser. All the user needs is a webcam. The application is able to detect sign language and translate it into captions. 

After a weekend of pure hardcore hacking, we managed to get it to work and eventually won 2nd price at the hackathon!

Kudos to my team mates : @horensen, @gohjohn for making this possible!

# Reference: This repo is originally a fork from TensorFlow.js Examples

[TensorFlow.js](http://js.tensorflow.org).


# Link to competition video

Here is the link to the pitch and demo!

https://www.dropbox.com/s/95yx7d03ywuangn/Outspoken%20pitch.mp4?dl=0

# Dependencies

 - Node.js version 8.9 or higher
 - [NPM cli](https://docs.npmjs.com/cli/npm) OR [Yarn](https://yarnpkg.com/en/)


## How to build an example
`cd` into the directory

If you are using `yarn`:

```sh
cd mnist-core
yarn
yarn watch
```

If you are using `npm`:
```sh
cd mnist-core
npm install
npm run watch
```

### Details

The convention is that each example contains two scripts:

- `yarn watch` or `npm run watch`: starts a local development HTTP server which watches the
filesystem for changes so you can edit the code (JS or HTML) and see changes when you refresh the page immediately.

- `yarn build` or `npm run build`: generates a `dist/` folder which contains the build artifacts and
can be used for deployment.

## Contributing

If you want to contribute an example, please reach out to us on
[Github issues](https://github.com/thejerrytan/vbox/issues). We would greatly appreciate it if you can contribute datasets as we need highly diverse and massive amount of data in order to make this commercially ready.
