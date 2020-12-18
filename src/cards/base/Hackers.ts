import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Hackers implements IProjectCard {
    public cost = 3;
    public tags = [];
    public name = CardName.HACKERS;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.ENERGY) >= 1;
    }

    public play(player: Player, game: Game) {
      game.defer(new DecreaseAnyProduction(player, game, Resources.MEGACREDITS, 2));
      player.addProduction(Resources.MEGACREDITS, 2);
      player.addProduction(Resources.ENERGY, -1);
      return undefined;
    }

    public getVictoryPoints() {
      return -1;
    }
    public metadata: CardMetadata = {
      cardNumber: '125',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().energy(1).megacredits(2).any.br;
          pb.plus().megacredits(2);
        });
      }),
      description: 'Decrease your energy production 1 step and any MC production 2 steps. increase your MC production 2 steps.',
      victoryPoints: -1,
    };
}

