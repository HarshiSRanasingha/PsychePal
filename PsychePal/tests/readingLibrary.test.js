const test = require('node:test');
const assert = require('node:assert/strict');
const { languages, topics, parseReadResources } = require('../src/data/readingLibrary');
const exercises = require('../src/data/relaxationExercises');

test('every resource language has ten categories with five distinct readable guides', () => {
  assert.deepEqual(languages.map(language => language.code), ['en', 'si', 'ta']);
  assert.ok(topics.length >= 10);
  assert.equal(new Set(topics.map(topic => topic.id)).size, topics.length);
  topics.forEach(topic => {
    assert.ok(topic.articles.length >= 5, topic.id);
    languages.forEach((language, index) => {
      assert.ok(topic.names[index].trim(), `${topic.id}: ${language.code} name`);
      assert.ok(topic.intro[index].trim(), `${topic.id}: ${language.code} introduction`);
      const titles = topic.articles.map(([title, body]) => {
        assert.ok(title[index].trim(), `${topic.id}: ${language.code} title`);
        assert.ok(body[index].trim(), `${topic.id}: ${language.code} body`);
        return title[index];
      });
      assert.equal(new Set(titles).size, titles.length, `${topic.id}: ${language.code} duplicate titles`);
    });
  });
});

test('reading progress accepts only a list of article IDs', () => {
  assert.deepEqual(parseReadResources(null), []);
  assert.deepEqual(parseReadResources('["si:stress:1","en:rest:0"]'), ['si:stress:1', 'en:rest:0']);
  assert.throws(() => parseReadResources('{"id":"en:rest:0"}'), /unexpected format/);
  assert.throws(() => parseReadResources('[1]'), /unexpected format/);
  assert.throws(() => parseReadResources('not json'), SyntaxError);
});

test('relaxation toolkit offers ten distinct usable exercises', () => {
  assert.ok(exercises.length >= 10);
  assert.equal(new Set(exercises.map(exercise => exercise[2])).size, exercises.length);
  assert.ok(exercises.every(([title, description]) => title.trim() && description.trim()));
});
