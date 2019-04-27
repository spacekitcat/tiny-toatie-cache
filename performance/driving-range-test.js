const ToatieCache = require('../lib/index');
const generateRandomWord = require('random-words');
const Stopwatch = require('statman-stopwatch');

const populateCache = (cache, { input_key_count, words_per_key }) => {
  let keyList = [];
  const word = generateRandomWord({
    exactly: input_key_count,
    wordsPerString: words_per_key,
    separator: ''
  });

  return word.map(item => {
    const wordAsBuffer = Buffer.from(item);
    cache.append(wordAsBuffer);
    return item;
  });
};

const performTest = ({
  input_key_count,
  dictionary_size,
  words_per_key,
  number_of_search_attempts,
  cache_bypass
}) => {
  const cache = ToatieCache.build(dictionary_size, {
    cache_bypass
  });
  const cachedKeys = populateCache(cache, { input_key_count, words_per_key });

  let hits = 0;
  cache.on('hit', () => {
    hits = hits + 1;
  });

  let misses = 0;
  cache.on('miss', () => {
    misses = misses + 1;
  });

  const cacheKeyCount = cachedKeys.length;
  for (let i = 0; i < number_of_search_attempts; ++i) {
    const nextIndex = Math.floor(Math.random() * cacheKeyCount);
    const nextSearchKey = Buffer.from(cachedKeys[nextIndex]);
    cache.find(nextSearchKey, cache_bypass);
  }

  console.log(`Cache hits: ${hits}, Cache misses: ${misses}`);
};

const executeAndTimeTestDecorator = (testLabel, testConfiguration) => {
  const stopwatch = new Stopwatch();

  console.log();
  console.log(`Test label: ${testLabel}`);
  stopwatch.start();
  performTest(testConfiguration);
  stopwatch.stop();
  console.log('Experiment configuration:');
  console.log(testConfiguration);
  console.log(`Experiment time taken: ${stopwatch.read()}`);
  console.log();
  stopwatch.reset();
};

const coreConfiguration = {
  input_key_count: 2560,
  dictionary_size: 2560000,
  words_per_key: 3,
  number_of_search_attempts: 1000000
};

const experimentControl = executeAndTimeTestDecorator(
  'Control experiment (cache disabled)',
  Object.assign({}, coreConfiguration, {
    cache_bypass: true
  })
);

executeAndTimeTestDecorator(
  'Cache enabled experiment',
  Object.assign({}, coreConfiguration, {
    cache_bypass: false
  })
);
