import Color from './color.js';
import Coord from './coord.js';
import Editor from './editor.js';
import {
    CharDefinition,
    ascii,
    iso8859_1,
    iso8859_15,
    macroman,
    windows1252,
} from '../definitions/definitions.js';

export const isMac = window.navigator.userAgent.match(/\bMacintosh\b/) != null;

export const white = new Color(242, 251, 235);
export const gray = new Color(68, 71, 65);
export const black = new Color(23, 18, 25);
export const red = new Color(255, 60, 60);

export enum Encoding {
    Ascii = 'US-ASCII',
    Iso8859_1 = 'ISO-8859-1',
    Iso8859_15 = 'ISO-8859-15',
    MacRoman = 'Mac OS Roman',
    Windows1252 = 'Windows-1252',
}

export interface Key {
    code: string;
    char?: string;
    cmd: boolean;
    shift: boolean;
    repeat: boolean;
}

export function eventToKey(event: KeyboardEvent): Key {
    return {
        code: event.code,
        char: event.key,
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

export function getDefinitions(encoding: Encoding): Array<CharDefinition> {
    switch (encoding) {
        case Encoding.Ascii:
            return ascii;
        case Encoding.Iso8859_1:
            return iso8859_1;
        case Encoding.Iso8859_15:
            return iso8859_15;
        case Encoding.MacRoman:
            return macroman;
        case Encoding.Windows1252:
            return windows1252;
    }
}

export function findCodeInDefinitions(
    char: string,
    encoding: Encoding
): number | null {
    const definitions = getDefinitions(encoding);
    for (const [i, definition] of definitions.entries()) {
        if (definition.char != null) {
            if (definition.char == char) {
                return i;
            }
        }
    }
    return null;
}

export interface ToolInterface {
    readonly name: string;
    readonly cursor?: string;
    readonly shortcuts?: Array<Key>;
    init?(editor: Editor): void;
    keyDown?(key: Key, editor: Editor): boolean;
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
    setEncoding?(encoding: Encoding, editor: Editor): void;
}
