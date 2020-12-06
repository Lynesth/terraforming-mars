import {CardRenderer} from '../cards/render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from './render/CardRenderDynamicVictoryPoints';
import {ICardRenderDescription} from './render/ICardRenderDescription';
import {CardRequirements} from './CardRequirements';
import {Player} from '../Player';
import {Game} from '../Game';
import {ISpace} from '../ISpace';
import {Resources} from '../Resources';
import {ResourceType} from '../ResourceType';
import {Tags} from './Tags';
import {MetadataRequirements} from './MetadataRequirements';
import {GlobalParameters} from '../GlobalParameters';

export type EffectQuantityFunction = (() => number) | ((player: Player) => number) | ((player: Player, game: Game) => number);

export type EffectSpacesFunction = (() => Array<ISpace>) | ((player: Player) => Array<ISpace>) | ((player: Player, game: Game) => Array<ISpace>);

export interface EffectsStandardResources {
  readonly resource: Resources;
  readonly quantity: number | EffectQuantityFunction;
  readonly anyPlayer?: boolean;
}

export interface EffectsResourceType {
  readonly resource: ResourceType;
  readonly quantity: number | EffectQuantityFunction;
  readonly anyPlayer?: false;
  readonly restrictedTags?: Tags;
}

export interface EffectsResourceTypeAnyPlayer {
  readonly resource: ResourceType;
  readonly quantity: number | EffectQuantityFunction;
  readonly anyPlayer: true;
  readonly ownCardsOnly?: boolean;
  readonly mandatory?: boolean;
}

interface EffectsGlobalParametersOcean {
  readonly parameter: GlobalParameters.OCEAN;
  readonly steps: 2 | 1;
  readonly spaces?: EffectSpacesFunction;
}
interface EffectsGlobalParametersOxygen {
  readonly parameter: GlobalParameters.OXYGEN;
  readonly steps: 2 | 1;
}
interface EffectsGlobalParametersTemperature {
  readonly parameter: GlobalParameters.TEMPERATURE;
  readonly steps: 3 | 2 | 1 | -2;
}
interface EffectsGlobalParametersVenus {
  readonly parameter: GlobalParameters.VENUS;
  readonly steps: 3 | 2 | 1;
}

interface EffectsTR {
  readonly quantity: number | EffectQuantityFunction;
}

interface EffectsCardDraw {
  readonly quantity: number | EffectQuantityFunction;
  readonly specificTag?: Tags;
}

export interface MetadataEffects {
  readonly productions?: ReadonlyArray<EffectsStandardResources>;
  readonly resources?: ReadonlyArray<EffectsStandardResources | EffectsResourceType | EffectsResourceTypeAnyPlayer>;
  readonly globalParameters?: ReadonlyArray<EffectsGlobalParametersOcean | EffectsGlobalParametersOxygen | EffectsGlobalParametersTemperature | EffectsGlobalParametersVenus>;
  readonly tr?: EffectsTR;
  readonly cardDraw?: EffectsCardDraw;
}

interface MetadataAction {
  readonly effects: MetadataEffects;
}

export interface CardMetadata {
  cardNumber: string;
  reqs?: MetadataRequirements;
  play?: MetadataEffects;
  action?: MetadataAction;
  vps?: number | EffectQuantityFunction;
  description?: string | ICardRenderDescription;
  requirements?: CardRequirements;
  victoryPoints?: number | CardRenderDynamicVictoryPoints;
  renderData?: CardRenderer;
}
