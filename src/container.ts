import { Component, Prop  } from 'vue-typed'
import Vue from 'vue'
import { Coin } from './coin/coin'
import { BonusTab } from './bonusTab/bonusTab'
import { BetTab } from './betTab/betTab'
import { StartButtons } from './startButtons/startButtons'
import './styles/style.css';
import startBus from './events/StartBus'

Vue.component('coin', Coin)
Vue.component('bonusTab', BonusTab)
Vue.component('betTab', BetTab)
Vue.component('startButtons', StartButtons)

@Component({
	template: require('./container.html')
})
export class Container extends Vue {
	@Prop({ type: String })
	title: string;
	@Prop({ type: Array, default: function () { return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20] }}) coins: Array<number>
	options: any;

	sum: Number = 0;

	styleObject: any = "";
	startGame: boolean = false;
	counter: number = 0;
	stop: any = "";

	mounted() {
		this.initResize();
		window.addEventListener('resize', this.initResize)
		startBus.$on('start-event', this.startEventHandler)
	}

	getValue(value){
		this.counter ++;
		this.sum += value;
		if(this.counter > 2){
			this.stop = {
				"pointer-events": "none"
			}
			this.startGame = false;
		}
		console.log(this.counter, value, this.sum);
	}

	startEventHandler(){
		if(!this.startGame){
			console.log('start');
			this.startGame = true;
			this.sum = 0;
			this.stop = {
				"pointer-events": "inherit"
			}
			this.counter = 0;
		}
}
	initResize () {

	    var options = {
	        height: document.documentElement.clientHeight,
	        width: document.documentElement.clientWidth
	    }
	    if (this.isGameResizable(options)) {
	        this.resizeGame(options)
	    } else {
	        this.resizeGame();
	    }
    }

	gameScreenSizes() {
	    return {
	        height: 1080,
	        width: 1754
	    }
	}
	resizeGame(options: any = {}) {
	   
	    var settings = options || {};
	    var defaults = this.gameScreenSizes();

	    var windowHeight = settings.height || defaults.height;
	    var windowWidth = settings.width || defaults.width;

	    var scale = Math.min(
	        windowHeight / defaults.height,
	        windowWidth / defaults.width
	    );
	    this.styleObject = {
	    	'-webkit-transform': 'scale(' + scale + ')',
	        '-moz-transform': 'scale(' + scale + ')',
	        '-ms-transform': 'scale(' + scale + ')',
	        '-o-transform': 'scale(' + scale + ')',
	        'transform': 'scale(' + scale + ')'
	    }
	}

	isGameResizable(options) {
	    var settings = options || {};
	    var defaults = this.gameScreenSizes();
	    var isResizable = false;

	    if (
	        settings.width <= defaults.width ||
	        settings.height <= defaults.height
	    ) {
	        isResizable = true;
	    }

	    return isResizable;
	}
}