var doc_hash;

function handleFiles(files) {
  console.log(files[0]);
  Object.keys(files).forEach((item, index) => {
    const file = files[index];
    const reader = new FileReader();

    reader.onload = () => {
      const fileResult = reader.result;

      crypto.subtle.digest('SHA-256', fileResult).then((hash) => {
        var sha256result = hex(hash);
        doc_hash = sha256result;
        console.log(`sha256result ${sha256result}`);
        console.log(`doc_hash ${doc_hash}`);

        document.getElementById('result').innerHTML = `${sha256result}`; //"File has been sucesfully uploaded";
        document.getElementById('gethash').style.display = 'block'

      });
    };

    reader.readAsArrayBuffer(file);
  });

}

function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
    var value = view.getUint32(i)
    var stringValue = value.toString(16)
    var padding = '00000000'
    var paddedValue = (padding + stringValue).slice(-padding.length)
    hexCodes.push(paddedValue);
  }

  return hexCodes.join("");
}
