import {ProjectCard} from '../Card';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class BuildingIndustries extends ProjectCard {
    public cost = 6;
    public tags = [Tags.STEEL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.BUILDING_INDUSTRIES;

    public metadata: CardMetadata = {
      play: {
        productions: [
          {resource: Resources.ENERGY, quantity: -1},
          {resource: Resources.STEEL, quantity: 2},
        ],
      },
      cardNumber: '065',
      description: 'Decrease your Energy production 1 step and increase your steel production 2 steps.',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().energy(1).br;
          pb.plus().steel(2);
        });
      }),
    };
}
