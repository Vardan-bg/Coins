import { Component, Prop  } from 'vue-typed'
import Vue from 'vue'
import startBus from '../events/StartBus'
@Component({
	props: ['order', 'active', 'start'],
	template: require('./startButtons.html')
})
export class StartButtons extends Vue {
	active: boolean;
	start: boolean;
	@Prop({ type: String })
	title: string;
	startGame(event){
		startBus.$emit('start-event');
	}
	cashOut(event){
		startBus.$emit('cashOut-event');
	}
}