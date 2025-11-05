const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withGoogleMapsApiKey(config, apiKey) {
  return withAndroidManifest(config, (config) => {
    const app = config.modResults.manifest.application[0];
    if (!app['meta-data']) app['meta-data'] = [];

    app['meta-data'].push({
      $: {
        'android:name': 'com.google.android.geo.API_KEY',
        'android:value': 'AIzaSyCcm7_Wd7uvmC9YnYLu2JHGWPt6z1MaL1E',
      },
    });
    return config;
  });
};
