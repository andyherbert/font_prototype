import Color from './color.js';
import Coord from './coord.js';
import Editor from './editor.js';

export const isMac = window.navigator.userAgent.match(/\bMacintosh\b/) != null;

export const white = new Color(242, 251, 235);
export const gray = new Color(68, 71, 65);
export const black = new Color(23, 18, 25);
export const red = new Color(255, 60, 60);

export interface Key {
    code: string;
    cmd: boolean;
    shift: boolean;
    repeat: boolean;
}

export function eventToKey(event: KeyboardEvent): Key {
    return {
        code: event.code,
        cmd: isMac ? event.metaKey : event.ctrlKey,
        shift: event.shiftKey,
        repeat: event.repeat,
    };
}

export enum ChangeMode {
    Edit,
    Undo,
    Redo,
}

export interface ToolInterface {
    readonly name: string;
    readonly cursor?: string;
    readonly shortcuts?: Array<Key>;
    init?(editor: Editor): void;
    keyDown?(key: Key, editor: Editor): boolean;
    keyUp?(key: Key, editor: Editor): void;
    pointerDown?(coord: Coord, editor: Editor): void;
    pointerMove?(coord: Coord, editor: Editor): void;
    pointerUp?(editor: Editor): void;
    focus?(editor: Editor): void;
    blur?(editor: Editor): void;
    change?(coord: Coord, from: boolean, editor: Editor): void;
    endChange?(mode: ChangeMode, editor: Editor): void;
    allChange?(from: Array<boolean>, mode: ChangeMode, editor: Editor): void;
    scaled?(editor: Editor): void;
    setCode?(code: number, editor: Editor): void;
}
