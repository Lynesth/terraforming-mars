
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Soletta implements IProjectCard {
    public cost: number = 35;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Soletta";
    public text: string = "Increase your heat production 7 steps";
    public description: string = "Huge ultra-thin mirrors focusing sunlight onto the red planet.";
    public play(player: Player, _game: Game): Promise<void> {
        player.heatProduction += 7;
        return Promise.resolve();
    }
}