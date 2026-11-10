import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const [databaseId, model = 'gemini-3.5-flash-lite'] = process.argv.slice(2);
const validId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!validId.test(databaseId ?? '') || databaseId === '00000000-0000-4000-8000-000000000000') {
  throw new Error('Pass the real D1 database ID returned by Wrangler.');
}
if (!/^[a-zA-Z0-9._-]+$/.test(model)) throw new Error('Invalid Gemini model name.');

const source = resolve('dist/server/wrangler.json');
const output = resolve('dist/server/wrangler.test.json');
const config = JSON.parse(await readFile(source, 'utf8'));
const database = config.d1_databases?.find(entry => entry.binding === 'DB');
if (!database) throw new Error('The build does not contain the DB binding. Run npm run build first.');

config.name = 'nihongo-snap-test';
config.workers_dev = true;
config.d1_databases = [{ ...database, database_name: 'nihongo-snap-test', database_id: databaseId }];
config.vars = { ...config.vars, GEMINI_MODEL: model };
await writeFile(output, JSON.stringify(config, null, 2) + '\n');
console.log('Prepared ' + output + ' (generated; ignored by Git).');
