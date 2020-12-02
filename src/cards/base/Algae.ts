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

export class Algae extends ProjectCard {
  public cost = 10;
  public tags = [Tags.PLANT];
  public name = CardName.ALGAE;
  public cardType = CardType.AUTOMATED;
  public canPlay(player: Player, game: Game): boolean {
    return game.board.getOceansOnBoard() >= 5 - player.getRequirementsBonus(game);
  }

  public metadata: CardMetadata = {
    play: {
      productions: [
        {resource: Resources.PLANTS, quantity: 2},
      ],
      resources: [
        {resource: Resources.PLANTS, quantity: 1},
      ],
    },
    description: 'Requires 5 ocean tiles. Gain 1 Plant and increase your Plant production 2 steps.',
    cardNumber: '047',
    requirements: CardRequirements.builder((b) => b.oceans(5)),
    renderData: CardRenderer.builder((b) => b.productionBox((pb) => pb.plants(2)).plants(1)),
  };
}
