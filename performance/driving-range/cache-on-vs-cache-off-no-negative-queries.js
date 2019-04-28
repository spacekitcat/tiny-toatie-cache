const testRunner = require('./common');

const coreConfiguration = {
  input_key_count: 2560,
  dictionary_size: 2560000,
  words_per_key: 3,
  only_dictionary_search_queries: true,
  number_of_search_attempts: 1000000
};

const experimentControl = testRunner(
  'Control experiment (cache disabled)',
  Object.assign({}, coreConfiguration, {
    cache_bypass: true
  })
);

testRunner(
  'Cache enabled experiment',
  Object.assign({}, coreConfiguration, {
    cache_bypass: false
  })
);
