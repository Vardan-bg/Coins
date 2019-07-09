import { Component, Prop } from 'vue-typed'
import Vue from 'vue'
import { Coin } from './coin/coin'
import { BonusTab } from './bonusTab/bonusTab'
import { BetTab } from './betTab/betTab'
import { StartButtons } from './startButtons/startButtons'
import './styles/style.css';
import './styles/elements.scss';
import startBus from './events/StartBus';
import axios from 'axios';
import { GameModel } from './model/gameModel';
import { headers, getHostName } from './config'


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
	coins: Array<any> = [];

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
	headers: any = headers;
	game: GameModel = new GameModel;
	response: GameModel = new GameModel;
	gameResult: any = '';

	mounted() {
		for (let index = 1; index <= 20; index++) {
			this.coins.push({ order: index, value: 0 });
		}
		this.host = getHostName();
		this.initResize();
		window.addEventListener('resize', this.initResize);
		startBus.$on('start-event', this.startEventHandler);
		startBus.$on('cashOut-event', this.cashOutEventHandler);
		startBus.$on('startBonus-event', this.startBonusEventHandler);
		axios.get(`http://${this.host}/api/Game/GetGame`, this.headers)
			.then(response => {
				if(response.data) {
					this.total = response.data.balance;
					// this.response = response.data;
					// this.mapState(response.data);
				}
			})
			.catch(e => {
				console.log('test2', e)
			});
	}
	mapState(response) {
		this.betValue = (response.bet) ? response.bet : 100;
		this.startGame = !response.isEnded;
		this.bonusStarted = response.isBonusGame;
		if (this.bonusStarted) {
			this.bonusCount.push(response.isWin);
		}
		this.total = response.userBalance;
		if (this.startGame) {
			this.startNumber = response.startRange;
			this.range = +response.endRange - response.startRange;
			for (let index = 0; index < response.coins.length; index++) {
				this.coins[response.coins[index].position - 1]['value'] = response.coins[index].value;
				this.counter++;
				this.sum += response.coins[index].value;
				console.log('this.counter', this.counter);
				if (this.counter > 2) {
					this.win = this.sum <= response.endRange && this.sum >= response.startRange;
				}
			}
		}
	}

	request() {

	}
	getValue(order) {
		axios.post(`http://${this.host}/api/Game/getcoin`, { Position: order, GameId: this.response.id }, this.headers)
			.then(response => {
				this.response = response.data.game;
				this.coins[order - 1]['value'] = response.data.value;
				let value = response.data.value;
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
				if (this.win)
					this.total += +this.betValue * 3;
			})
			.catch(e => {
				console.log('test2', e)
			});
	}

	startBonusEventHandler(bonusGames) {
		if (!this.startGame && !this.bonusStarted) {
			// this.startingGame();
			this.bonusStarted = true;
		} else if (!this.startGame && this.bonusStarted) {
			this.bonusStarted = false;
		}
	}

	cashOutEventHandler() {
		if (this.counter == 2 && this.sum >= this.startNumber && this.sum <= this.startNumber + this.range && !this.bonusStarted) {
			axios.post(`http://${this.host}/api/Game/CashBack`, this.response, this.headers)
				.then(response => {
					this.counter = 0;
					this.total += +this.betValue;
					this.stopGame();
				})
				.catch(e => {
					console.log('test2', e)
				});
		}
	}

	stopGame() {
		this.startGame = false;
		this.gameResult = (this.win) ? this.betValue * 3 : '';
	}

	startEventHandler() {
		if (!this.startGame && this.betValue > 0) {
			this.total -= this.betValue;
			if(this.bonusCount.length == 5) {
				this.bonusCount = [];
			}
			this.startingGame();
			//this.getRange();
		}
	}
	startingGame() {
		for (let index = 1; index <= 20; index++) {
			this.coins[index - 1]['value'] = 0;
		}
		this.game.Bet = this.betValue;
		this.game.IsBonusGame = this.bonusStarted;
		axios.post(`http://${this.host}/api/Game/StartGame`, this.game, this.headers)
			.then(response => {
				this.response = response.data;
				this.win = false;
				this.startGame = true;
				this.gameResult = '';
				this.sum = 0;
				this.counter = 0;
				this.startNumber = +response.data.startRange;
				this.range = +response.data.endRange - response.data.startRange;
				this.response = response.data;
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