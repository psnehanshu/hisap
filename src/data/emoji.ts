export type EmojiGroup = { key: string; icon: string; emoji: string[] };

export const EMOJI_GROUPS: EmojiGroup[] = [
  {
    key: 'smileys',
    icon: '😀',
    emoji: ['😀', '😄', '😊', '🙂', '😉', '😍', '🤩', '😎', '🤗', '🤔', '😴', '🥳', '😇', '🙃'],
  },
  {
    key: 'animals',
    icon: '🐾',
    emoji: ['🐾', '🐶', '🐱', '🐦', '🐟', '🦊', '🐰', '🐻', '🐼', '🐨', '🦁', '🐷', '🐸', '🐵'],
  },
  {
    key: 'food',
    icon: '🍔',
    emoji: ['🍔', '🍕', '☕', '🍜', '🍣', '🍎', '🥗', '🍰', '🍺', '🍦', '🥑', '🍩', '🌮', '🧋'],
  },
  {
    key: 'activity',
    icon: '⚽',
    emoji: ['⚽', '🎮', '🎯', '🎉', '🎨', '🎬', '📚', '🎸', '🏀', '🏝️', '⛰️', '🎫', '🎧', '🧘'],
  },
  {
    key: 'travel',
    icon: '🚗',
    emoji: ['🚗', '🚕', '🚌', '🚲', '✈️', '🏨', '🏠', '🚆', '⛴️', '🛵', '🚉', '🗺️', '🧳', '🏖️'],
  },
  {
    key: 'objects',
    icon: '💡',
    emoji: ['💡', '⚡', '💊', '💼', '📅', '🧾', '🎁', '🛒', '🛍️', '💰', '🔧', '🪑', '🖼️', '🧴'],
  },
  {
    key: 'hearts',
    icon: '❤️',
    emoji: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🌱', '🌸', '🌻', '⭐', '🔥', '✨', '🌈', '💎'],
  },
  {
    key: 'symbols',
    icon: '🔣',
    emoji: ['🔣', '🔢', '🅰️', '🆗', '➕', '➖', '❓', '❗', '💯', '✅', '📌', '🔖', '🏷️', '🗂️'],
  },
];

export const ALL_EMOJI: string[] = Array.from(new Set(EMOJI_GROUPS.flatMap((g) => g.emoji)));
