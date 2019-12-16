// Export header to be added to the beginning of the generated layermap file
const export_header_format =
  '// created by antonok\'s kb layout manager on %%DATE%%\n' +
  '//     www.gitlab.com/antonok/kb\n' +
  '//     www.gitlab.com/antonok/kb-layout-manager\n';

// File export functions
function createExportFormat(file_data) {
    const contents = createExportHeader() + '\nBEGIN_KEYMAPS\n';
    return file_data.reduce((accum, current) =>
        accum + '\n' + createExportForLayer(current), contents)
        + '\nEND_KEYMAPS\n';
}
function createExportForLayer(layer_data) {
    const metadata = {
        name: layer_data.name
    };
    const output = '{//' + JSON.stringify(metadata);
    return layer_data.map.reduce((accum, current) =>
        accum + '\n' + createExportForRow(current), output) + '\n},\n';
}
function createExportForRow(row_data) {
    return row_data.reduce((accum, current) =>
        accum + createExportForKey(current), '{').slice(0,-1) + '},';
}
function createExportForKey(key_data) {
    if(key_data.type == 'NONE')
        return 'NONE,';
    else
        return key_data.type + '(' + key_data.data + '),';
}
function createExportHeader() {
    const header = export_header_format.replace(/%%DATE%%/g, new Date().toDateString());
    return header;
}

export default createExportFormat;
