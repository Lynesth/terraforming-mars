import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SoilFactory extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SOIL_FACTORY,
      tags: [Tags.BUILDING],
      cost: 9,
      hasRequirements: false,

      metadata: {
        cardNumber: '179',
        renderData: CardRenderer.builder((b) => {
          b.productionBox((pb) => {
            pb.minus().energy(1).br;
            pb.plus().plants(1);
          });
        }),
        description: 'Decrease your Energy production 1 step and increase your Plant production 1 step.',
        victoryPoints: 1,
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.PLANTS);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
