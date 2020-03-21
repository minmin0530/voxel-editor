import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { colorNumTextArray, colorToText } from './global';

class Main {
  constructor() {
    this.camera = {};
    this.scene = {};  //progress_historyでも使う
    this.controls = {};
    this.renderer = {};
    this.plane = {};
    this.mouse = {};
    this.raycaster = {};
    this.isShiftDown = false;

    this.rollOverMesh = {};
    this.rollOverMaterial = {};
    this.cubeGeo = {};  //progress_historyでも使う
    this.cubeMaterial = []; //progress_historyでも使う
    this.materialIndex = 0;

    this.objects = []; //progress_historyでも使う
    this.objectsMaterial = [];  //progress_historyでも使う
    this.contents = '';
    this.form = {};
    this.anglePutFlag = false;
    this.colorChangeFlag = false;
    this.cameraAngle = 0.0;
    this.cameraZoom = 700.0;
  }

  getThreeObject() {
    return {
      scene: this.scene,
      cubeGeo: this.cubeGeo,
      cubeMaterial: this.cubeMaterial,
      objects: this.objects,
      objectsMaterial: this.objectsMaterial,
    };
  }
        
  init() {

    for (let l = 0; l < 16; ++l) {
      document.getElementById(colorNumTextArray[l]).addEventListener('click', function() {
        this.materialIndex = l;
        this.cubeMaterial[l].color.set(document.getElementById(colorNumTextArray[l]).value);
      }, false);
      document.getElementById(colorNumTextArray[l]).addEventListener('change', function() {
        this.materialIndex = l;
        this.cubeMaterial[l].color.set(document.getElementById(colorNumTextArray[l]).value);
      }, false);
    }
    document.getElementById('background').addEventListener('click', function() {
      this.renderer.setClearColor(document.getElementById('background').value, 1.0);          
    });
    document.getElementById('background').addEventListener('change', function() {
      this.renderer.setClearColor(document.getElementById('background').value, 1.0);
    });

    // シーンを作成
    this.scene = new THREE.Scene();
    // カメラを作成
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.set(this.cameraZoom * Math.cos(Math.PI / 180.0 * this.cameraAngle), this.cameraZoom, this.cameraZoom * Math.sin(Math.PI / 180.0 * this.cameraAngle));
    this.camera.lookAt(0, 0, 0);

    var rollOverGeo = new THREE.BoxBufferGeometry(50, 50, 50);
    this.rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
    this.rollOverMesh = new THREE.Mesh(rollOverGeo, this.rollOverMaterial);
    this.scene.add(this.rollOverMesh);


    this.cubeGeo = new THREE.BoxBufferGeometry(50, 50, 50);
    for (let l = 0; l < 16; ++l) {
      this.cubeMaterial.push(new THREE.MeshLambertMaterial({ color: document.getElementById(colorNumTextArray[l]).value }));
    }

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
                
    var gridHelper = new THREE.GridHelper(2500, 50);
    this.scene.add(gridHelper);

    var geometry = new THREE.PlaneBufferGeometry(2500, 2500);
    geometry.rotateX(- Math.PI / 2);

    this.plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
    this.scene.add(this.plane);

    this.objects.push(this.plane);

    var ambientLight = new THREE.AmbientLight(0x606060);
    this.scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    this.scene.add(directionalLight);

    var directionalLight2 = new THREE.DirectionalLight(0xffffff);
    directionalLight2.position.set(-1, 0.75, -0.5).normalize();
    this.scene.add(directionalLight2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    document.addEventListener('mousemove', event => this.onDocumentMouseMove(event), false);
    document.addEventListener('mousedown', event => this.onDocumentMouseDown(event), false);
    document.addEventListener('keydown', event => this.onDocumentKeyDown(event), false);
    document.addEventListener('keyup', event => this.onDocumentKeyUp(event), false);
    // document.addEventListener( 'scroll', onDocumentScroll, false );

    window.addEventListener('resize', event => this.onWindowResize(event), false);
    this.form = document.forms.myform;
    this.form.myfile.addEventListener('change', function(e) {
      var result = e.target.files[0];
      var reader = new FileReader();
      reader.readAsText(result);
      reader.addEventListener('load', function() {
        // loadFlag = true;
        const mm = JSON.parse(reader.result).material;

        for (let l = 0; l < 16; ++l) {
          this.cubeMaterial[l].color.set(colorToText(mm[l]));
          document.getElementById(colorNumTextArray[l]).value = colorToText(mm[l]);
        }

        for (const v of JSON.parse(reader.result).voxel) {
          var voxel = new THREE.Mesh(this.cubeGeo, this.cubeMaterial[v.m]);
          voxel.position.set(v.x * 50 - 25, v.y * 50 + 25, v.z * 50 - 25);
          voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
          this.scene.add(voxel);

          this.objects.push(voxel);
          this.objectsMaterial.push(this.cubeMaterial[v.m]);
        }            
      });
    });
    this.renderer.setClearColor(document.getElementById('background').value, 1.0);
  }


  onWindowResize() {

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

  }

  onDocumentMouseMove(event) {

    event.preventDefault();

    this.mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

    this.raycaster.setFromCamera(this.mouse, this.camera);

    var intersects = this.raycaster.intersectObjects(this.objects);

    if (intersects.length > 0) {

      var intersect = intersects[ 0 ];
      this.rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
      this.rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

    }

    this.render();

    // if (isShiftDown) {
    //     cameraAngle += mouse.x + mouse.y;
    //     camera.position.set(cameraZoom * Math.cos(Math.PI / 180.0 * cameraAngle), cameraZoom, cameraZoom * Math.sin(Math.PI / 180.0 * cameraAngle));
    //     camera.lookAt(0, 0, 0);
    // }
  }

  onDocumentMouseDown(event) {
    if (this.isShiftDown) {


      event.preventDefault();

      this.mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

      this.raycaster.setFromCamera(this.mouse, this.camera);

      var intersects = this.raycaster.intersectObjects(this.objects);

      if (intersects.length > 0) {

        var intersect = intersects[ 0 ];

        // delete cube

        if (this.anglePutFlag) {

          if (intersect.object !== this.plane) {

            this.scene.remove(intersect.object);

            this.objectsMaterial.splice(this.objectsMaterial.indexOf(intersect.object.material), 1);
            this.objects.splice(this.objects.indexOf(intersect.object), 1);

          }

          // create cube

        } else {

          if (this.colorChangeFlag) {
            if (intersect.object !== this.plane) {
              this.objects[ this.objects.indexOf(intersect.object) ].material = this.cubeMaterial[this.materialIndex];
            }
          } else {
            var voxel = new THREE.Mesh(this.cubeGeo, this.cubeMaterial[this.materialIndex]);
            voxel.position.copy(intersect.point).add(intersect.face.normal);
            voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
            this.scene.add(voxel);

            this.objects.push(voxel);
            this.objectsMaterial.push(this.cubeMaterial[this.materialIndex]);
          }

        }

        this.render();

      }
    }

  }

  onDocumentKeyDown(event) {

    switch (event.keyCode) {

      case 16: this.isShiftDown = true; break;

    }

  }

  onDocumentKeyUp(event) {

    switch (event.keyCode) {

      case 16: this.isShiftDown = false; break;

    }

  }

  allClear() {
    for (const v of this.objects) {
      this.scene.remove(v);
    }
    this.objects.length = 0;
    this.objects = [];
    this.objectsMaterial.length = 0;
    this.objectsMaterial = [];
    this.rollOverMesh.position.set(25, 25, 25);
    this.rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

    this.objects.push(this.plane);
  }

  boxAll(num) {
    for (let x = -num / 2; x < num / 2; ++x) {
      for (let y = 0; y < num; ++y) {
        for (let z = -num / 2; z < num / 2; ++z) {
          var voxel = new THREE.Mesh(this.cubeGeo, this.cubeMaterial[this.materialIndex]);
          voxel.position.set(x * 50, y * 50, z * 50);//copy( intersect.point ).add( intersect.face.normal );
          voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
          this.scene.add(voxel);

          this.objects.push(voxel);
          this.objectsMaterial.push(this.cubeMaterial[this.materialIndex]);
        }
      }
    }
  }

  downLoadJson() {
    for (const voxel of this.objects) {
      let i = 0;
      for (const cm of this.cubeMaterial) {
        if (voxel.material == cm) {
          break;
        }
        ++i;
      }
      if (i < 16) {
        this.contents += '{'
                      + '"x":' + ((voxel.position.x + 25) / 50) + ','
                      + '"y":' + ((voxel.position.y - 25) / 50) + ','
                      + '"z":' + ((voxel.position.z + 25) / 50) + ','
                      + '"m":' + i + '},';
      }
    }

    let material = '"material":[';
    for (let l = 0; l < 16; ++l) {
      //          for (const m of cubeMaterial) {
      this.cubeMaterial[l].color.set(document.getElementById(colorNumTextArray[l]).value);
      material += '{'
                        + '"r":' + this.cubeMaterial[l].color.r + ','
                        + '"g":' + this.cubeMaterial[l].color.g + ','
                        + '"b":' + this.cubeMaterial[l].color.b + ','
                        + '"a":' + this.cubeMaterial[l].opacity + '},';
    }
    const mat = material.substr(0, material.length - 1) + ']}';


    // var resultJson = JSON.stringify($scope.jsonObj);
    const downLoadLink = document.createElement('a');
    downLoadLink.download = 'voxel.txt';
    downLoadLink.href = URL.createObjectURL(new Blob(['{"voxel":[' + this.contents.substr(0, this.contents.length - 1) + '],' + mat], {type: 'text.plain'}));
    downLoadLink.dataset.downloadurl = ['text/plain', downLoadLink.download, downLoadLink.href].join(':');
    downLoadLink.click();
  }

  anglePut() {
    this.anglePutFlag = !this.anglePutFlag;
    if (this.anglePutFlag) {
      document.getElementById('anglePut').innerHTML = '設置';
    } else {
      document.getElementById('anglePut').innerHTML = '削除';
    }
  }

  colorChange() {
    this.colorChangeFlag = !this.colorChangeFlag;
    if (this.colorChangeFlag) {
      document.getElementById('colorChange').innerHTML = '色入替ON';
    } else {
      document.getElementById('colorChange').innerHTML = '色入替OFF';
    }

  }

  render() {
    this.renderer.setClearColor(document.getElementById('background').value, 1.0);
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    this.controls.update();
  }

}

export default Main;
