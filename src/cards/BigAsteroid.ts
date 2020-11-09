import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from "../CardName";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";
import { RemoveAnyPlants } from "../deferredActions/RemoveAnyPlants";
import { RedsPolicy, HowToAffordRedsPolicy, ActionDetails } from "../turmoil/RedsPolicy";

export class BigAsteroid implements IProjectCard {
    public cost = 27;
    public tags = [Tags.SPACE];
    public cardType = CardType.EVENT;
    public name = CardName.BIG_ASTEROID;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
            const actionDetails = new ActionDetails({ card: this, temperatureIncrease: 2 })
            this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, false, true);
            return this.howToAffordReds.canAfford;
        }

        return true;
    }

    public play(player: Player, game: Game) {
      player.howToAffordReds = this.howToAffordReds;
      game.increaseTemperature(player, 2);
      game.defer(new RemoveAnyPlants(player, game, 4));
      player.titanium += 4;
      return undefined;
    }
}
