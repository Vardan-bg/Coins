import { Component, Prop  } from 'vue-typed'
import Vue from 'vue'

@Component({
	props: ['order'],
	template: require('./betTab.html')
})
export class BetTab extends Vue {
	@Prop({ type: String })
	title: string;
	betAmount: number = 0;
	changeBet(value: number){
		if (+this.betAmount + value >= 0){
			this.betAmount = +this.betAmount + value;
		}
		//startBus.$emit('start-event');
	}
}