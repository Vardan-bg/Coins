import { Component, Prop } from 'vue-typed'
import Vue from 'vue'

@Component({
	props: ['order', 'start'],
	template: require('./betTab.html'),
	watch: {
		betAmount: {
			handler(after, before) {
				this.$emit('changeBet', this.betAmount);
			}
		}
	}
})
export class BetTab extends Vue {
	@Prop({ type: String })
	title: string;
	start: boolean;
	betAmount: number = 100;
	changeBet(value: number) {
		if (+this.betAmount + value >= 0) {
			this.betAmount = +this.betAmount + value;
		}
		//startBus.$emit('start-event');
	}
	onKeyDown(event) {
		// Allow: backspace, delete, tab, escape, enter and .
		if ([46, 8, 9, 27, 13, 110].indexOf(event.keyCode) !== -1 ||
			// Allow: Ctrl+A
			(event.keyCode == 65 && event.ctrlKey === true) ||
			// Allow: Ctrl+A
			(event.keyCode == 70 && event.ctrlKey === true) ||
			// Allow: Ctrl+A
			(event.keyCode == 82 && event.ctrlKey === true) ||
			// Allow: home, end, left, right
			(event.keyCode >= 35 && event.keyCode <= 39)) {
			// let it happen, don't do anything
			return;
		}
		// Ensure that it is a number and stop the keypress
		if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
			event.preventDefault();
		}
	}
}