import DS from 'ember-data';
import { camelize } from '@ember/string';

export default DS.JSONAPISerializer.extend({
  keyForAttribute(attr, method) {
    return camelize(attr);
  }
});
