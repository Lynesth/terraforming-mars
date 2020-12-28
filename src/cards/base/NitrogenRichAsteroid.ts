import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class NitrogenRichAsteroid implements IProjectCard {
    public cost = 31;
    public tags = [Tags.SPACE];
    public name = CardName.NITROGEN_RICH_ASTEROID;
    public cardType = CardType.EVENT;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, TRIncrease: 2, temperatureIncrease: 1});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      player.increaseTerraformRatingSteps(2, game);
      if (player.getTagCount(Tags.PLANT) < 3) {
        player.addProduction(Resources.PLANTS);
      } else {
        player.addProduction(Resources.PLANTS, 4);
      }
      return game.increaseTemperature(player, 1);
    }

    public metadata: CardMetadata = {
      cardNumber: '037',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.plants(1).nbsp.or().br;
          pb.plants(3).played.digit.colon().nbsp.plants(4).digit;
        }).br;
        b.tr(2).temperature(1);
      }),
      description: 'Raise your terraforming rating 2 steps and temperature 1 step. Increase your Plant production 1 step, or 4 steps if you have 3 Plant tags.',
    }
}
