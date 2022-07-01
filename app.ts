import { Backend, Plugin } from 'kuzzle';
import type { KDocument, JSONObject, PluginContext } from 'kuzzle';

const app = new Backend('kuzzle-kourou-export-issue');

class DemoPlugin extends Plugin {
  constructor() {
    super({ kuzzleVersion: '>=2.8.0 <3' });
  }

  async init(config: JSONObject, context: PluginContext) {
    this.config = config;
    this.context = context;

    this.pipes = {
      'kuzzle:state:live': this.initialize.bind(this),
      'generic:document:afterGet': this.afterGet.bind(this),
    };
  }

  async afterGet(documents: KDocument<any>[]) {
    // Here we corrupt the data
    return documents.map((d) => ({
      ...d,
      _source: { _id: d._id, ...d._source },
    }));
  }

  async initialize() {
    if (!(await this.context.accessors.sdk.index.exists('demo'))) {
      await this.context.accessors.sdk.index.create('demo');

      if (
        !(await this.context.accessors.sdk.collection.exists('demo', 'data'))
      ) {
        await this.context.accessors.sdk.collection.create('demo', 'data', {
          mappings: {
            properties: {},
          },
        });

        const documents = [
          {
            _id: 'some-id-0',
            body: {
              text_field: 'Some value',
            },
          },
          {
            _id: 'some-id-1',
            body: {
              text_field: 'Another value',
            },
          },
          {
            _id: 'some-id-2',
            body: {
              text_field: 'A third value',
            },
          },
          {
            _id: 'some-id-3',
            body: {
              text_field: 'Just another value',
            },
          },
        ];

        await this.context.accessors.sdk.document.mCreate(
          'demo',
          'data',
          documents
        );
      }
    }
  }
}

app.plugin.use(new DemoPlugin());

app
  .start()
  .then(() => {
    app.log.info('Application started');
  })
  .catch(console.error);
