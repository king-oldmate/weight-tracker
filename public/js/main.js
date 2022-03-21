const deleteBtn = document.querySelectorAll('.delete')
//const editBtn = document.querySelectorAll('.edit')

Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem)
})

// Array.from(editBtn).forEach((element) => {
//     element.addEventListener('click', editItem)
// })

async function deleteItem(){
    const dateRecord = this.parentNode.childNodes[1].innerText //gets the date from the DOM
    console.log(dateRecord)
    if (confirm('Are you sure you want to delete this entry?')){
        try{
            const response = await fetch('deleteItem', {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  'dateFromJS': dateRecord
                })
              })
            const data = await response.json()
            console.log(data)
            location.reload()
    
        }catch(err){
            console.log(err)
        }
    }
    
}