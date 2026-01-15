export type BindingColor =
  | 'black'
  | 'brown'
  | 'darkBrown'
  | 'tan'
  | 'teal'
  | 'pink'
  | 'lavender'
  | 'white'
  | 'pastelBlue'
  | 'pastelGreen'
  | 'pastelYellow';

export type ClaspStyle = 'gold' | 'silver' | 'bronze';

export type PageColor = 'white' | 'cream';

export type FontFamily =
  // Neat & Tidy
  | 'caveat'
  | 'patrickHand'
  | 'kalam'
  | 'comingSoon'
  // Messy & Quick
  | 'shadowsIntoLight'
  | 'reenieBeanie'
  | 'justAnotherHand'
  | 'coveredByYourGrace'
  // Bold & Expressive
  | 'permanentMarker'
  | 'architectsDaughter'
  // Childlike & Playful
  | 'gloriaHallelujah'
  | 'gochiHand'
  // Vintage & Classic
  | 'homemadeApple'
  | 'nothingYouCouldDo'
  | 'satisfy'
  | 'marckScript';

export type FontSize = 'small' | 'medium' | 'large';

export type InkColor = 'black' | 'blue' | 'red' | 'green' | 'purple';

export type AITone = 'comforting' | 'toughLove' | 'curious' | 'philosophical' | 'playful';

export type DateFormat = 'full' | 'short' | 'numeric' | 'dots';

export type DateColor = 'brown' | 'black' | 'navy' | 'forest' | 'burgundy' | 'slate';

export interface UserSettings {
  id: string;
  bindingColor: BindingColor;
  claspStyle: ClaspStyle;
  pageColor: PageColor;
  pageLines: boolean;
  fontFamily: FontFamily;
  fontSize: FontSize;
  inkColor: InkColor;
  // Feature toggles
  showMoodSelector: boolean;
  aiReflectionEnabled: boolean;
  // AI Configuration
  aiApiKey: string;
  aiTone: AITone;
  dateFormat: DateFormat;
  dateColor: DateColor;
  createdAt: Date;
  updatedAt: Date;
}

export interface PinData {
  id: string;
  pinHash: string;
  salt: string;
  createdAt: Date;
  updatedAt: Date;
}
