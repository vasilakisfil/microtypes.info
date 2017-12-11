import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    //if (!params.url) { params.url = '/'; }
    return this.modelFor('application').findBy('url', params.url);
  }
});
