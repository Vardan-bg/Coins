import { Component, Prop  } from 'vue-typed'
import Vue from 'vue'

@Component({
	props: ['order'],
	template: require('./coin.html')
})
export class Coin extends Vue {
	@Prop({ type: String })
	title: string;
}