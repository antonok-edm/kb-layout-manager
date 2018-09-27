<template>
    <div class="keyboard-key" v-on:click="focusKey" v-bind:class="class_by_type">
        <input ref="input"
                class="keyboard-text"
                v-bind:value="key_data"
                v-on:input="updateKey(key_type, $event.target.value)">
        </input>
        <select ref="select"
                class="keyboard-type"
                v-bind:class="class_by_type"
                v-bind:value="key_type"
                v-on:input="updateKey($event.target.value, key_data)">
            <option v-for="valid_type in valid_types" v-bind:value="valid_type">
                {{ valid_type }}
            </option>
        </select>
    </div>
</template>

<script>
import validateByType from './type_validation';

// Every type that can be assigned to a key
const key_types = ['NONE', 'HID', 'MOD', 'MIDI', 'FUNC', 'TOGGLE', 'TARGET', 'CLICK',
    'MOUSE_X', 'MOUSE_Y', 'SCROLL_X', 'SCROLL_Y', 'HIDMOD'];

// Vue template for key elements on the keyboard visual
const keyboard_key = {
    props: ['x', 'y', 'key_type', 'key_data', 'is_active'],
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
