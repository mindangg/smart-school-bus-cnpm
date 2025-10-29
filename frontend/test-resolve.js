try {
  const mapglPath = require.resolve('react-map-gl');
  console.log('OK: react-map-gl resolved to:', mapglPath);

  const mapboxPath = require.resolve('mapbox-gl');
  console.log('OK: mapbox-gl resolved to:', mapboxPath);

  console.log('\nNode.js can find the modules correctly.');

} catch (e) {
  console.error('\nERROR: Node.js failed to resolve the module:');
  console.error(e);
}