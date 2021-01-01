import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class CometForVenus implements IProjectCard {
    public cost = 11;
    public tags = [Tags.SPACE];
    public name = CardName.COMET_FOR_VENUS;
    public cardType = CardType.EVENT;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, venusIncrease: 1});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, false, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      const venusTagPlayers = game.getPlayers().filter((otherPlayer) => otherPlayer.id !== player.id && otherPlayer.getTagCount(Tags.VENUS, false, false) > 0);

      if (game.isSoloMode()|| venusTagPlayers.length === 0) {
        game.increaseVenusScaleLevel(player, 1);
        return undefined;
      }

      if (venusTagPlayers.length === 1) {
        venusTagPlayers[0].setResource(Resources.MEGACREDITS, -4, game, player);
        game.increaseVenusScaleLevel(player, 1);
        return undefined;
      }

      return new SelectPlayer(
        venusTagPlayers,
        'Select player to remove up to 4 mega credits from',
        'Remove MC',
        (selectedPlayer: Player) => {
          selectedPlayer.setResource(Resources.MEGACREDITS, -4, game, player);
          game.increaseVenusScaleLevel(player, 1);
          return undefined;
        },
      );
    }
    public metadata: CardMetadata = {
      description: 'Raise Venus 1 step. Remove up to 4MC from any player WITH A VENUS TAG IN PLAY.',
      cardNumber: '218',
      renderData: CardRenderer.builder((b) => {
        b.venus(1).nbsp.nbsp.minus().megacredits(4).secondaryTag(Tags.VENUS).any;
      }),
    };
}
