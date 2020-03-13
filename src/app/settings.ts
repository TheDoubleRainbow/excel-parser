export const DefaultFilters = {
    phone: {B: true, G: true, H: true, N: true, O: true},
    audio: {B: true, G: true, H: true, O: true, P: true},
};

export const HeadersConfig = {
    phone: {
      A: '-', B: 'Context Name', C: 'Screen ID',
      D: 'Outline', E: 'Slot label', F: 'Status', 
      G: 'Command', H: 'Command example', I: 'Search result', 
      J: 'Confidence', K: 'Final Prompt ID',
      L: 'Final Voice Prompt', M: 'Final display Prompt', N: 'Action Class',
      O: 'Follow-up context', P: 'Jump to follow up context', Q: 'Screen Definition',
      R: 'Screen Definition',  S: 'Scree ID except NA', T: 'Screen ID for NA',
      U: 'Function Control', V: 'Remarks', W: 'VUI Concerns', X: 'Change Tracking'
    },
    audio: {
      A: '-', B: 'Context Name', C: 'Screen ID',
      D: 'Outline', E: 'Slot label', F: 'Status', 
      G: 'Command', H: 'Command example', I: 'Search result', 
      J: 'Confidence', K: 'Prompt', L: 'Final Prompt ID',
      M: 'Final Voice Prompt', N: 'Final display Prompt', O: 'Action Class',
      P: 'Follow-up context', Q: 'Jump to follow up context', R: '遷移先画面説明（日本語）▲c',
      S: 'Screen definition  (English)▲c',  T: 'Scree ID except NA', U: 'Screen ID for NA',
      V: 'Function Control', W: 'Remarks', X: 'Change Tracking'
    },
};

export const HeadersMapping = { 
  B: 'Command ID', 
  D: 'Topic',
  E: 'Slots',  
}

export const SlotsHeadersMapping = { 
  0: 'Name', 
  1: '',
  2: 'Value',  
}