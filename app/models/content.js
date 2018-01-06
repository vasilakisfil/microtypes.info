import Content from 'ember-cli-markdown-as-json/models/content';
import { computed } from 'ember-decorators/object';

export default Content.extend({
  @computed('url')
  get isIndex() {
    return !this.get('url') || this.get('url') === '/';
  }
})
