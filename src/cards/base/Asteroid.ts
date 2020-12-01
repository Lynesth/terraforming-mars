import {ProjectCard} from '../Card';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameters} from '../../GlobalParameters';
import {Resources} from '../../Resources';

export class Asteroid extends ProjectCard {
  public cost = 14;
  public tags = [Tags.SPACE];
  public name = CardName.ASTEROID;
  public cardType = CardType.EVENT;
  public hasRequirements = false;

  public canPlay(player: Player, game: Game): boolean {
    const temperatureMaxed = game.getVenusScaleLevel() === MAX_TEMPERATURE;
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !temperatureMaxed) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, true);
    }

    return true;
  }

  public metadata: CardMetadata = {
    play: {
      globalParameters: [
        [GlobalParameters.TEMPERATURE],
      ],
      resources: [
        [Resources.TITANIUM, 2],
        [Resources.PLANTS, -3, true],
      ],
    },
    description: 'Raise temperature 1 step and gain 2 titanium. Remove up to 3 Plants from any player.',
    cardNumber: '009',
    renderData: CardRenderer.builder((b) => {
      b.temperature(1).br;
      b.titanium(2).br;
      b.minus().plants(-3).any;
    }),
  };
}
