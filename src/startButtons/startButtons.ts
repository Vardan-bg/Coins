import { Component, Prop  } from 'vue-typed'
import Vue from 'vue'

@Component({
	props: ['order'],
	template: require('./startButtons.html')
})
export class StartButtons extends Vue {
	@Prop({ type: String })
	title: string;
}