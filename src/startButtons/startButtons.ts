import { Component, Prop  } from 'vue-typed'
import Vue from 'vue'
import startBus from '../events/StartBus'
@Component({
	props: ['order'],
	template: require('./startButtons.html')
})
export class StartButtons extends Vue {
	@Prop({ type: String })
	title: string;
	startGame(event){
		startBus.$emit('start-event');
	}
}