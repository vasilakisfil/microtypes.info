import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('index', { path: '/' });
  this.route('content', { path: '/:url' });
  //this.route('why', { path: '/why' });
  //this.route('what', { path: '/what-is-a-microtype' });
  //this.route('available', { path: '/available-microtypes' });
  //this.route('playground', { path: '/playground' });
});

export default Router;
