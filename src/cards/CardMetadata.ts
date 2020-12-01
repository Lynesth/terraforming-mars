import {CardRenderer} from '../cards/render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from './render/CardRenderDynamicVictoryPoints';
import {ICardRenderDescription} from './render/ICardRenderDescription';
import {CardRequirements} from './CardRequirements';
import {Player} from '../Player';
import {Game} from '../Game';
import {Resources} from '../Resources';
import {ResourceType} from '../ResourceType';
import {Tags} from './Tags';
import {GlobalParameters} from '../GlobalParameters';

export interface MetadataEffects {
  productions?: ReadonlyArray<[
    resource: Resources,
    quantity?: number | ((player?: Player, game?: Game) => number),
    anyPlayer?: boolean,
  ]>,
  resources?: ReadonlyArray<[
    resource: Resources | ResourceType,
    quantity?: number | ((player?: Player, game?: Game) => number),
    anyPlayer?: boolean,
    ownCardsOnlyOrRestrictedTags?: boolean | Tags,
    mandatory?: boolean,
  ]>,
  globalParameters?: ReadonlyArray<[
    parameter: GlobalParameters,
    quantity?: number,
  ]>,
}

export interface CardMetadata {
  cardNumber: string;
  play?: MetadataEffects;
  description?: string | ICardRenderDescription;
  requirements?: CardRequirements;
  victoryPoints?: number | CardRenderDynamicVictoryPoints;
  renderData?: CardRenderer;
}
