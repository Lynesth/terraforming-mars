import {ProjectCard} from '../Card';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class ArchaeBacteria extends ProjectCard {
  public cost = 6;
  public tags = [Tags.MICROBES];
  public name = CardName.ARCHAEBACTERIA;
  public cardType = CardType.AUTOMATED;
  public canPlay(player: Player, game: Game): boolean {
    return game.getTemperature() <= -18 + player.getRequirementsBonus(game) * 2;
  }

  public metadata: CardMetadata = {
    play: {
      productions: [
        {resource: Resources.PLANTS, quantity: 1},
      ],
    },
    description: 'It must be -18 C or colder. Increase your Plant production 1 step.',
    cardNumber: '042',
    requirements: CardRequirements.builder((b) => b.temperature(-18).max()),
    renderData: CardRenderer.builder((b) => b.productionBox((pb) => pb.plants(1))),
  };
}
