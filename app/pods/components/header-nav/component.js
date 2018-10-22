import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';

export default class NavbarMenuComponent extends Component {
  @computed('isActive')
  get isActiveClass() {
    return this.get('isActive') ? 'is-active' : '';
  }

  @computed('model')
  get links() {
    return this.get('model').files.filter(
      s => !s.attributes.excludeNav
    ).sort(
      (a,b) => a.attributes.index - b.attributes.index
    ).map(
      s => ({
        path: s.path.split('/')[1], name: s.attributes.linkName
      })
    )
  }

  @action
  showMenu() {
    this.toggleProperty('isActive');
  }
}
