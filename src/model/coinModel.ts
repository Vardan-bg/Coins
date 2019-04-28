import { GameModel } from './gameModel'
export class CoinModel {
    public Id: number;

    public GameId: number;

    public Game: GameModel;

    public Position: number;

    public value: number;

    public IsOpened: boolean;
}