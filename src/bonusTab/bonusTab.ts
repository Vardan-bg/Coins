import { Component, Prop  } from 'vue-typed'
import Vue from 'vue'

@Component({
	props: ['order'],
	template: require('./bonusTab.html')
})
export class BonusTab extends Vue {
	@Prop({ type: String })
	title: string;
}