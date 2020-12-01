import {ProjectCard} from '../Card';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class AcquiredCompany extends ProjectCard {
  public cost = 10;
  public tags = [Tags.EARTH];
  public name = CardName.ACQUIRED_COMPANY;
  public cardType = CardType.AUTOMATED;

  public metadata: CardMetadata = {
    play: {
      productions: [
        [Resources.MEGACREDITS, 3],
      ],
    },
    description: 'Increase your MC production 3 steps.',
    cardNumber: '106',
    renderData: CardRenderer.builder((b) => b.productionBox((pb) => pb.megacredits(3))),
  };
}
