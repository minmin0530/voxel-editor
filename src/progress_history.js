class ProgressHistory {

  constructor() {
    // this.json = null;
    this.timeCount = 0;
    this.vvv = 0;

  }

  loadFile(url) {
    this.vvv = 0;
    this.timeCount = 0;
    allClear();
    const httpObj = new XMLHttpRequest();
    httpObj.open('GET', url + '?' + (new Date()).getTime(), true);
    // ?以降はキャッシュされたファイルではなく、毎回読み込むためのもの
    httpObj.send(null);
    httpObj.onreadystatechange = function() {
      if ((httpObj.readyState == 4) && (httpObj.status == 200)) {
        json = JSON.parse(httpObj.responseText);

        loadFlag = true;
        //   speedFlag = flag;

      }
    };
  }
  timeLine() {
    const mm = json.material;

    for (let l = 0; l < 16; ++l) {
      cubeMaterial[l].color.set(colorToText(mm[l]));
      document.getElementById(colorNumTextArray[l]).value = colorToText(mm[l]);
    }

    const vv = json.voxel;
    // var speed = 20;
    // if (speedFlag) {
    //   speed = 1;
    // }
    if (++this.timeCount > 1) {
      this.timeCount = 0;
      if (this.vvv < vv.length) {
          
        var voxel = new THREE.Mesh(cubeGeo, cubeMaterial[vv[this.vvv].m]);
        voxel.position.set(vv[this.vvv].x * 50 - 25, vv[this.vvv].y * 50 + 25, vv[this.vvv].z * 50 - 25);
        voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        scene.add(voxel);
        objects.push(voxel);
        objectsMaterial.push(cubeMaterial[vv[this.vvv].m]);
      }
      ++this.vvv;

    }

  }
}