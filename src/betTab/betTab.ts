import { Component, Prop  } from 'vue-typed'
import Vue from 'vue'

@Component({
	props: ['order', 'start'],
	template: require('./betTab.html'),
	watch: {
		betAmount: {
			handler (after, before) {
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
	changeBet(value: number){
		if (+this.betAmount + value >= 0){
			this.betAmount = +this.betAmount + value;
		}
		//startBus.$emit('start-event');
	}
}