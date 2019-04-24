import { Component, Prop  } from 'vue-typed'
import Vue from 'vue'
import startBus from '../events/StartBus'

@Component({
	props: ['bonusGames', 'isActive'],
	template: require('./bonusTab.html'),
	watch: {
		bonusGames: {
			handler (after, before) {
				console.log(after, before, ' changedArray')
			}
		}
	}
})
export class BonusTab extends Vue {
	bonusGames: Array<boolean>;
	startBonusGame(event){
		startBus.$emit('startBonus-event', this.bonusGames);
	}
}