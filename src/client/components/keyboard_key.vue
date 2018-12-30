<template>
    <div class="keyboard-key" v-on:click="focusKey" v-bind:class="class_by_type">
        <div class="key-face">
            <input ref="input"
                    class="key-upper"
                    v-bind:value="key_data"
                    v-on:input="updateKey(key_type, $event.target.value)">
            </input>
            <select ref="select"
                    class="key-upper"
                    v-bind:class="class_by_type"
                    v-bind:value="key_data"
                    v-on:change="updateKey(key_type, $event.target.value)">
                <option v-for="(layer, index) in layers" v-bind:value="index" v-bind:selected="key_data == index">
                    {{ layer }}
                </option>
            </select>
            <select ref="select"
                    class="key-lower"
                    v-bind:class="class_by_type"
                    v-bind:value="key_type"
                    v-on:input="updateKey($event.target.value, key_data)">
                <option v-for="valid_type in valid_types" v-bind:value="valid_type">
                    {{ valid_type }}
                </option>
            </select>
        </div>
    </div>
</template>

<style lang="sass">
@import '../styles/variables.sass'

$modTypeHighlight: #666
$midiTypeHighlight: #0f0
$funcTypeHighlight: #f00
$layerTypeHighlight: #f0f
$mouseTypeHighlight: #00f
$hidmodTypeHighlight: #ff0

@function keyEdgeColor($highlight)
    @return lighten(desaturate($highlight, 82%), 31%)
@mixin keyEdgeBackground($highlight)
    background: keyEdgeColor($highlight)

.keyboard-key
    background-color: #d6d6d6
    margin: .125em
    padding: .32em
    display: inline-block
    box-shadow: .125em .125em .32em rgba(0,0,0,.5)
    border-radius: .125em
    position: relative
    &.type-none
    &.type-hid
    &.type-mod
        @include keyEdgeBackground($modTypeHighlight)
    &.type-midi
        @include keyEdgeBackground($midiTypeHighlight)
    &.type-func
        @include keyEdgeBackground($funcTypeHighlight)
    &.type-toggle, &.type-target
        @include keyEdgeBackground($layerTypeHighlight)
    &.type-click, &.type-mouse-x, &.type-mouse-y, &.type-scroll-x, &.type-scroll-y
        @include keyEdgeBackground($mouseTypeHighlight)
    &.type-hidmod
        @include keyEdgeBackground($hidmodTypeHighlight)
    &.active
        box-shadow: 0 0 1.3em #222
        z-index: 5
.key-face
    background-color: #fff
    margin: 0
    padding: 0
    white-space: normal
    z-index: 0
    position: relative
    width: 3.2em
    height: 3.2em
$textPopupSideOffset: 6em;
.keyboard-key input
    margin: 0
    padding: 0
    width: inherit
    height: 3.2em
    font-size: .5em
    border: 1px solid #eee
    box-sizing: border-box
    font-family: $monofont
    &:focus
        width: calc(6.4em + #{$textPopupSideOffset} * 2)
        z-index: 6
        margin-left: -$textPopupSideOffset
        border-radius: .4em
        box-shadow: 0 0 1.3em #000
.key-upper
    border-bottom: none !important
    background: #fff
.type-toggle, .type-target
    input.key-upper
        display: none
.type-none, .type-hid, .type-mod, .type-midi, .type-func, .type-click, .type-mouse-x, .type-mouse-y, .type-scroll-x, .type-scroll-y, .type-hidmod
    select.key-upper
        display: none

@function keyFaceBackgroundColor($highlight)
    @return lighten(desaturate($highlight, 60%), 45.75%)
@function keyFaceBackground($highlight)
    @return linear-gradient(to bottom, #fff 0%, keyFaceBackgroundColor($highlight) 100%)
@function keyTypeTextColor($highlight)
    @return darken(desaturate($highlight, 50.75%), 0.75%)
@mixin keyTypeStyle($highlight)
    background-color: keyFaceBackgroundColor($highlight)
    background: keyFaceBackground($highlight)
    color: keyTypeTextColor($highlight)

.keyboard-key select
    font-size: .5em
    width: inherit
    height: 3.2em
    box-sizing: border-box
    appearance: none
    -moz-appearance: none
    font-family: $monofont
    margin: 0
    padding: 0
    border: 1px solid #eee
    position: relative
    .keyboard-upper:focus + &
        z-index: -2
        position: relative
.key-lower
    background-color: #f8f8f8
    background: linear-gradient(to bottom, #fff 0%, #eee 100%)
    border-top: none !important
    color: #888
    &.type-none
        color: #ddd
    &.type-hid
        //Default key style
    &.type-mod
        @include keyTypeStyle($modTypeHighlight)
    &.type-midi
        @include keyTypeStyle($midiTypeHighlight)
    &.type-func
        @include keyTypeStyle($funcTypeHighlight)
    &.type-toggle, &.type-target
        @include keyTypeStyle($layerTypeHighlight)
    &.type-click, &.type-mouse-x, &.type-mouse-y, &.type-scroll-x, &.type-scroll-y
        @include keyTypeStyle($mouseTypeHighlight)
    &.type-hidmod
        @include keyTypeStyle($hidmodTypeHighlight)
</style>

<script>
import validateByType from '../utils/type_validation';

// Every type that can be assigned to a key
const key_types = ['NONE', 'HID', 'MOD', 'MIDI', 'FUNC', 'TOGGLE', 'TARGET', 'CLICK',
    'MOUSE_X', 'MOUSE_Y', 'SCROLL_X', 'SCROLL_Y', 'HIDMOD'];

// Vue template for key elements on the keyboard visual
const keyboard_key = {
    props: ['x', 'y', 'key_type', 'key_data', 'is_active', 'layers'],
    data: function() {
        return { valid_types: key_types };
    },
    computed: {
        class_by_type: function() {
            return {
                'active': this.is_active,

                'type-none': this.key_type == 'NONE',
                'type-hid': this.key_type == 'HID',
                'type-mod': this.key_type == 'MOD',
                'type-midi': this.key_type == 'MIDI',
                'type-func': this.key_type == 'FUNC',
                'type-toggle': this.key_type == 'TOGGLE',
                'type-target': this.key_type == 'TARGET',
                'type-click': this.key_type == 'CLICK',
                'type-mouse-x': this.key_type == 'MOUSE_X',
                'type-mouse-y': this.key_type == 'MOUSE_Y',
                'type-scroll-x': this.key_type == 'SCROLL_X',
                'type-scroll-y': this.key_type == 'SCROLL_Y',
                'type-hidmod': this.key_type == 'HIDMOD'
            };
        },
    },
    methods: {
        updateKey: function(new_type, new_data) {
            let validated_data = validateByType(new_data, new_type);
            this.$refs.input.value = validated_data;
            this.$emit('updatekey', this.x, this.y, new_type, validated_data);
        },
        focusKey: function() {
            this.$emit('focuskey', this.x, this.y);
        },
    },
};

export default keyboard_key;
</script>
