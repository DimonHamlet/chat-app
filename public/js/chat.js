const socket = io()

socket.on('sayHello', (hello) => {
    console.log(hello)
})
// Elements 
const $messageForm = document.getElementById('ChatForm')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    //disable
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = $messageFormInput.value

    socket.emit('sendMessage', message, (status) => {
        // enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        console.log(status)
    })
})

socket.on('viewMessage', (msg) => {
    document.getElementById('msgField').innerText += msg + '\n'
})

document.getElementById('shareId').addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Your browser doesnt support Geolocation')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('shareLocation', position.coords.latitude, position.coords.longitude,)
    })
})