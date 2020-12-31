import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class IceAsteroid implements IProjectCard {
    public cost = 23;
    public tags = [Tags.SPACE];
    public cardType = CardType.EVENT;
    public name = CardName.ICE_ASTEROID;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, oceansToPlace: 2, oceansAvailableSpaces: game.board.getAvailableSpacesForOcean(player)});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, false, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.defer(new PlaceOceanTile(player, game, 'Select space for first ocean'));
      game.defer(new PlaceOceanTile(player, game, 'Select space for second ocean'));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '078',
      renderData: CardRenderer.builder((b) => b.oceans(2)),
      description: 'Place 2 ocean tiles.',
    }
}
