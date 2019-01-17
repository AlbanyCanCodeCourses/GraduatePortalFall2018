/**
 * On how to setup configuration files,
 * @see https://codingsans.com/blog/node-config-best-practices
 */

const config = {
  production: {
    apiUrl: "/"
  },
  development: {
    apiUrl:
      "http://graduateportal-dev.tw7ahpynm7.us-east-2.elasticbeanstalk.com/"
  }
};

const env =
  process && process.env && process.env.NODE_ENV
    ? process.env.NODE_ENV
    : "production";

export default config[env];
