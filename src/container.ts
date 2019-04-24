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
	bonusCount: Array<boolean> = [];
	counter: number = 0;
	cashout: any = "";
	startNumber: number = null;
	range: number = 5;
	win: boolean = false;
	host: string = '';
	betValue: number = 100;
	total: number = 1000000;

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
		const hostName = 'localhost' || window.location.hostname;
		const port = 53599 || window.location.port;
		return hostName + ':' + port;
	}
	getValue(value) {
		console.log(value, 'value');
		this.counter++;
		this.sum += value;
		if (this.counter > 2) {
			this.win = this.sum <= this.startNumber + this.range && this.sum >= this.startNumber;
			this.stopGame();
			if (this.bonusStarted) {
				this.bonusCount.push(this.win);
				if (this.bonusCount.length == 5) {
					this.bonusStarted = false;
				}
			}
		}
		console.log(this.total, this.betValue, 'stats');
		if (this.win)
			this.total += +this.betValue * 3;
		console.log(this.counter, value, this.sum, this.win);
	}

	startBonusEventHandler(bonusGames) {
		if (!this.startGame && !this.bonusStarted) {
			this.startingGame();
			this.bonusStarted = true;
			this.bonusCount = [];
			console.log(this.bonusCount, '5');
		}
	}

	cashOutEventHandler() {
		if (this.counter == 2 && this.sum >= this.startNumber && this.sum <= this.startNumber + this.range) {
			this.counter = 0;
			this.total += +this.betValue;
			console.log('cashOut', this.counter);
			this.stopGame();
		}
	}

	stopGame() {
		this.startGame = false;
		console.log
	}

	startEventHandler() {
		if (!this.startGame && this.betValue > 0) {
			this.total -= this.betValue;
			this.startingGame();
			//this.getRange();
		}
	}
	startingGame() {
		let host = this.getHostName();
		axios.post(`http://${host}/api/Game/StartGame`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(response => {
			console.log('test', response.data);
			console.log('start');
			this.win = false;
			this.startGame = true;
			this.sum = 0;
			this.counter = 0;
			this.startNumber = +response.data.Range.split(" ", 1)[0];
		})
		.catch(e => {
			console.log('test2', e)
		});
	}
	getRange() {
		this.win = false;
		this.startGame = true;
		this.sum = 0;
		this.counter = 0;
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
/*
send betAmount to startgame api call and if game is bonus or not
get coin number Value on click.
on cashout check if i can cashout then give fixed total value
initial call on open page to get: current Cash; if game is in progress in which stage it is
	(current bet, current top range values, coins opened - their values and positions, bonus game stages, their results)
 */