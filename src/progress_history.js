import * as THREE from 'three';
import userEnv from 'userEnv';
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

  loadFile(path) {
    const url = `${userEnv.BASE_URL}/${path}`;
    this.vvv = 0;
    this.timeCount = 0;
    this.main.allClear();
    const httpObj = new XMLHttpRequest();
    httpObj.open('GET', url + '?' + (new Date()).getTime(), true);
    // ?以降はキャッシュされたファイルではなく、毎回読み込むためのもの
    httpObj.send(null);
    httpObj.onreadystatechange = () => {
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
  displayContent() {
    this.main.allClear();
    const selectNum = document.getElementById('selectBoxName').value;
    this.loadFile(selectNum);
  }
  postSend() {
    let contents = '';
    for (const voxel of this.main.objects) {
      let i = 0;
      for (const cm of this.main.cubeMaterial) {
        if (voxel.material == cm) {
          break;
        }
        ++i;
      }
      if (i < 16) {
        const str = '{'
                + '"x":' + ((voxel.position.x + 25) / 50) + ','
                + '"y":' + ((voxel.position.y - 25) / 50) + ','
                + '"z":' + ((voxel.position.z + 25) / 50) + ','
                + '"m":' + i + '},';
        console.log(str);
        contents += str;
      }
    }

    let material = '"material":[';
    for (let l = 0; l < 16; ++l) {
      this.main.cubeMaterial[l].color.set(document.getElementById(colorNumTextArray[l]).value);
      const str = '{'
                + '"r":' + this.main.cubeMaterial[l].color.r + ','
                + '"g":' + this.main.cubeMaterial[l].color.g + ','
                + '"b":' + this.main.cubeMaterial[l].color.b + ','
                + '"a":' + this.main.cubeMaterial[l].opacity + '},';
      console.log(str);
      material += str;
    }
    const mat = material.substr(0, material.length - 1) + ']}';

    const fd = new FormData();
    fd.append('data', '{"voxel":[' + contents.substr(0, contents.length - 1) + '],' + mat);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', './writefile.php');
    xhr.send(fd);
    xhr.onreadystatechange = () => {
      if ((xhr.readyState == 4) && (xhr.status == 200)) {
        alert('保存名:' + xhr.responseText);
      }
    };
  }
}

export default ProgressHistory;
