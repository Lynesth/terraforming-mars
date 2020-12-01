import {ProjectCard} from '../Card';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class AdaptedLichen extends ProjectCard {
  public cost = 9;
  public tags = [Tags.PLANT];
  public cardType = CardType.AUTOMATED;
  public name = CardName.ADAPTED_LICHEN;

  public metadata: CardMetadata = {
    play: {
      productions: [
        [Resources.PLANTS],
      ],
    },
    description: 'Increase your Plant production 1 step.',
    cardNumber: '048',
    renderData: CardRenderer.builder((b) => b.productionBox((pb) => pb.plants(1))),
  };
}
