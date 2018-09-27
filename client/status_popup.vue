<template>
    <div id="status-popup" v-on:click="status_clicked" v-bind:class="show_if_not_idle">
        <div class="status-top-flex">
            <span class="status-title"> {{ status_string }} </span>
            </br>
            <span class="status-info" v-bind:class="show_if_flash">
                Reset keyboard to bootloader to continue
            </span>
            <span class="status-info" v-bind:class="show_if_done">
                Click to dismiss
            </span>
            <button class="status-cancel" v-bind:class="show_if_flash" v-on:click="cancel_flash">
                Cancel
            </button>
        </div>
        <div class="status-bottom-flex">
            <div class="loading-frame">
                <div class="loading-bar" v-bind:class="class_by_status"></div>
            </div>
            <span class="status-error-info" v-bind:class="show_if_error">
                {{ error_message }}
            </span>
        </div>
    </div>
</template>

<script>
// Strings to be displayed corresponding to every state of the backend server
const status_to_string = {
    'idle': 'Idle',
    'make': 'Compiling...',
    'flash': 'Uploading...',
    'clean': 'Cleaning up...',
    'done': 'Success!',
    'error': 'Failed',
};

// Vue template for the popup displaying information about server status
const status_popup = {
    props: ['current_status', 'error_message'],
    data: function() {
        return { status_to_string : status_to_string };
    },
    /*template: '<div id="status-popup" v-on:click="status_clicked" ' +
            'v-bind:class="show_if_not_idle">' +
        '<div class="status-top-flex">' +
            '<span class="status-title">' +
                '{{ status_string }}' +
            '</span>' +
            '</br>' +
            '<span class="status-info"' +
                    'v-bind:class="show_if_flash">' +
                'Reset keyboard to bootloader ' +
                'to continue' +
            '</span>' +
            '<span class="status-info" ' +
                    'v-bind:class="show_if_done">' +
                'Click to dismiss' +
            '</span>' +
            '<button class="status-cancel" ' +
                    'v-bind:class="show_if_flash" ' +
                    'v-on:click="cancel_flash">' +
                'Cancel' +
            '</button>' +
        '</div>' +
        '<div class="status-bottom-flex">' +
            '<div class="loading-frame">' +
                '<div class="loading-bar" ' +
                        'v-bind:class="class_by_status">' +
                '</div>' +
            '</div>' +
            '<span class="status-error-info" ' +
                    'v-bind:class="show_if_error">' +
                '{{ error_message }}' +
            '</span>' +
        '</div>' +
    '</div>',*/
    computed: {
        status_string: function() {
            return status_to_string[this.current_status];
        },
        class_by_status: function() {
            return {
                'status-idle': this.current_status == 'idle',
                'status-make': this.current_status == 'make',
                'status-flash': this.current_status == 'flash',
                'status-clean': this.current_status == 'clean',
                'status-done': this.current_status == 'done',
                'status-error': this.current_status == 'error'
            };
        },
        show_if_error: function() {
            return {
                'hidden': this.current_status != 'error'
            };
        },
        show_if_flash: function() {
            return {
                'hidden': this.current_status != 'flash'
            };
        },
        show_if_done: function() {
            return {
                'hidden': this.current_status != 'done'
            };
        },
        show_if_not_idle: function() {
            return {
                'hidden': this.current_status == 'idle'
            };
        },
    },
    methods: {
        status_clicked: function() {
            this.$emit('hide_status');
        },
        cancel_flash: function() {
            this.$emit('hide_status');
            this.$emit('cancel_flash');
        }
    },
};

export default status_popup;
</script>
