import { Component, Prop  } from 'vue-typed'
import Vue from 'vue'

@Component({
	props: ['order', 'gameStarted'],
	template: require('./coin.html'),
	watch: {
		gameStarted: function () {
			this.started = this.gameStarted;
			console.log(this.started, 'this.started');
		}
	}
})
export class Coin extends Vue {
	@Prop({ type: String })
	started: Boolean;
	// mounted(){
	// 	// let vm = this;      

 //  //       vm.$nextTick(function () {      
 //  //          console.log(vm.order);
 //  //       });
	// 	console.log(this.started,'gameStarted')
	// }
	// created(){
	// 	console.log(this.started,'gameStarted')
	// }
	// computed() {
	// 	console.log(this.started,'gameStarted')
 //  	}
 //  	@watch('gameStarted') 
	// 	onPropertyChanged(newVal, oldVal) { // watch it
 //      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
 //    }
	
}