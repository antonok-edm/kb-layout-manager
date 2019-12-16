// Validation functions for the string data of each keytype.
// Called on every update of keycode data.
function validateByType(key_data, key_type) {
    return validators[key_type](key_data);
}

const validators = {
    'NONE': () => {
        return '';
    },
    'HID': (data) => {
        return addLeadingUnderscore(
            stripIllegalChars(
                spacesToUnderscores(
                    data.toUpperCase())));
    },
    'MOD': (data) => {
        return addLeadingUnderscore(
            stripIllegalChars(
                spacesToUnderscores(
                    data.toUpperCase())));
    },
    'MIDI': (data) => {
        return stripIllegalChars(data);
    },
    'FUNC': (data) => {
        return stripIllegalChars(
            spacesToUnderscores(data));
    },
    'TOGGLE': (data) => {
        return validateIndex(data);
    },
    'TARGET': (data) => {
        return validateIndex(data);
    },
    'CLICK': (data) => {
        if(data.toUpperCase() == 'LEFT') return 0;
        if(data.toUpperCase() == 'RIGHT') return 1;
        if(data.toUpperCase() == 'MIDDLE') return 2;
        return stripIllegalChars(data);
    },
    'MOUSE_X': (data) => {
        return stripIllegalChars(data);
    },
    'MOUSE_Y': (data) => {
        return stripIllegalChars(data);
    },
    'SCROLL_X': (data) => {
        return stripIllegalChars(data);
    },
    'SCROLL_Y': (data) => {
        return stripIllegalChars(data);
    },
    'HIDMOD': (data) => {
        const comma_pos = data.indexOf(',');
        if(comma_pos > 0)
            return stripIllegalChars(data.substring(0, comma_pos)
                .toUpperCase()) + ','
                + stripIllegalChars(data.substring(comma_pos)
                    .toUpperCase());
        else
            return stripIllegalChars(data.toUpperCase());
    },
};

// Formatting helper functions
function addLeadingUnderscore(data) {
    if(data.length > 0 && data[0] != '_')
        return '_' + data;
    return data;
}
function spacesToUnderscores(data) {
    return data.replace(/\s/g, '_');
}
function stripIllegalChars(data) {
    return data.replace(/[.,?!*+@#$%^&()[\]{}='"\\/\s]/g, '');
}

function validateIndex(value) {
    if(/^\d+$/.test(value)) {
        return value;
    }
    else {
        return 0;
    }
}

export default validateByType;
