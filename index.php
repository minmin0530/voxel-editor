<?php
$result = glob("./data/*");
$array = array_reverse($result);
$sampleSelectBox = "<select name=\"selectBoxName\" id=\"selectBoxName\">\n";
for ( $i = 0; $i < count( $array ); $i++ ) {
    $sampleSelectBox .= "\t<option value=\"{$array[$i]}\">{$array[$i]}</option>\n";
}
$sampleSelectBox .= "</select>\n";

?>


<html>
  <head>
    <meta charset="utf-8" />
    <script src="lib/three.min.js"></script>
    <script src="lib/OrbitControls.js"></script>
    <script src="src/progress_history.js"></script>
    <script src="src/global.js"></script>
    <script src="src/main.js"></script>
    <script>
      const progressHistory = new ProgressHistory();
      const main = new Main();
      var controls;
      var loadFlag = false;

      window.onload = function() {
          main.init();
          loop();
      };

      function loop() {
          if (loadFlag) {
              progressHistory.timeLine();
          }
          controls.update();
          render();
          requestAnimationFrame(loop);
      }

      var _returnValues;
      function postSend() {
        for (const voxel of objects) {
            let i = 0;
            for (const cm of cubeMaterial) {
              if (voxel.material == cm) {
                break;
              }
              ++i;
            }
            if (i < 16) {
              contents += "{"
                    + '"x":' + ((voxel.position.x + 25) / 50) + ","
                    + '"y":' + ((voxel.position.y - 25) / 50) + ","
                    + '"z":' + ((voxel.position.z + 25) / 50) + ","
                    + '"m":' + i + "},";
            }
          }

          let material = '"material":[';
          for (let l = 0; l < 16; ++l) {
//          for (const m of cubeMaterial) {
            cubeMaterial[l].color.set(document.getElementById(colorNumTextArray[l]).value);
            material += "{"
                      + '"r":' + cubeMaterial[l].color.r + ","
                      + '"g":' + cubeMaterial[l].color.g + ","
                      + '"b":' + cubeMaterial[l].color.b + ","
                      + '"a":' + cubeMaterial[l].opacity + "},";
          }
          const mat = material.substr(0, material.length - 1) + "]}";





          var fd = new FormData();
          fd.append('data', '{"voxel":[' + contents.substr(0,contents.length - 1) + "]," + mat);
//          fd.append('bar','a');
          var xhr = new XMLHttpRequest();
          xhr.open('POST','./writefile.php');
          xhr.send(fd);
          xhr.onreadystatechange = function(){
              if ((xhr.readyState == 4) && (xhr.status == 200)) {
                  alert("保存名:" + xhr.responseText);
              }
          };
      }

      function displayContent() {
allClear();
var select_num = document.getElementById('selectBoxName').value;
progressHistory.loadFile(select_num);
      }
    </script>
  </head>
  <body>
    <div style="color: red; font-size: 48px; position: absolute; left:300px;">
       shift click
    </div>
    <div style="position: absolute;">
      <a href="https://ai5.jp/voxel-editor/document">使い方(説明書)</a><br>
      <br>
      <button type="button" onclick="progressHistory.loadFile('https://ai5.jp/voxel-editor/assets/voxel_model004.txt');">example1</button><br>
      <button type="button" onclick="progressHistory.loadFile('https://ai5.jp/voxel-editor/assets/MageMin.txt');">example2</button><br>
      <br>
      公開データ<?php echo "{$sampleSelectBox}"; ?><button type="button" onclick="displayContent();">見る</button><br>
      <button type="button" onclick="postSend();">公開保存</button><br>
      <button type="button" onclick="downLoadJson();">ダウンロード</button><br>
      <form name="myform">
        <input name="myfile" type="file" />
      </form>
      <button onclick="colorChange();" id="colorChange">色入替</button><br>      
      <button onclick="anglePut();" id="anglePut">削除</button><br>
      <button onclick="allClear();">AllClear</button><br>
      <button onclick="boxAll(4);">4×4×4</button><br>
      <button onclick="boxAll(8);">8×8×8</button><br>
      <button onclick="boxAll(16);">16×16×16</button><br>
      <input type="color" id="background" value="#dddddd">Background<br>
      <input type="color" id="color1" value="#ff0000"><br>
      <input type="color" id="color2" value="#00ff00"><br>
      <input type="color" id="color3" value="#0000ff"><br>
      <input type="color" id="color4" value="#ffff00"><br>
      <input type="color" id="color5" value="#00ffff"><br>
      <input type="color" id="color6" value="#ff00ff"><br>
      <input type="color" id="color7" value="#ffffff"><br>
      <input type="color" id="color8" value="#777777"><br>
      <input type="color" id="color9" value="#000000"><br>
      <input type="color" id="color10" value="#770000"><br>
      <input type="color" id="color11" value="#007700"><br>
      <input type="color" id="color12" value="#000077"><br>
      <input type="color" id="color13" value="#777700"><br>
      <input type="color" id="color14" value="#007777"><br>
      <input type="color" id="color15" value="#770077"><br>
      <input type="color" id="color16" value="#444444"><br>

    </div>          
  </body>
</html>
