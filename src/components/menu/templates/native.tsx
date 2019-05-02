import plugins from '../data/native-plugins.json';

export default () => <docs-nav items={items}/>;

const items = {
  'Community Edition': '/docs/native/overview',
  'Enterprise Edition': '/docs/enterprise',
  'Community Plugins': Object.entries(plugins).sort()
};
