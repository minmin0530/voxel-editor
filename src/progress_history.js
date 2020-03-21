import * as THREE from 'three';
import { colorNumTextArray, colorToText } from './global';

class ProgressHistory {

  constructor(main) {
    this.main = main;
    this.threeObj = this.main.getThreeObject();
    this.json = {};
    this.timeCount = 0;
    this.vvv = 0;
    this.speedFlag = false;
    this.loadFlag = false;

  }

  loadFile(url) {
    this.vvv = 0;
    this.timeCount = 0;
    this.main.allClear();
    const httpObj = new XMLHttpRequest();
    httpObj.open('GET', url + '?' + (new Date()).getTime(), true);
    // ?以降はキャッシュされたファイルではなく、毎回読み込むためのもの
    httpObj.send(null);
    httpObj.onreadystatechange = function() {
      if ((httpObj.readyState == 4) && (httpObj.status == 200)) {
        this.json = JSON.parse(httpObj.responseText);

        this.loadFlag = true;
        //   this.speedFlag = flag;

      }
    };
  }
  timeLine() {
    if (!this.loadFlag) return;

    const mm = this.json.material;

    for (let l = 0; l < 16; ++l) {
      this.threeObj.cubeMaterial[l].color.set(colorToText(mm[l]));
      document.getElementById(colorNumTextArray[l]).value = colorToText(mm[l]);
    }

    const vv = this.json.voxel;
    // var speed = 20;
    // if (this.speedFlag) {
    //   speed = 1;
    // }
    if (++this.timeCount > 1) {
      this.timeCount = 0;
      if (this.vvv < vv.length) {
          
        var voxel = new THREE.Mesh(this.threeObj.cubeGeo, this.threeObj.cubeMaterial[vv[this.vvv].m]);
        voxel.position.set(vv[this.vvv].x * 50 - 25, vv[this.vvv].y * 50 + 25, vv[this.vvv].z * 50 - 25);
        voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        this.threeObj.scene.add(voxel);
        this.threeObj.objects.push(voxel);
        this.threeObj.objectsMaterial.push(this.threeObj.cubeMaterial[vv[this.vvv].m]);
      }
      ++this.vvv;

    }

  }
}

export default ProgressHistory;
