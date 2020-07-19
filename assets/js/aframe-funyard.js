AFRAME.registerComponent('lensflare', {
    init() {
        const scene = this.el.sceneEl.object3D

        const textureLoader = new THREE.TextureLoader()
        const textureFlare1 = textureLoader.load('./assets/textures/flare1.png')
        const textureFlare3 = textureLoader.load('./assets/textures/flare3.png')

        addLight(0.08, 0.8, 0.5, 340, 100, -720)

        function addLight(h, s, l, x, y, z) {
            const light = new THREE.PointLight(0xffffff, 0.1, 6000)
            light.color.setHSL(h, s, l)
            light.position.set(x, y, z)
            scene.add(light)

            const lensflare = new THREE.Lensflare()
            lensflare.addElement(new THREE.LensflareElement(textureFlare1, 700, 0, light.color))
            lensflare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.6))
            lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 0.7))
            lensflare.addElement(new THREE.LensflareElement(textureFlare3, 120, 0.9))
            lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 1))
            light.add(lensflare)
        }
    }
})

AFRAME.registerComponent('material-update', {
    schema: {
        target: { default: '' },
        ambient: { default: '#000000', type: 'color' },
        color: { default: '#000000', type: 'color' },
        emissive: { default: '#000000', type: 'color' },
        shininess: { default: 0.0 },
        specular: { default: '#000000', type: 'color' },
        src: { default: '' }
    },
    init: function () {
        const data = this.data
        this.el.addEventListener('model-loaded', function (e) {
            let object = e.detail.model
            object.traverse(function (node) {
                if (node.name === data.target) {
                    if (data.src !== '') {
                        let texPath = document.querySelector(data.src).getAttribute('src')
                        let tex = new THREE.TextureLoader().load(texPath)
                        node.material.map = tex
                    }
                    console.log(node.material)
                    node.material.ambient = new THREE.Color(data.ambient)
                    node.material.color = new THREE.Color(data.color)
                    node.material.emissive = new THREE.Color(data.emissive)
                    node.material.shininess = data.shininess
                    node.material.specular = new THREE.Color(data.specular)
                    node.material.needsUpdate = true
                }
            })
        })
    }
})

AFRAME.registerComponent('fbx-material', {
    schema: {
        src: { default: '' }
    },
    init: function () {
        const data = this.data
        let texPath = document.querySelector(data.src).getAttribute('src')
        let tex = new THREE.TextureLoader().load(texPath)
        this.el.addEventListener('model-loaded', function (e) {
            let object = e.detail.model
            object.traverse(function (node) {
                if (node.isMesh) {
                    node.material.map = tex
                    node.material.needsUpdate = true
                }
            })
        })
    }
})

AFRAME.registerComponent('ar-stabilise', {
    init: function () {}
})

AFRAME.registerComponent('only-desktop', {
    init: function () {
        let isDesktop = !AFRAME.utils.device.checkHeadsetConnected()
        console.log('isDesktop:', isDesktop)
        if (isDesktop === false) {
            this.el.parentNode.removeChild(this.el)
        }
    }
})

AFRAME.registerComponent('only-mobile', {
    init: function () {
        let isMobile = AFRAME.utils.device.isMobile()
        console.log('isMobile:', isMobile)
        if (isMobile === false) {
            this.el.parentNode.removeChild(this.el)
        }
    }
})

AFRAME.registerComponent('only-vr', {
    init: function () {
        let isVR = AFRAME.utils.device.checkHeadsetConnected()
        console.log('isVR:', isVR)
        if (isVR === false) {
            this.el.parentNode.removeChild(this.el)
        }
    }
})
AFRAME.registerComponent('particles', {
    init() {
        const scene = this.el.sceneEl.object3D

        this.t = 0
        this.c = new THREE.Clock()

        var textureLoader = new THREE.TextureLoader()

        this.particleSystem = new THREE.GPUParticleSystem({
            maxParticles: 250000,
            particleNoiseTex: textureLoader.load('./assets/textures/perlin.png'),
            particleSpriteTex: textureLoader.load('./assets/textures/particle.png')
        })

        scene.add(this.particleSystem)

        this.options = {
            position: new THREE.Vector3(),
            positionRandomness: 3,
            velocity: new THREE.Vector3(),
            velocityRandomness: 0,
            color: 0xdfbb7c,
            colorRandomness: 0,
            turbulence: 0.85,
            lifetime: 7,
            size: 1,
            sizeRandomness: 1.5
        }

        this.spawnerOptions = {
            spawnRate: 30000,
            horizontalSpeed: 1.5,
            verticalSpeed: 1.33,
            timeScale: 1
        }

        // const gui = new dat.GUI({width: 350});

        // gui.add(this.options, 'velocityRandomness', 0, 3);
        // gui.add(this.options, 'positionRandomness', 0, 3);
        // gui.add(this.options, 'size', 1, 20);
        // gui.add(this.options, 'sizeRandomness', 0, 25);
        // gui.add(this.options, 'colorRandomness', 0, 1);
        // gui.add(this.options, 'lifetime', 0.1, 10);
        // gui.add(this.options, 'turbulence', 0, 1);

        // gui.add(this.spawnerOptions, 'spawnRate', 10, 30000);
        // gui.add(this.spawnerOptions, 'horizontalSpeed', 0, 10);
        // gui.add(this.spawnerOptions, 'verticalSpeed', 0, 10);
        // gui.add(this.spawnerOptions, 'spawnRate', 10, 30000);
        // gui.add(this.spawnerOptions, 'timeScale', -1, 1);
    },

    tick() {
        const delta = this.c.getDelta() * this.spawnerOptions.timeScale

        this.t += delta

        if (this.t < 0) {
            this.t = 0
        }

        if (delta > 0) {
            // this.options.position.x = Math.sin( this.t * this.spawnerOptions.horizontalSpeed ) * 20;
            // this.options.position.y = Math.sin( this.t * this.spawnerOptions.horizontalSpeed ) * 5;
            // this.options.position.z = Math.sin( this.t * this.spawnerOptions.horizontalSpeed + this.spawnerOptions.verticalSpeed ) * 5;

            for (let x = 0; x < this.spawnerOptions.spawnRate * delta; x++) {
                this.particleSystem.spawnParticle(this.options)
            }
        }

        this.particleSystem.update(this.t)
    }
})
