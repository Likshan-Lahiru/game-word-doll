// src/utils/session.ts
const KEY_GAME = 'selectedGameType';
const KEY_RETURN = 'returnTo';
const KEY_ENTRY = 'entryMode';

export const Session = {
    setGame(game: 'wordoll' | 'lockpickr') {
        sessionStorage.setItem(KEY_GAME, game);
    },
    getGame(): 'wordoll' | 'lockpickr' {
        const v = sessionStorage.getItem(KEY_GAME);
        return v === 'lockpickr' ? 'lockpickr' : 'wordoll';
    },
    clearGame() {
        sessionStorage.removeItem(KEY_GAME);
    },

    setReturnTo(path: '/bet-selector' | '/gem-game-mode') {
        sessionStorage.setItem(KEY_RETURN, path);
    },
    getReturnTo(): '/bet-selector' | '/gem-game-mode' | null {
        const v = sessionStorage.getItem(KEY_RETURN);
        return v === '/gem-game-mode' ? '/gem-game-mode' : v === '/bet-selector' ? '/bet-selector' : null;
    },
    clearReturnTo() {
        sessionStorage.removeItem(KEY_RETURN);
    },

    setEntryMode(mode: 'coin' | 'ticket') {
        sessionStorage.setItem(KEY_ENTRY, mode);
    },
    getEntryMode(): 'coin' | 'ticket' | null {
        const v = sessionStorage.getItem(KEY_ENTRY);
        return v === 'ticket' ? 'ticket' : v === 'coin' ? 'coin' : null;
    },
    clearEntryMode() {
        sessionStorage.removeItem(KEY_ENTRY);
    },

    clearAll() {
        this.clearGame();
        this.clearReturnTo();
        this.clearEntryMode();
    }
};
