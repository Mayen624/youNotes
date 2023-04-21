console.log('connected...');

let btnRemove = document.querySelectorAll('#delete-btn');
btnRemove.forEach(btn => {
    btn.addEventListener('click', () => {
        let noteId = btn.getAttribute('data-id');
        console.log(noteId);
        if (confirm('¿Estás seguro que deseas eliminar esta nota?, este proceso no podra ser revertido.')) {
            fetch(`/notes/delete/?id=${noteId}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                window.location = '/notes';
            })
        }
    })
})

const inputsKeyId = document.getElementById('sKeyId');

let btnDecryptNote = document.querySelectorAll('#btnDecryptNote');
btnDecryptNote.forEach(btn => {
    btn.addEventListener('click', () => {
        let noteId = btn.getAttribute('data-id');
        inputsKeyId.value = noteId;
    })
})


setTimeout(() => {
    document.getElementById('alerts').style.display = 'none';
}, 15000)