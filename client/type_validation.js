// Validation functions for the string data of each keytype.
// Called on every update of keycode data.
function validateByType(key_data, key_type) {
    let validated_data;
    switch(key_type) {
    case 'NONE':
        validated_data = validateTypeNONE(key_data);
        break;
    case 'HID':
        validated_data = validateTypeHID(key_data);
        break;
    case 'MOD':
        validated_data = validateTypeMOD(key_data);
        break;
    case 'MIDI':
        validated_data = validateTypeMIDI(key_data);
        break;
    case 'FUNC':
        validated_data = validateTypeFUNC(key_data);
        break;
    case 'TOGGLE':
        validated_data = validateTypeTOGGLE(key_data);
        break;
    case 'TARGET':
        validated_data = validateTypeTARGET(key_data);
        break;
    case 'CLICK':
        validated_data = validateTypeCLICK(key_data);
        break;
    case 'MOUSE_X':
        validated_data = validateTypeMOUSE_X(key_data);
        break;
    case 'MOUSE_Y':
        validated_data = validateTypeMOUSE_Y(key_data);
        break;
    case 'SCROLL_X':
        validated_data = validateTypeSCROLL_X(key_data);
        break;
    case 'SCROLL_Y':
        validated_data = validateTypeSCROLL_Y(key_data);
        break;
    case 'HIDMOD':
        validated_data = validateTypeHIDMOD(key_data);
        break;
    }
    return validated_data;
}

function validateTypeNONE() {
    return '';
}
function validateTypeHID(data) {
    return addLeadingUnderscore(
        stripIllegalChars(
            spacesToUnderscores(
                data.toUpperCase())));
}
function validateTypeMOD(data) {
    return addLeadingUnderscore(
        stripIllegalChars(
            spacesToUnderscores(
                data.toUpperCase())));
}
function validateTypeMIDI(data) {
    return stripIllegalChars(data);
}
function validateTypeFUNC(data) {
    return stripIllegalChars(
        spacesToUnderscores(data));
}
function validateTypeTOGGLE(data) {
    return stripIllegalChars(
        spacesToUnderscores(data));
}
function validateTypeTARGET(data) {
    return stripIllegalChars(
        spacesToUnderscores(data));
}
function validateTypeCLICK(data) {
    if(data.toUpperCase() == 'LEFT') return 0;
    if(data.toUpperCase() == 'RIGHT') return 1;
    if(data.toUpperCase() == 'MIDDLE') return 2;
    return stripIllegalChars(data);
}
function validateTypeMOUSE_X(data) {
    return stripIllegalChars(data);
}
function validateTypeMOUSE_Y(data) {
    return stripIllegalChars(data);
}
function validateTypeSCROLL_X(data) {
    return stripIllegalChars(data);
}
function validateTypeSCROLL_Y(data) {
    return stripIllegalChars(data);
}
function validateTypeHIDMOD(data) {
    let comma_pos = data.indexOf(',');
    if(comma_pos > 0)
        return stripIllegalChars(data.substring(0, comma_pos)
            .toUpperCase()) + ','
            + stripIllegalChars(data.substring(comma_pos)
                .toUpperCase());
    else
        return stripIllegalChars(data.toUpperCase());
}

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

export default validateByType;
