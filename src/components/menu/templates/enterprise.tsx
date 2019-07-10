import { h } from '@stencil/core';

export default () => <docs-nav items={ items } />;

const items = {
  'Community Edition': '/docs/native/overview',
  'Enterprise Edition': '/docs/enterprise',
  '認証とセキュリティ': {
    'Auth Connect': '/docs/enterprise/auth-connect',
    'Identity Vault': '/docs/enterprise/identity-vault',
  },
  '一般的なデバイス機能': {
    'Android Permissions': '/docs/enterprise/android-permissions',
    'App Version': '/docs/enterprise/appversion',
    'Badge': '/docs/enterprise/badge',
    'Browser': '/docs/enterprise/inappbrowser',
    'Calendar': '/docs/enterprise/calendar',
    'Camera': '/docs/enterprise/camera',
    'Clipboard': '/docs/enterprise/clipboard',
    'Device': '/docs/enterprise/device',
    'Dialogs': '/docs/enterprise/dialogs',
    'Email Composer': '/docs/enterprise/email-composer',
    'Filesystem': '/docs/enterprise/filesystem',
    'Geolocation': '/docs/enterprise/geolocation',
    'Haptics & Vibration': '/docs/enterprise/vibration',
    'Media': '/docs/enterprise/media',
    'Media Capture': '/docs/enterprise/media-capture',
    'Native Storage': '/docs/enterprise/nativestorage',
    'Network Information': '/docs/enterprise/network-information',
    'Screen Orientation': '/docs/enterprise/screen-orientation',
    'Splashscreen': '/docs/enterprise/splashscreen',
    'Statusbar': '/docs/enterprise/statusbar',
  },
  '統合サービス': {
    'Active Directory': 'https://ionicframework.com/integrations/ms-activedirectory-ms-adal',
    'mParticle': '/docs/enterprise/mparticle',
  },
  'オフラインデータ': {
    'Couchbase Lite': 'https://ionicframework.com/integrations/couchbase-lite',
    'Offline Support': 'https://ionicframework.com/integrations/couchbase-lite',
  },
  '支払い': {
    'Apple Payment Pass': '/docs/enterprise/apple-payment-pass',
  },
};
