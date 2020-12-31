import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class VoteOfNoConfidence implements IProjectCard {
    public cost = 5;
    public tags = [];
    public name = CardName.VOTE_OF_NO_CONFIDENCE;
    public cardType = CardType.EVENT;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil === undefined ||
        game.turmoil.chairman !== 'NEUTRAL' ||
        game.turmoil.hasAvailableDelegates(player.id) === false ||
        game.turmoil.parties.some((party) => party.partyLeader === player.id) === false) {
        return false;
      }

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, TRIncrease: 1});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      if (game.turmoil !== undefined) {
            game.turmoil.chairman! = player.id;
            const index = game.turmoil.delegateReserve.indexOf(player.id);
            if (index > -1) {
              game.turmoil.delegateReserve.splice(index, 1);
            }
            player.increaseTerraformRating(game);
      }
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'T16',
      requirements: CardRequirements.builder((b) => b.partyLeaders()),
      renderData: CardRenderer.builder((b) => {
        b.chairman().any.asterix().nbsp.partyLeaders().br;
        b.tr(1);
      }),
      description: 'Requires that you have a Party Leader in any party and that the sitting Chairman is neutral. Remove the NEUTRAL Chairman and move your own delegate (from the reserve) there instead. Gain 1 TR.',
    }
}
