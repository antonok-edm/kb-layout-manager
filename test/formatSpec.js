import createExportFormat from '../src/client/utils/c_formatter';
import { expect } from "chai";

describe("parsing", function() {
    it("formats a real QWERTY keymap", function() {
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

        let expected = `// created by antonok's kb layout manager on ${new Date().toDateString()}
//     www.gitlab.com/antonok/kb
//     www.gitlab.com/antonok/kb-layout-manager

KEYMAP(QWERTY) {
{HID(_ESCAPE),HID(_1_EXCLAMATION),HID(_2_AT),HID(_3_HASHMARK),HID(_4_DOLLAR),HID(_5_PERCENTAGE),HID(_6_CARET),HID(_7_AMPERSAND),HID(_8_ASTERISK),HID(_9_OPENING_PARENTHESIS),HID(_0_CLOSING_PARENTHESIS),HID(_MINUS_AND_UNDERSCORE),HID(_EQUAL_AND_PLUS),HID(_BACKSPACE)},
{HID(_TAB),HID(_Q),HID(_W),HID(_E),HID(_R),HID(_T),HID(_Y),HID(_U),HID(_I),HID(_O),HID(_P),HID(_OPENING_BRACKET_AND_BRACE),HID(_CLOSING_BRACKET_AND_BRACE),HID(_BACKSLASH_AND_PIPE)},
{HID(_BACKSPACE),HID(_A),HID(_S),HID(_D),HID(_F),HID(_G),HID(_H),HID(_J),HID(_K),HID(_L),HID(_SEMICOLON_AND_COLON),HID(_APOSTROPHE_AND_QUOTE),HID(_ENTER),HID(_DELETE)},
{MOD(_MOD_LEFTSHIFT),HID(_Z),HID(_X),HID(_C),HID(_V),HID(_B),HID(_N),HID(_M),HID(_COMMA_AND_LESS_THAN_SIGN),HID(_DOT_AND_GREATER_THAN_SIGN),HID(_SLASH_AND_QUESTION_MARK),MOD(_MOD_RIGHTSHIFT),HID(_UP_ARROW),HID(_ESCAPE)},
{MOD(_MOD_LEFTCTRL),MOD(_MOD_LEFTGUI),MOD(_MOD_LEFTALT),TOGGLE(FN),HID(_SPACE),NONE,TOGGLE(LRDN),HID(_SPACE),NONE,TOGGLE(LRUP),TOGGLE(MOUSE),HID(_LEFT_ARROW),HID(_DOWN_ARROW),HID(_RIGHT_ARROW)}};
`;

    expect(createExportFormat(keymap)).equal(expected)
    });

    it("formats a small example with two keymaps", function() {
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

        let expected = `// created by antonok's kb layout manager on ${new Date().toDateString()}
//     www.gitlab.com/antonok/kb
//     www.gitlab.com/antonok/kb-layout-manager

KEYMAP(TEST_1) {
{HID(_F1),HID(_F2),HID(_F3),HID(_F4)},
{TARGET(TEST_2),FUNC(some_function),HIDMOD(_A,_MOD_LEFTSHIFT),MIDI(84)},
{MOD(_MOD_LEFTCTRL),MOD(_MOD_LEFTSHIFT),MOD(_MOD_RIGHTALT),MOD(_MOD_RIGHTGUI)}};

KEYMAP(TEST_2) {
{NONE,NONE,NONE,TOGGLE(TEST_1)},
{MOUSE_X(-1),MOUSE_Y(1),SCROLL_X(3),SCROLL_Y(-3)},
{CLICK(2),CLICK(0),NONE,NONE}};
`;

    expect(createExportFormat(keymap)).equal(expected)
    });
});
