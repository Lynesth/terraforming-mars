import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {IProjectCard} from '../IProjectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {CardType} from '../CardType';


export class Recyclon implements CorporationCard, IResourceCard {
    public name = CardName.RECYCLON;
    public tags = [Tags.MICROBES, Tags.STEEL];
    public startingMegaCredits: number = 38;
    public resourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public cardType = CardType.CORPORATION;

    public play(player: Player) {
      player.addProduction(Resources.STEEL);
      player.addResourceTo(this);
      return undefined;
    }
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
      if (card.tags.indexOf(Tags.STEEL) === -1 || !player.isCorporation(this.name)) {
        return undefined;
      }
      if (this.resourceCount < 2) {
        player.addResourceTo(this);
        return undefined;
      }

      const addResource = new SelectOption('Add a microbe resource to this card', 'Add microbe', () => {
        player.addResourceTo(this);
        return undefined;
      });

      const spendResource = new SelectOption('Remove 2 microbes on this card and increase plant production 1 step', 'Remove microbes', () => {
        player.removeResourceFrom(this, 2);
        player.addProduction(Resources.PLANTS);
        return undefined;
      });
      return new OrOptions(spendResource, addResource);
    }
}
