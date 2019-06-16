import router from 'koa-router';
import csvtojson from 'csvtojson';
import fs from 'fs';
import transaction from '../models/transaction';

function getFileContent(path) {
  return new Promise((resolve, reject) => {
    const reader = fs.createReadStream(path, 'utf-8');
    let data = '';
    reader.on('data', (chunk) => data += chunk);
    reader.on('end', () => resolve(data));
    reader.on('error', (err) => reject(err))
  })
}

const route = new router({prefix: '/transactions'});

route.get('/', async (ctx) => {
  const {page, pageSize, sortBy, sortDir} = ctx.query;
  const queryPage = parseInt(page);
  const queryPageSize = parseInt(pageSize) || Number.MIN_SAFE_INTEGER;
  let queryOptions = {};
  if (queryPage) {
    queryOptions = {...queryOptions, page: queryPage};
  }
  if (queryPageSize) {
    queryOptions = {...queryOptions, limit: queryPageSize};
  }
  if (sortBy && sortDir) {
    queryOptions = {
      ...queryOptions,
      sort: {[sortBy]: sortDir}
    }
  }
  const query = transaction.paginate({}, queryOptions);
  ctx.body = await query;
});

route.get('/:id', async (ctx) => {
  const {id} = ctx.params;
  const query = transaction.findOne({id});
  const entity = await query.exec();
  if (entity) {
    ctx.body = entity;
  } else {
    ctx.throw(404, {message: 'Not found.'})
  }
});

route.post('/', async (ctx) => {
  const {body} = ctx.request;
  const entity = await transaction.create(body);
  ctx.body = entity;
});

route.post('/upload', async (ctx) => {
  const file = ctx.request.files.file;
  if (file.type === 'text/csv') {
    const data = await getFileContent(file.path);
    const jsonData = await csvtojson().fromString(data);
    try {
      const created = await transaction.insertMany(jsonData);
      ctx.body = created;
    } catch (e) {
      let messages = [];
      if (e.code === 11000 && e.message.includes('id')) {
        messages.push(`Transaction with id (${e.op.id}) already exists.`);
      }

      if (!messages.length) {
        messages = ['Invalid request.'];
      }

      ctx.throw(400, {messages});
      
    }
    
  } else {
    ctx.throw(415, {message: 'CSV only!'});
  }

});

route.patch('/:id', async (ctx) => {
  try {
    const created = await transaction.updateOne({id: parseInt(ctx.params.id, 10) }, ctx.request.body).exec();
    ctx.body = created;
  } catch (e) {
    ctx.throw(400, {message: 'Invalid request.'});
  }
  
});

route.delete('/', async (ctx) => {
  const { body } = ctx.request;
  if (body) {
    if (Array.isArray(body.ids) && body.ids.length) {
      const data = await transaction.deleteMany({id: {$in: body.ids}}).exec();
      ctx.body = data;
    } else {
      ctx.throw(400, {message: 'ids parameter must contain array with ids of transactions.'});
    }
  } else {
    ctx.throw(400, {message: 'ids parameter is required.'});
  }
});

route.delete('/:id', async (ctx) => {
  try {
    const data = await transaction.deleteOne({id: ctx.params.id}).exec();
    ctx.body = data;
  } catch(e) {
    ctx.throw(404, e);
  }
});


export default route;