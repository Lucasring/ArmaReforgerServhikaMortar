import App from './App.svelte';

console.log('App:', App); // should log an OBJECT with a .mount method

App.mount({
  target: document.getElementById('app'),
  props: {}
});
