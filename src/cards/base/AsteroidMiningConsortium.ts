import {ProjectCard} from '../Card';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class AsteroidMiningConsortium extends ProjectCard {
  public cost = 13;
  public tags = [Tags.JOVIAN];
  public cardType = CardType.AUTOMATED;
  public name = CardName.ASTEROID_MINING_CONSORTIUM;

  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.TITANIUM) >= 1;
  }

  public getVictoryPoints() {
    return 1;
  }

  public metadata: CardMetadata = {
    play: {
      productions: [
        {resource: Resources.TITANIUM, quantity: -1, anyPlayer: true},
        {resource: Resources.TITANIUM, quantity: 1},
      ],
    },
    description: 'Requires that you have titanium production. Decrease any titanium production 1 step and increase your own 1 step.',
    cardNumber: '002',
    requirements: CardRequirements.builder((b) => b.production(Resources.TITANIUM)),
    renderData: CardRenderer.builder((b) => {
      b.productionBox((pb) => {
        pb.minus().titanium(-1).any.br;
        pb.plus().titanium(1);
      });
    }),
    victoryPoints: 1,
  };
}
