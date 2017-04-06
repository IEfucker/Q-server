'use strict';

import mongoose from 'mongoose'
import compose from 'koa-compose';
import Router from 'koa-router';
import importDir from 'import-dir';

// Config mongonose, use native promises
mongoose.Promise = global.Promise;

// const routerConfigs = [{ folder: 'base', prefix: '' }, { folder: 'api', prefix: '/api' }];
const routerConfigs = [{ folder: 'api/v1', prefix: '/api' }];

export default function routes() {
  const composed = routerConfigs.reduce((prev, curr) => {
    const routes = importDir('./' + curr.folder);
    const router = new Router({
      prefix: curr.prefix
    });

    Object.keys(routes).map(name => routes[name](router));

    return [router.routes(), router.allowedMethods(), ...prev];
  }, []);

  return compose(composed);
}