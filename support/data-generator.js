const uuid = require('uuid');
const Faker = require('faker/lib');
const fakerLocales = require('faker/lib/locales');
const Chance = require('chance');

const debug = require('debug')('cucumber:support:generator');

function hashToInteger(value) {
  return Number.parseInt(`0x${value}`, 36) % Number.MAX_SAFE_INTEGER;
}

let generatorCount = 0;
class Generator {
  constructor(seed, resolver) {
    this.id = generatorCount;
    this.uuid = uuid;
    this.guid = uuid.v4;
    this.faker = new Faker({ locales: fakerLocales });

    this.$resolver = resolver;
    this.$seed = seed || (Math.floor(Math.random() * 10000));
    debug(`generator{${this.id}}: Setting data generator seed to ${this.$seed}`);
    
    this.$seedHash = hashToInteger(this.$seed);
    this.faker.seed(this.$seedHash);
    this.chance = new Chance(this.$seed);

    this.resolve = (str) => {
      if (this.$resolver) {
        return this.$resolver.evaluate(str);
      }

      debug(`generator{${this.id}}: Variable resolver is undefined.`);
      return str;
    }

    generatorCount += 1;
  }

  set resolver(resolver) {
    this.$resolver = resolver;
  }

  seed(seed) {
    this.$seed = seed || (Math.floor(Math.random() * 10000));
    debug(`generator{${this.id}}: Setting data generator seed to ${seed}`);

    this.$seedHash = hashToInteger(this.$seed);
    this.faker.seed(this.$seedHash);
    this.chance = new Chance(this.$seed);
  }

  reset() {
    debug(`generator{${this.id}}: Re-setting data generator seed to ${this.$seed}`);
    this.faker.seed(this.$seedHash);
    this.chance = new Chance(this.$seed);
  }
}

Generator.generator = new Generator(Math.floor(Math.random() * 10000));

module.exports = Generator;
