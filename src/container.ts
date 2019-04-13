import { Component, Prop } from 'vue-typed'
import Vue from 'vue'
import { Coin } from './coin/coin'
import { BonusTab } from './bonusTab/bonusTab'
import { BetTab } from './betTab/betTab'
import { StartButtons } from './startButtons/startButtons'
import './styles/style.css';
import './styles/elements.scss';
import startBus from './events/StartBus'
import axios from 'axios';

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
	// @Prop({ type: Array, default: function () { return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20] }}) coins: Array<number>
	// options: any;

	sum: Number = 0;
	coins: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

	styleObject: any = "";
	startGame: boolean = false;
	bonusStarted: boolean = false;
	bonusCount: number = 0;
	counter: number = 0;
	cashout: any = "";
	startNumber: number = null;
	range: number = 6;
	win: boolean = false;
	host: string = '';

	mounted() {
		console.log(this.getHostName());
		this.host = this.getHostName();
		this.initResize();
		window.addEventListener('resize', this.initResize)
		startBus.$on('start-event', this.startEventHandler)
		startBus.$on('cashOut-event', this.cashOutEventHandler)
		startBus.$on('startBonus-event', this.startBonusEventHandler)
	}
	getHostName(): string {
		const hostName = window.location.hostname;
		const port = window.location.port;
		return hostName + ':' + port;
	}
	getValue(value) {
		console.log(value, 'value');
		this.counter++;
		this.sum += value;
		if (this.counter > 2) {
			this.stopGame();
			if (this.bonusStarted) {
				this.bonusCount++;
				console.log(this.bonusCount, 'bonusCount');
			}
		}
		this.win = this.sum <= this.startNumber + 5 && this.sum >= this.startNumber;
		console.log(this.counter, value, this.sum, this.win);
	}

	startBonusEventHandler() {
		if (!this.startGame && !this.bonusStarted) {
			this.startingGame();
			this.bonusStarted = true;
			this.bonusCount = 0;
		}
	}

	cashOutEventHandler() {
		if (this.counter == 2) {
			this.counter = 0;
			console.log('cashOut', this.counter);
			this.stopGame();
		}
	}

	stopGame() {
		this.startGame = false;
		console.log
	}

	startEventHandler() {
		if (!this.startGame) {
			this.startingGame();
			// this.getRange();
		}
	}
	startingGame() {
		let host = this.getHostName();
		this.startGame = true;
		this.counter = 0;
		axios.post(`http://localhost:58272/api/Game/StartGame`)
			// axios.post(`http://${host}/api/Game/StartGame`)
			.then(response => {
				console.log('test', response.data);
				console.log('start');
				this.sum = 0;
				this.startNumber = +response.data.Range.split(" ", 1)[0];
			})
			.catch(e => {
				console.log('test2', e)
			});
	}
	getRange() {
		this.startNumber = Math.floor(Math.random() * 10) + 15;
		console.log('startNumber', this.startNumber);
	}
	initResize() {

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