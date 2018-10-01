import { Component, Prop  } from 'vue-typed'
import Vue from 'vue'

@Component({
	props: ['order'],
	template: require('./betTab.html')
})
export class BetTab extends Vue {
	@Prop({ type: String })
	title: string;
}