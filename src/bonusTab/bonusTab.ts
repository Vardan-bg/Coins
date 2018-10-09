import { Component, Prop  } from 'vue-typed'
import Vue from 'vue'
import startBus from '../events/StartBus'

@Component({
	props: ['order'],
	template: require('./bonusTab.html')
})
export class BonusTab extends Vue {
	startBonusGame(event){
		startBus.$emit('startBonus-event');
	}
}