import {Player} from '../Player';
import {Game} from '../Game';
import {Tags} from './Tags';
import {PartyName} from '../turmoil/parties/PartyName';

interface MetadataRequirementsTags {
  tag: Tags;
  quantity: number;
}

export interface MetadataRequirements {
  tags?: MetadataRequirementsTags | Array<MetadataRequirementsTags>;
  minOceans?: number;
  maxOceans?: number;
  minOxygen?: number;
  maxOxygen?: number;
  minTemp?: number;
  maxTemp?: number;
  minVenus?: number;
  maxVenus?: number;
  minTr?: number; // Terraforming Contract
  minCities?: number; // Urban Decomposers
  minCitiesAny?: number; // Rad-Suits, Martian Zoo
  minForests?: number; // Ecological Zone
  minColonies?: number; // Space Port, Space Port COlony, Urban Decomposers
  maxColonies?: number; // Pioneer Settlement
  minFloaters?: number; // Aerosport Tournament, Airliners
  minSteelProduction?: number; // Great Escarpment Consortium
  minTitaniumProduction?: number; // Asteroid Mining Consortium
  minDifferentResources?: number; // Diversity Support
  plantsRemoved?: true; // Crash Site Cleanup
  rulingParty?: PartyName;
  beingChairman?: true; // Banned Delegate, Public Celebrations
  numberOfPartyLeaders?: number; // Political Alliance, Vote of no Confidence
  chairmanIsNeutral?: true; // Vote of no Confidence
}

export function checkRequirements(player: Player, game: Game, reqs: MetadataRequirements) {
  if (reqs.tags !== undefined) {
    const tags = Array.isArray(reqs.tags) ? reqs.tags : [reqs.tags];
    for (const tag of tags) {
      if (player.getTagCount(tag.tag) < tag.quantity) {
        return false;
      }
    }
  }

  if (reqs.minOceans !== undefined) {
    if (game.board.getOceansOnBoard() < reqs.minOceans - player.getRequirementsBonus(game)) {
      return false;
    }
  }

  if (reqs.maxOceans !== undefined) {
  }

  if (reqs.minOxygen !== undefined) {
  }

  if (reqs.maxOxygen !== undefined) {
  }

  if (reqs.minTemp !== undefined) {
  }

  if (reqs.maxTemp !== undefined) {
  }

  if (reqs.minVenus !== undefined) {
  }

  if (reqs.maxVenus !== undefined) {
  }

  if (reqs.minTr !== undefined) {
  }

  if (reqs.minCities !== undefined) {
  }

  if (reqs.minCitiesAny !== undefined) {
  }

  if (reqs.minForests !== undefined) {
  }

  if (reqs.minColonies !== undefined) {
  }

  if (reqs.maxColonies !== undefined) {
  }

  if (reqs.minFloaters !== undefined) {
  }

  if (reqs.minSteelProduction !== undefined) {
  }

  if (reqs.minTitaniumProduction !== undefined) {
  }

  if (reqs.minDifferentResources !== undefined) {
  }

  if (reqs.plantsRemoved === true) {
  }

  if (reqs.rulingParty !== undefined) {
  }

  if (reqs.beingChairman === true) {
  }

  if (reqs.numberOfPartyLeaders !== undefined) {
  }

  if (reqs.chairmanIsNeutral === true) {
  }

  return true;
}
