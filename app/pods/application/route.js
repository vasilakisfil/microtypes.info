import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject } from '@ember/service';

export default Route.extend({
  markdownResolver: inject(),

  model() {
    return get(this, 'markdownResolver').tree('content');
  }
});

