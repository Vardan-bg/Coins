import { Component, Prop } from 'vue-typed'
import Vue from 'vue'
import startBus from './../events/StartBus'
import { sortBy, forIn } from 'lodash';
import axios from 'axios';
import { headers, getHostName } from './../config'

@Component({
	props: ['order', 'gameStarted', 'value'],
	template: require('./coin.html'),
	watch: {
		gameStarted: {
			handler(after, before) {
				this.started = this.gameStarted;
				if (this.gameStarted) {
					this.printedValue = 0;
				}
				this.styleObject = {
					"pointer-events": "all",
					"animation-name": "inherit"
				};
				if (after < before) {
					this.styleObject = {
						"pointer-events": "none",
						"animation-name": "inherit"
					}
				}
				if (before < after) {
					this.isActive = false;
				}
			}
		},
		value: {
			handler(after, before) {
				this.printedValue = after;
				this.isActive = true;
				console.log('handler', after);
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
	value: number;
	printedValue: number = 0;
	host: string;
	headers: any;

	mounted() {
		this.printedValue = this.order;
		console.log(this.started, 'test');
		//this.value = this.order;
		startBus.$on('start-event', this.startEventHandler);
		this.host = getHostName();
		this.headers = headers;
	}

	startEventHandler() {
		console.log('coin start event');
	}
	flip(event) {
		this.styleObject = {
			"pointer-events": "none"
		};
		this.$emit('clicked', this.order);
		// axios.post(`http://${this.host}/api/Game/getcoin`, {Position: this.order}, this.headers)
		// 	.then(response => {
		// 		console.log('response', response);
		// 		this.isActive = true;
		// 		this.value = response.data.value;
		// 		//this.value = this.getOrder();
		// 	})
		// 	.catch(e => {
		// 		console.log('test2', e)
		// 	});
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