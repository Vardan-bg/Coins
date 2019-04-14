import { Component, Prop  } from 'vue-typed'
import Vue from 'vue'
import startBus from './../events/StartBus'
import {sortBy, forIn} from 'lodash';

@Component({
	props: ['order', 'gameStarted'],
	template: require('./coin.html'),
	watch: {
		gameStarted: {
			handler (after, before) {
				this.started = this.gameStarted;
				if (this.gameStarted) {
					this.value = 0;
				}
				this.styleObject = {
					"pointer-events": "all",
					"animation-name": "inherit"
				};
				if(after < before){
					this.styleObject ={
						"pointer-events": "none",
					"animation-name": "inherit"
					}
				}
				if (before < after){
					this.isActive = false;
				}
			}
		}
	}
})
export class Coin extends Vue {

	isActive: boolean = false;
	styleObject: any = "";
	started: boolean = false;
	order: number;
	values: Array<number> = [];
	value: number = 0;

	mounted(){
		console.log(this.started, 'test');
		//this.value = this.order;
		startBus.$on('start-event', this.startEventHandler)
	}

	startEventHandler(){
		console.log('coin start event');
	}
	flip(event){
		this.styleObject = {
			"pointer-events": "none"
		};
		this.isActive = true;
		this.value = Math.floor(Math.random() * 20) + 1;
		//this.value = this.getOrder();
		this.$emit('clicked', this.value)
	}

	getOrder(){
		return this.values[this.order];
	}
	getCoins() {
		let arr = [];
		for (let i = 1; i < 21; i++) {
			let rand = Math.floor(Math.random() * 200000) + 1;
			arr.push({'value': rand, 'key': i});
		}
		let sorted = sortBy(arr, (node) => node.value)
		Object.keys(arr).reduce((obj, key) => (obj[arr[key]] = key, obj), {});
		let final = [];
		forIn(sorted, (value, key) => {final[key] = value.key})
		return final;
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