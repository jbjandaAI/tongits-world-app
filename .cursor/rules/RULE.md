# Project: Tongits World Mini App
Building a Tongits card game that runs as a Mini App inside World App.

# Tech Stack
- Framework: Next.js 14+ (App Router)
- Language: TypeScript
- UI: Tailwind CSS (Mobile-first design)
- SDK: @worldcoin/minikit-js
- State Management: Zustand (for game state)

# World App Mini Kit Rules
- The app runs inside a WebView in the World App.
- UI must be strictly mobile-responsive.
- Use `MiniKit.commands.verify()` for World ID verification.
- Use `MiniKit.commands.pay()` for handling crypto payments/bets if applicable.
- Handle dark mode/light mode based on World App theme.

# Game Rules (Tongits)
- 3-player card game logic.
- Standard 52-card deck.
- Implement core moves: Draw, Dump, Chow, Sapaw, Bahay, Fight (Draw).
- Win conditions: Empty hand (Tongits) or lowest points at deck exhaustion.

# Coding Style
- Use React Functional Components.
- Use explicit types for all Game State interfaces (e.g., `Card`, `Player`, `GameState`).
- Keep game logic separate from UI components (use hooks like `useTongitsGame`).