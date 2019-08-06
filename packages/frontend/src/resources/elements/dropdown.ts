import { bindable, customElement } from 'aurelia-framework';

@customElement('dropdown')
export class Dropdown {
  @bindable label: string;

  @bindable itemsSource: string[];

  @bindable selectedItem: string;

  @bindable elementId: string;

  menuItemClicked(item: string) {
    this.selectedItem = item;
  }
}
