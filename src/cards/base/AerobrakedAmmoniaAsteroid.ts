import {ProjectCard} from '../Card';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class AerobrakedAmmoniaAsteroid extends ProjectCard {
  public cost = 26;
  public tags = [Tags.SPACE];
  public name = CardName.AEROBRAKED_AMMONIA_ASTEROID;
  public cardType = CardType.EVENT;

  public metadata: CardMetadata = {
    play: {
      productions: [
        {resource: Resources.HEAT, quantity: 3},
        {resource: Resources.PLANTS, quantity: 1},
      ],
      resources: [
        {resource: ResourceType.MICROBE, quantity: 2},
      ],
    },
    description: 'Increase your heat production 3 steps and your Plant productions 1 step. Add 2 Microbes to ANOTHER card.',
    cardNumber: '170',
    renderData: CardRenderer.builder((b) => {
      b.productionBox((pb) => {
        pb.heat(3).br;
        pb.plants(1);
      }).br;
      b.microbes(2).asterix();
    }),
  };
}
