window.onload = () => {
    const scene = document.querySelector('a-scene')
    const camera = document.querySelector('#camera')
    const cameraVR = document.querySelector('#camera-vr')
    scene.addEventListener('enter-vr', function () {
        camera.setAttribute('camera', 'active:false')
        cameraVR.setAttribute('camera', 'active:true')
    })
    scene.addEventListener('exit-vr', function () {
        camera.setAttribute('camera', 'active:true')
        cameraVR.setAttribute('camera', 'active:false')
    })
    window.addEventListener('click', function () {
        document.querySelectorAll('[sound]').forEach(entity => {
            // entity.components.sound.playSound()
            entity.play()
        })
    })
}
