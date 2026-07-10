import { allPersonalNotes } from '../.content-collections/generated/index.js';

const m1Topics = allPersonalNotes.filter(t => t.subject === 'm1');
const caTopics = m1Topics.filter(t => t.lang === 'ca');

console.log("All M1 topics count:", m1Topics.length);
console.log("CA M1 topics count:", caTopics.length);
console.log("CA topics:");
caTopics.forEach(t => console.log(`- ${t.slug} (order: ${t.order}) -> path: ${t._meta.path}`));
