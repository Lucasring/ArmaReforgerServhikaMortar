import App from './App.svelte';

console.log('App:', App)

App.mount({
  target: document.getElementById('app'),
  props: { /* your props */ }
});
