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

<style lang="sass">
#status-popup
    position: absolute
    top: 0
    right: 0
    left: 0
    bottom: 0
    margin: auto
    padding: 2.5em
    width: 37.5em
    height: 25em
    background-color: #fff
    box-shadow: .225em .225em 5em rgba(0,0,0,.5)
    border-radius: .5em
    border-top: .35em solid #222
    border-bottom: .35em solid #222
    display: flex
    flex-direction: column
    z-index: 10;
.status-top-flex
    flex: 2
.status-bottom-flex
    flex: 8
.status-title
    font-size: 1.6em
    margin-bottom: .8em
.status-info
    line-height: 2.5em
.status-cancel
    float: right
.loading-frame
    background-color: #bbb
    border: .35em solid #222
    border-radius: .35em
    width: 18em
    height: 1.6em
    margin: 1.25em auto
.loading-bar
    height: 1.6em
    background: repeating-linear-gradient(-50deg, #333, #333 .5em, transparent .5em, transparent 1em), linear-gradient(20deg, #000, #444)
    transition: width .5s ease-in
    &.status-idle
        width: 0
    &.status-make
        width: 18em * 1 / 4
    &.status-flash
        width: 18em * 2 / 4
    &.status-clean
        width: 18em * 3 / 4
    &.status-done
        width: 18em
    &.status-error
        width: 18em
        background: repeating-linear-gradient(-50deg, #f66, #f66 .5em, transparent .5em, transparent 1em), linear-gradient(20deg, #f33, #f99)
.hidden
    display: none !important
</style>

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
