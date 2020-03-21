class Main {
        
  init() {

    for (let l = 0; l < 16; ++l) {
      document.getElementById(colorNumTextArray[l]).addEventListener('click', function() {
        materialIndex = l;
        cubeMaterial[l].color.set(document.getElementById(colorNumTextArray[l]).value);
      }, false);
      document.getElementById(colorNumTextArray[l]).addEventListener('change', function() {
        materialIndex = l;
        cubeMaterial[l].color.set(document.getElementById(colorNumTextArray[l]).value);
      }, false);
    }
    document.getElementById('background').addEventListener('click', function() {
      renderer.setClearColor(document.getElementById('background').value, 1.0);          
    });
    document.getElementById('background').addEventListener('change', function() {
      renderer.setClearColor(document.getElementById('background').value, 1.0);
    });

    // シーンを作成
    scene = new THREE.Scene();
    // カメラを作成
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(cameraZoom * Math.cos(Math.PI / 180.0 * cameraAngle), cameraZoom, cameraZoom * Math.sin(Math.PI / 180.0 * cameraAngle));
    camera.lookAt(0, 0, 0);

    var rollOverGeo = new THREE.BoxBufferGeometry(50, 50, 50);
    rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
    rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    scene.add(rollOverMesh);


    cubeGeo = new THREE.BoxBufferGeometry(50, 50, 50);
    for (let l = 0; l < 16; ++l) {
      cubeMaterial.push(new THREE.MeshLambertMaterial({ color: document.getElementById(colorNumTextArray[l]).value }));
    }

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
                
    var gridHelper = new THREE.GridHelper(2500, 50);
    scene.add(gridHelper);

    var geometry = new THREE.PlaneBufferGeometry(2500, 2500);
    geometry.rotateX(- Math.PI / 2);

    plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
    scene.add(plane);

    objects.push(plane);

    var ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    scene.add(directionalLight);

    var directionalLight2 = new THREE.DirectionalLight(0xffffff);
    directionalLight2.position.set(-1, 0.75, -0.5).normalize();
    scene.add(directionalLight2);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    document.addEventListener('mousemove', this.onDocumentMouseMove, false);
    document.addEventListener('mousedown', this.onDocumentMouseDown, false);
    document.addEventListener('keydown', this.onDocumentKeyDown, false);
    document.addEventListener('keyup', this.onDocumentKeyUp, false);
    // document.addEventListener( 'scroll', onDocumentScroll, false );

    window.addEventListener('resize', this.onWindowResize, false);
    form = document.forms.myform;
    form.myfile.addEventListener('change', function(e) {
      var result = e.target.files[0];
      var reader = new FileReader();
      reader.readAsText(result);
      reader.addEventListener('load', function() {
        // loadFlag = true;
        const mm = JSON.parse(reader.result).material;

        for (let l = 0; l < 16; ++l) {
          cubeMaterial[l].color.set(colorToText(mm[l]));
          document.getElementById(colorNumTextArray[l]).value = colorToText(mm[l]);
        }

        for (const v of JSON.parse(reader.result).voxel) {
          var voxel = new THREE.Mesh(cubeGeo, cubeMaterial[v.m]);
          voxel.position.set(v.x * 50 - 25, v.y * 50 + 25, v.z * 50 - 25);
          voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
          scene.add(voxel);

          objects.push(voxel);
          objectsMaterial.push(cubeMaterial[v.m]);
        }            
      });
    });
    renderer.setClearColor(document.getElementById('background').value, 1.0);
  }


  onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  onDocumentMouseMove(event) {

    event.preventDefault();

    mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {

      var intersect = intersects[ 0 ];
      rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
      rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

    }

    render();

    // if (isShiftDown) {
    //     cameraAngle += mouse.x + mouse.y;
    //     camera.position.set(cameraZoom * Math.cos(Math.PI / 180.0 * cameraAngle), cameraZoom, cameraZoom * Math.sin(Math.PI / 180.0 * cameraAngle));
    //     camera.lookAt(0, 0, 0);
    // }
  }

  onDocumentMouseDown(event) {
    if (isShiftDown) {


      event.preventDefault();

      mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

      raycaster.setFromCamera(mouse, camera);

      var intersects = raycaster.intersectObjects(objects);

      if (intersects.length > 0) {

        var intersect = intersects[ 0 ];

        // delete cube

        if (anglePutFlag) {

          if (intersect.object !== plane) {

            scene.remove(intersect.object);

            objectsMaterial.splice(objectsMaterial.indexOf(intersect.object.material), 1);
            objects.splice(objects.indexOf(intersect.object), 1);

          }

          // create cube

        } else {

          if (colorChangeFlag) {
            if (intersect.object !== plane) {
              objects[ objects.indexOf(intersect.object) ].material = cubeMaterial[materialIndex];
            }
          } else {
            var voxel = new THREE.Mesh(cubeGeo, cubeMaterial[materialIndex]);
            voxel.position.copy(intersect.point).add(intersect.face.normal);
            voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
            scene.add(voxel);

            objects.push(voxel);
            objectsMaterial.push(cubeMaterial[materialIndex]);
          }

        }

        render();

      }
    }

  }

  onDocumentKeyDown(event) {

    switch (event.keyCode) {

      case 16: isShiftDown = true; break;

    }

  }

  onDocumentKeyUp(event) {

    switch (event.keyCode) {

      case 16: isShiftDown = false; break;

    }

  }

}