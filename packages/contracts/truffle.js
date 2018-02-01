module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
      development: {
          host: "localhost",
          port: 7545,
          network_id: "*", // Match any network id
          gas: 4612388,
      },
      kovan: {
          host: "localhost",
          port: 8546,
          network_id: "42",
          gas: 4612388,
      },
  },
  test_directory: "lib/test",
  migrations_directory: "lib/migrations",
};