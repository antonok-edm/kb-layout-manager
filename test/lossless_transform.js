import parseLayerMapsFile from '../src/client/utils/c_parser';
import createExportFormat from '../src/client/utils/c_formatter';
import { expect } from "chai";

describe("lossless transformation", function() {
    it("can format and re-parse a real QWERTY keymap without losing information", function() {
    let keymap = [
        {
            "map": [
                [
                    {
                        "data": "_ESCAPE",
                        "type": "HID",
                    },
                    {
                        "data": "_1_EXCLAMATION",
                        "type": "HID",
                    },
                    {
                        "data": "_2_AT",
                        "type": "HID",
                    },
                    {
                        "data": "_3_HASHMARK",
                        "type": "HID",
                    },
                    {
                        "data": "_4_DOLLAR",
                        "type": "HID",
                    },
                    {
                        "data": "_5_PERCENTAGE",
                        "type": "HID",
                    },
                    {
                        "data": "_6_CARET",
                        "type": "HID",
                    },
                    {
                        "data": "_7_AMPERSAND",
                        "type": "HID",
                    },
                    {
                        "data": "_8_ASTERISK",
                        "type": "HID",
                    },
                    {
                        "data": "_9_OPENING_PARENTHESIS",
                        "type": "HID",
                    },
                    {
                        "data": "_0_CLOSING_PARENTHESIS",
                        "type": "HID",
                    },
                    {
                        "data": "_MINUS_AND_UNDERSCORE",
                        "type": "HID",
                    },
                    {
                        "data": "_EQUAL_AND_PLUS",
                        "type": "HID",
                    },
                    {
                        "data": "_BACKSPACE",
                        "type": "HID",
                    },
                ],
                [
                    {
                        "data": "_TAB",
                        "type": "HID",
                    },
                    {
                        "data": "_Q",
                        "type": "HID",
                    },
                    {
                        "data": "_W",
                        "type": "HID",
                    },
                    {
                        "data": "_E",
                        "type": "HID",
                    },
                    {
                        "data": "_R",
                        "type": "HID",
                    },
                    {
                        "data": "_T",
                        "type": "HID",
                    },
                    {
                        "data": "_Y",
                        "type": "HID",
                    },
                    {
                        "data": "_U",
                        "type": "HID",
                    },
                    {
                        "data": "_I",
                        "type": "HID",
                    },
                    {
                        "data": "_O",
                        "type": "HID",
                    },
                    {
                        "data": "_P",
                        "type": "HID",
                    },
                    {
                        "data": "_OPENING_BRACKET_AND_BRACE",
                        "type": "HID",
                    },
                    {
                        "data": "_CLOSING_BRACKET_AND_BRACE",
                        "type": "HID",
                    },
                    {
                        "data": "_BACKSLASH_AND_PIPE",
                        "type": "HID",
                    },
                ],
                [
                    {
                        "data": "_BACKSPACE",
                        "type": "HID",
                    },
                    {
                        "data": "_A",
                        "type": "HID",
                    },
                    {
                        "data": "_S",
                        "type": "HID",
                    },
                    {
                        "data": "_D",
                        "type": "HID",
                    },
                    {
                        "data": "_F",
                        "type": "HID",
                    },
                    {
                        "data": "_G",
                        "type": "HID",
                    },
                    {
                        "data": "_H",
                        "type": "HID",
                    },
                    {
                        "data": "_J",
                        "type": "HID",
                    },
                    {
                        "data": "_K",
                        "type": "HID",
                    },
                    {
                        "data": "_L",
                        "type": "HID",
                    },
                    {
                        "data": "_SEMICOLON_AND_COLON",
                        "type": "HID",
                    },
                    {
                        "data": "_APOSTROPHE_AND_QUOTE",
                        "type": "HID",
                    },
                    {
                        "data": "_ENTER",
                        "type": "HID",
                    },
                    {
                        "data": "_DELETE",
                        "type": "HID",
                    },
                ],
                [
                    {
                        "data": "_MOD_LEFTSHIFT",
                        "type": "MOD",
                    },
                    {
                        "data": "_Z",
                        "type": "HID",
                    },
                    {
                        "data": "_X",
                        "type": "HID",
                    },
                    {
                        "data": "_C",
                        "type": "HID",
                    },
                    {
                        "data": "_V",
                        "type": "HID",
                    },
                    {
                        "data": "_B",
                        "type": "HID",
                    },
                    {
                        "data": "_N",
                        "type": "HID",
                    },
                    {
                        "data": "_M",
                        "type": "HID",
                    },
                    {
                        "data": "_COMMA_AND_LESS_THAN_SIGN",
                        "type": "HID",
                    },
                    {
                        "data": "_DOT_AND_GREATER_THAN_SIGN",
                        "type": "HID",
                    },
                    {
                        "data": "_SLASH_AND_QUESTION_MARK",
                        "type": "HID",
                    },
                    {
                        "data": "_MOD_RIGHTSHIFT",
                        "type": "MOD",
                    },
                    {
                        "data": "_UP_ARROW",
                        "type": "HID",
                    },
                    {
                        "data": "_ESCAPE",
                        "type": "HID",
                    },
                ],
                [
                    {
                        "data": "_MOD_LEFTCTRL",
                        "type": "MOD",
                    },
                    {
                        "data": "_MOD_LEFTGUI",
                        "type": "MOD",
                    },
                    {
                        "data": "_MOD_LEFTALT",
                        "type": "MOD",
                    },
                    {
                        "data": "FN",
                        "type": "TOGGLE",
                    },
                    {
                        "data": "_SPACE",
                        "type": "HID",
                    },
                    {
                        "data": "",
                        "type": "NONE",
                    },
                    {
                        "data": "LRDN",
                        "type": "TOGGLE",
                    },
                    {
                        "data": "_SPACE",
                        "type": "HID",
                    },
                    {
                        "data": "",
                        "type": "NONE",
                    },
                    {
                        "data": "LRUP",
                        "type": "TOGGLE",
                    },
                    {
                        "data": "MOUSE",
                        "type": "TOGGLE",
                    },
                    {
                        "data": "_LEFT_ARROW",
                        "type": "HID",
                    },
                    {
                        "data": "_DOWN_ARROW",
                        "type": "HID",
                    },
                    {
                        "data": "_RIGHT_ARROW",
                        "type": "HID",
                    },
                ],
            ],
          "name": "QWERTY",
        },
    ]

    expect(parseLayerMapsFile(createExportFormat(keymap))).deep.equal(keymap)
    });

    it("can format and re-parse a small example with two keymaps without losing information", function() {
    let keymap = [
        {
            "map": [
                [
                    {
                        "data": "_F1",
                        "type": "HID",
                    },
                    {
                        "data": "_F2",
                        "type": "HID",
                    },
                    {
                        "data": "_F3",
                        "type": "HID",
                    },
                    {
                        "data": "_F4",
                        "type": "HID",
                    },
                ],
                [
                    {
                        "data": "TEST_2",
                        "type": "TARGET",
                    },
                    {
                        "data": "some_function",
                        "type": "FUNC",
                    },
                    {
                        "data": "_A,_MOD_LEFTSHIFT",
                        "type": "HIDMOD",
                    },
                    {
                        "data": "84",
                        "type": "MIDI",
                    },
                ],
                [
                    {
                        "data": "_MOD_LEFTCTRL",
                        "type": "MOD",
                    },
                    {
                        "data": "_MOD_LEFTSHIFT",
                        "type": "MOD",
                    },
                    {
                        "data": "_MOD_RIGHTALT",
                        "type": "MOD",
                    },
                    {
                        "data": "_MOD_RIGHTGUI",
                        "type": "MOD",
                    },
                ],
            ],
          "name": "TEST_1",
        },
        {
            "map": [
                [
                    {
                        "data": "",
                        "type": "NONE",
                    },
                    {
                        "data": "",
                        "type": "NONE",
                    },
                    {
                        "data": "",
                        "type": "NONE",
                    },
                    {
                        "data": "TEST_1",
                        "type": "TOGGLE",
                    },
                ],
                [
                    {
                        "data": "-1",
                        "type": "MOUSE_X",
                    },
                    {
                        "data": "1",
                        "type": "MOUSE_Y",
                    },
                    {
                        "data": "3",
                        "type": "SCROLL_X",
                    },
                    {
                        "data": "-3",
                        "type": "SCROLL_Y",
                    },
                ],
                [
                    {
                        "data": "2",
                        "type": "CLICK",
                    },
                    {
                        "data": "0",
                        "type": "CLICK",
                    },
                    {
                        "data": "",
                        "type": "NONE",
                    },
                    {
                        "data": "",
                        "type": "NONE",
                    },
                ],
            ],
          "name": "TEST_2",
        },
    ]

    expect(parseLayerMapsFile(createExportFormat(keymap))).deep.equal(keymap)
    });
});
