import { Component, Prop  } from 'vue-typed'
import Vue from 'vue'

@Component({
	props: ['order', 'gameStarted'],
	template: require('./coin.html'),
	watch: {
		gameStarted: function (after, before) {
			this.started = this.gameStarted;
			
			this.styleObject = {
				"pointer-events": "all",
				"animation-name": "inherit"
			};
			if (!before && after){
				this.isActive = false;
			}
		}
	}
})
export class Coin extends Vue {

	isActive: boolean = false;
	styleObject: any = "";
	started: boolean = false;

	mounted(){
		console.log(this.started);
	}
	flip(event){
		console.log('flip')
		this.styleObject = {
			"pointer-events": "none"
		};
		this.isActive = true;
		const value = Math.floor(Math.random() * 20) + 1;

		this.$emit('clicked', value)
	}
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