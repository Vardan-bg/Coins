import Vue from 'vue'
import { Component } from 'vue-typed'
import { Container } from './container'

Vue.component('app-container', Container)

@Component({
	template: '<app-container title="My App"></app-container>'
})
class App extends Vue {	
	msg = 'there'
}

new App().$mount('#app');

