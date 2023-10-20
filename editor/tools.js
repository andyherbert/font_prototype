import Color from './color.js';
export const isMac = window.navigator.userAgent.match(/\bMacintosh\b/) != null;
export const white = new Color(242, 251, 235);
export const gray = new Color(68, 71, 65);
export const black = new Color(23, 18, 25);
export const red = new Color(255, 60, 60);
export var Encoding;
(function (Encoding) {
    Encoding["Ascii"] = "US-ASCII";
    Encoding["Iso8859_1"] = "ISO-8859-1";
    Encoding["Iso8859_15"] = "ISO-8859-15";
    Encoding["MacRoman"] = "Mac OS Roman";
    Encoding["Windows1252"] = "Windows-1252";
})(Encoding || (Encoding = {}));
export function eventToKey(event) {
    return {
        code: event.code,
        cmd: isMac ? event.metaKey : event.ctrlKey,
        shift: event.shiftKey,
        repeat: event.repeat,
    };
}
export var ChangeMode;
(function (ChangeMode) {
    ChangeMode[ChangeMode["Edit"] = 0] = "Edit";
    ChangeMode[ChangeMode["Undo"] = 1] = "Undo";
    ChangeMode[ChangeMode["Redo"] = 2] = "Redo";
})(ChangeMode || (ChangeMode = {}));
//# sourceMappingURL=tools.js.map