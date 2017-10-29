var fs = require('fs');
var iconPath = 'app/images/icons';

function getFiles (dir) {
  var icons = {};
  var i;
  var importStrings = "";
  var exportString = "\nexport default {\n";
  var files = fs.readdirSync(dir).filter(f => f !== '.DS_Store');
  for (i in files) {
    var path = files[i];
    var name = files[i].split(".")[0];
    var importName = name.replace(/-/g, "__") + "__";
    importStrings += "import " + importName + " from './images/icons/" + name + ".svg';\n";
    exportString += "  '" + name + "': " + importName + ",\n";
    icons[name] = path;
  }
  exportString += "};\n";
  var jsonData = JSON.stringify(icons);
  var fileContent = importStrings + exportString;
  // var fileContent = "export default " + jsonData;
  fs.writeFile('app/icons.js', fileContent);
}

getFiles(iconPath);
