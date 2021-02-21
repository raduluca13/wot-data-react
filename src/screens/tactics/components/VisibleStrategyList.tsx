import { createSelector } from '@reduxjs/toolkit'
import { selectFilterState, VisibilityFilters } from '../../../slices/filterSlice'
import { TacticType } from '../../../store/types/enums/TacticType.enum'
import { allTacticsSelector } from '../store/tacticsSlice'

const selectVisibleStrategies = createSelector(
  [allTacticsSelector, selectFilterState],
  (tactics, filter) => {
    switch (filter) {
      case VisibilityFilters.SHOW_ALL:
        return tactics
      case VisibilityFilters.ATTACK:
        return tactics.filter(tactic => tactic.metadata.tacticType === TacticType.ATTACK)
      case VisibilityFilters.DEFENCE:
        return tactics.filter(tactic => tactic.metadata.tacticType === TacticType.DEFENCE)
      default:
        throw new Error('Unknown filter: ' + filter)
    }
  }
)

export default selectVisibleStrategies;
